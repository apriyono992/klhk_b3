import { yupResolver } from "@hookform/resolvers/yup";
import { useDisclosure } from "@nextui-org/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from 'yup';
import { deleteFetcher, postFetcher, putFetcher } from "../services/api";
import { dirtyInput, isResponseErrorObject } from "../services/helpers";

export default function useMaterial({ mutate }) {
    const formSchema =  yup.object().shape({
        casNumber: yup.string().required('Harus diisi'),
        namaBahanKimia: yup.string().required('Harus diisi'),
        namaDagang: yup.string().required('Harus diisi'),
        tipeBahan: yup.string().required('Harus diisi'),
    }).required()

    const {isOpen: isOpenModalForm, onOpen: onOpenModalForm, onOpenChange: onOpenChangeModalForm, onClose: onCloseModalForm} = useDisclosure();
    const {isOpen: isOpenModalAlert, onOpenChange: onOpenChangeModalAlert} = useDisclosure();
    const [editId, setEditId] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const { register, handleSubmit, reset, formState: { errors, isSubmitting, dirtyFields } } = useForm({resolver: yupResolver(formSchema)});

    function onClickEdit(item) {    
        setEditId(item.id);
        setIsEdit(true);
        reset({
            casNumber: item.casNumber,
            namaBahanKimia: item.namaBahanKimia,
            namaDagang: item.namaDagang,
            tipeBahan: item.tipeBahan
        });           
        onOpenChangeModalForm();
    }

    function onCloseForm() {
        setEditId(null);
        setIsEdit(false);
        reset({
            casNumber: '',
            namaBahanKimia: '',
            namaDagang: '',
            tipeBahan: ''
        });
        onCloseModalForm()
    }

    function onClickDelete(id) {
        setEditId(id);
        onOpenChangeModalAlert();
    }
    
    async function onSubmitDelete() {
        try {
            await deleteFetcher('/api/data-master/bahan-b3', editId);
            mutate()
            toast.success('Bahan B3 berhasil dihapus!');
        } catch (error) {
            toast.error('Gagal hapus Bahan B3!');
        }
    }

    async function onSubmitForm(data) {
        try {
            if (isEdit) {
                const filteredData = dirtyInput(dirtyFields, data);
                await putFetcher('/api/data-master/bahan-b3', editId, filteredData);
                mutate()
                toast.success('Bahan B3 berhasil diubah!');
            } else {
                await postFetcher('/api/data-master/bahan-b3', data);
                mutate()
                toast.success('Bahan B3 berhasil ditambah!');
            }
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
            formState: { errors, isSubmitting, dirtyFields }
        },
        isEdit,
        onClickEdit,
        onCloseForm,
        onClickDelete,
        onSubmitDelete,
        onSubmitForm,
    }
}