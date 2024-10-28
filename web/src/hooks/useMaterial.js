import { yupResolver } from "@hookform/resolvers/yup";
import { useDisclosure } from "@nextui-org/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from 'yup';

export default function useMaterial() {
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
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({resolver: yupResolver(formSchema)});

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
            await new Promise((r) => setTimeout(r, 1000));
            console.log(editId);
            toast.success('Bahan B3 berhasil dihapus!');
        } catch (error) {
            toast.error('Gagal hapus Bahan B3!');
        }
    }

    async function onSubmitForm(data) {
        try {
            await new Promise((r) => setTimeout(r, 1000));
            if (isEdit) {
                console.log(editId);
                console.log(data);
                toast.success('Bahan B3 berhasil diubah!');
            } else {
                console.log(data);
                toast.success('Bahan B3 berhasil ditambah!');
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