import { yupResolver } from "@hookform/resolvers/yup";
import { useDisclosure } from "@nextui-org/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from 'yup';
import { postFetcher } from "../services/api";

export default function useValidationForm({ mutate }) {
    const {isOpen: isOpenModalForm, onOpen: onOpenModalForm, onOpenChange: onOpenChangeModalForm, onClose: onCloseModalForm} = useDisclosure();
    const {isOpen: isOpenModalAlert, onOpenChange: onOpenChangeModalAlert} = useDisclosure();
    const [editId, setEditId] = useState(null);

    const schema =  yup.object().shape({
        isValid: yup.boolean().oneOf([true, false], 'Isi harus valid atau tidak valid'),
        validationNotes: yup.string().required('Harus diisi'),   
    }).required()

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({resolver: yupResolver(schema)});

    async function onSubmitForm(data) {
        try {
            console.log(editId);
            data.documentId = editId;
            console.log(data);
            await postFetcher('/api/documents/validate', data);
            mutate()
            toast.success('Status dokumen berhasil diubah!');
            onCloseForm();
        } catch (error) {
            console.log(error);
            toast.error('Gagal ubah status dokumen!');
        }
    }

    async function onValidate() {
        try {
            await new Promise((r) => setTimeout(r, 1000));
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
        onCloseForm, 
        onSubmitForm,
        onClickEdit,
        onValidate
    }
}