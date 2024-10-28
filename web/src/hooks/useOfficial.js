import { yupResolver } from "@hookform/resolvers/yup";
import { useDisclosure } from "@nextui-org/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from 'yup';

export default function useOfficial() {
    const formSchema =  yup.object().shape({
        nip: yup.string().required('Harus diisi'),
        nama: yup.string().required('Harus diisi'),
        status: yup.string().required('Harus diisi'),
    }).required()

    const {isOpen: isOpenModalForm, onOpen: onOpenModalForm, onOpenChange: onOpenChangeModalForm, onClose: onCloseModalForm} = useDisclosure();
    const {isOpen: isOpenModalAlert, onOpenChange: onOpenChangeModalAlert} = useDisclosure();
    const [editId, setEditId] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({resolver: yupResolver(formSchema)});

    function onClickEdit(item) {    
        setEditId(item.id);
        setIsEdit(true);
        reset({
            nip: item.nip,   
            nama: item.nama,
            status: item.status,
        });           
        onOpenChangeModalForm();
    }

    function onCloseForm() {
        setEditId(null);
        setIsEdit(false);
        reset({
            nip: '',
            nama: '',
            status: '',
        });
        onCloseModalForm()
    }

    function onClickDelete(id) {
        setEditId(id);
        onOpenChangeModalAlert();
    }
    
    async function onSubmitDelete() {
        try {
            await new Promise((r) => setTimeout(r, 1000));
            console.log(editId);
            toast.success('Pejabat berhasil dihapus!');
        } catch (error) {
            toast.error('Gagal hapus pejabat!');
        }
    }

    async function onSubmitForm(data) {
        try {
            await new Promise((r) => setTimeout(r, 1000));
            if (isEdit) {
                console.log(editId);
                console.log(data);
                toast.success('Pejabat berhasil diubah!');
            } else {
                console.log(data);
                toast.success('Pejabat berhasil ditambah!');
            }
            onCloseForm();
        } catch (error) {
            toast.success('Error submit form!');
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
            formState: { errors, isSubmitting }
        },
        isEdit,
        onClickEdit,
        onCloseForm,
        onClickDelete,
        onSubmitDelete,
        onSubmitForm,
    }
}