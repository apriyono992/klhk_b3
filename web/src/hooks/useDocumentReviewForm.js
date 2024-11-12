import { yupResolver } from "@hookform/resolvers/yup";
import { useDisclosure } from "@nextui-org/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from 'yup';
import { patchFetcherWithoutId, postFetcher } from "../services/api";
import useAuth from "./useAuth";

export default function useDucumentReviewForm({ mutate }) {
    const {isOpen: isOpenModalForm, onOpen: onOpenModalForm, onOpenChange: onOpenChangeModalForm, onClose: onCloseModalForm} = useDisclosure();
    const {isOpen: isOpenModalAlert, onOpenChange: onOpenChangeModalAlert} = useDisclosure();
    const [editId, setEditId] = useState(null);

    const schema = yup.object({
        isValid: yup.boolean().oneOf([true, false], 'Isi harus valid atau tidak valid'),
        validationNotes: yup.string().when('isValid', (isValid, schema) => {
            if (isValid[0] === true) {
                return schema.notRequired();
            }
            return schema.required('Catatan harus diisi jika dokumen tidak valid');
        }),
    }).required();

    const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm({resolver: yupResolver(schema)});
    const { data: user } = useAuth()

    async function onSubmitForm(data) {
        try {
            data.documenttelaahId = editId;
            console.log(data);
            await postFetcher('/api/documents/validateTelaah', data);
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
                status: 'VALIDASI_PEMOHONAN_SELESAI',
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
            isValid: '',
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
            formState: {errors,isSubmitting}
        },
        watch,
        onCloseForm, 
        onSubmitForm,
        onClickEdit,
        onValidate
    }
}