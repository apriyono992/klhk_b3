import { yupResolver } from "@hookform/resolvers/yup";
import { useDisclosure } from "@nextui-org/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from 'yup';
import { deleteFetcher, postFetcher, putFetcher } from "../services/api";
import { dirtyInput, isResponseErrorObject } from "../services/helpers";

export default function useCarbonCopy({ mutate }) {
    const formSchema =  yup.object().shape({
        nama: yup.string().required('Harus diisi'),
        tipe: yup.string().required('Harus diisi'),
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
            nama: item.nama,
            tipe: item.tipe,   
        });           
        onOpenChangeModalForm();
    }

    function onCloseForm() {
        setEditId(null);
        setIsEdit(false);
        reset({
            nama: '',
            tipe: '',
        });
        onCloseModalForm()
    }

    function onClickDelete(id) {
        setEditId(id);
        onOpenChangeModalAlert();
    }
    
    async function onSubmitDelete() {
        try {
            await deleteFetcher('/api/data-master/tembusan', editId);
            mutate()
            toast.success('Tembusan berhasil dihapus!');
        } catch (error) {
            toast.error('Gagal hapus tembusan!');
        }
    }

    async function onSubmitForm(data) {
        try {
            if (isEdit) {
                const filteredData = dirtyInput(dirtyFields, data);
                await putFetcher('/api/data-master/tembusan', editId, filteredData);
                mutate()
                toast.success('Tembusan berhasil diubah!');
            } else {
                await postFetcher('/api/data-master/tembusan', data);
                mutate()
                toast.success('Tembusan berhasil ditambah!');
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