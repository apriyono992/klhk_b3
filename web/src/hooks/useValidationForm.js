import { yupResolver } from "@hookform/resolvers/yup";
import { useDisclosure } from "@nextui-org/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from 'yup';
import { patchFetcherWithoutId, postFetcher } from "../services/api";
import useAuth from "./useAuth";
import StatusRekomendasi from "../enums/statusRekomendasi";

export default function useValidationForm({ mutate }) {
    const {isOpen: isOpenModalForm, onOpen: onOpenModalForm, onOpenChange: onOpenChangeModalForm, onClose: onCloseModalForm} = useDisclosure();
    const {isOpen: isOpenModalAlert, onOpenChange: onOpenChangeModalAlert} = useDisclosure();
    const [editId, setEditId] = useState(null);

    const schema = yup.object({
        isNotValid: yup.boolean().oneOf([true, false], 'Isi harus valid atau tidak valid'),
        validationNotes: yup.string().when('isNotValid', (isNotValid, schema) => {
            if (isNotValid[0] === false) {
                return schema.notRequired();
            }
            return schema.required('Catatan harus diisi jika dokumen tidak valid');
        }),
    }).required();
    
    
    const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm({resolver: yupResolver(schema)});
    const { user, roles } = useAuth()

    async function onSubmitForm(data) {
        try {
            const datas = {
                documentId: editId,
                isValid:data.isNotValid === true ? false : true,
                validationNotes: data.validationNotes,
            }
            await postFetcher('/api/documents/validate', datas);
            mutate()
            toast.success('Status dokumen berhasil diubah!');
            onCloseForm();
        } catch (error) {
            console.log(error);
            toast.error('Gagal ubah status dokumen!');
        }
    }

    async function onValidate(applicationId) {
        try {
            const data = {
                applicationId: applicationId,
                status: StatusRekomendasi.PEMBUATAN_DRAFT_SK,
                userId: user.userId
            }
            await patchFetcherWithoutId('/api/rekom/permohonan/status', data);
            mutate()
            toast.success('Validasi teknis selesai!');
        } catch (error) {
            toast.error('Gagal validasi!');
        }
    }

    function onCloseForm() {
        setEditId(null);
        reset({
            isNotValid: false,
            validationNotes: '',   
        });
        onCloseModalForm();
    }

    function onClickEdit(item) {         
        setEditId(item.id);            
        onOpenModalForm();
    }

    return {
        modalForm: {
            isOpenModalForm,
            onOpenChangeModalForm
        },
        modalAlert: {
            isOpenModalAlert,
            onOpenChangeModalAlert
        },
        hookForm: {
            register,
            handleSubmit,
            watch,
            formState: {errors,isSubmitting}
        },
        onCloseForm, 
        onSubmitForm,
        onClickEdit,
        onValidate
    }
}