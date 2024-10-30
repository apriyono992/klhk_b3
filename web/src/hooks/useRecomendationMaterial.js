import { yupResolver } from "@hookform/resolvers/yup";
import { useDisclosure } from "@nextui-org/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from 'yup';

export default function useRecomendationMaterial({ mutate }) {
    const formSchema =  yup.object().shape({
        casNumber: yup.string().required('Harus diisi'),
        namaDagang: yup.string().required('Harus diisi'),   
        namaBahanKimia: yup.string().required('Harus diisi'),
        b3pp74: yup.boolean().oneOf([true, false], 'Isi harus valid atau tidak valid'),   
        karakteristikB3: yup.string().required('Harus diisi'),
        fasaB3: yup.string().required('Harus diisi'),
        jenisKemasan: yup.string().required('Harus diisi'),
        tujuanPenggunaan: yup.string().required('Harus diisi'), 
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
            casNumber: item.sku,
            namaDagang: item.title,   
            namaBahanKimia: item.brand,
            b3pp74: true,   
            karakteristikB3: item.category,
            fasaB3: item.availabilityStatus,
            jenisKemasan: item.returnPolicy,
            tujuanPenggunaan: item.shippingInformation,
        });           
        onOpenChangeModalForm();
    }

    function onCloseForm() {
        setEditId(null);
        setIsEdit(false);
        reset({
            casNumber: '',
            namaDagang: '',   
            namaBahanKimia: '',
            b3pp74: false,   
            karakteristikB3: '',
            fasaB3: '',
            jenisKemasan: '',
            tujuanPenggunaan: '',
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
            toast.success('Data bahan b3 berhasil dihapus!');
        } catch (error) {
            toast.error('Gagal hapus data bahan b3!');
        }
    }

    async function onSubmitForm(data) {
        try {
            await new Promise((r) => setTimeout(r, 1000));
            if (isEdit) {
                console.log(editId);
                console.log(data);
                toast.success('Data bahan b3 berhasil diubah!');
            } else {
                console.log(data);
                toast.success('Bahan b3 berhasil ditambah!');
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