import { yupResolver } from "@hookform/resolvers/yup";
import { useDisclosure } from "@nextui-org/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from 'yup';
import { deleteFetcher, postFetcher } from "../services/api";
import { isResponseErrorObject } from "../services/helpers";


export default function useNotification({ mutate }) {
    const formSchema =  yup.object().shape({
        companyId: yup.string().required('Harus diisi'),
    }).required()

    const {isOpen: isOpenModalForm, onOpen: onOpenModalForm, onOpenChange: onOpenChangeModalForm, onClose: onCloseModalForm} = useDisclosure();
    const {isOpen: isOpenModalAlert, onOpenChange: onOpenChangeModalAlert} = useDisclosure();
    const [editId, setEditId] = useState(null);
    const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm({resolver: yupResolver(formSchema)});

    function onCloseForm() {
        setEditId(null);
        reset({
            referenceNumber: '',
            companyId: '',
        });
        onCloseModalForm()
    }

    function onClickDelete(id) {
        setEditId(id);
        onOpenChangeModalAlert();
    }
    
    async function onSubmitDelete() {
        try {
            await deleteFetcher('/api/notifikasi', editId);
            mutate()
            toast.success('Notifikasi dibatalkan!');
        } catch (error) {
            toast.error('Gagal batalkan notifikasi!');
        }
    }

    async function onSubmitForm(data) {
        try {
            data.status = 'Diterima dari Otoritas Asal B3'
            await postFetcher('/api/notifikasi', data);
            mutate()
            console.log(data);
            
            toast.success('Notifikasi berhasil ditambah!');
            onCloseForm();
        } catch (error) {
            isResponseErrorObject(error.response.data.message)
                ? Object.entries(error.response.data.message).forEach(([key, value]) => {
                    toast.error(value);
                })
                : toast.error(error.response.data.message)
        }
    }

    return {
        modalForm: {
            isOpenModalForm,
            onOpenModalForm,
            onOpenChangeModalForm,
        },
        modalAlert: {
            isOpenModalAlert,
            onOpenChangeModalAlert,
        },
        hookForm: {
            register, 
            handleSubmit, 
            reset, 
            control,
            formState: { errors, isSubmitting }
        },
        onCloseForm,
        onClickDelete,
        onSubmitDelete,
        onSubmitForm,
    }
}