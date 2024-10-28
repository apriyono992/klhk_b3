import { yupResolver } from "@hookform/resolvers/yup";
import { useDisclosure } from "@nextui-org/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from 'yup';

export default function useRecomendationVehicle() {
    const formSchema =  yup.object().shape({
        noPolisi: yup.string().required('Harus diisi'),
        modelKendaraan: yup.string().required('Harus diisi'),
        tahunPembuatan: yup.number()
                        .typeError('Tahun harus valid')
                        .integer('Harus angka').min(1900, 'Tahun tidak valid')
                        .max(2099, `Tahun tidak valid`)
                        .required('Harus diisi'),
        nomorRangka: yup.string().required('Harus diisi'),
        nomorMesin: yup.string().required('Harus diisi'),    
        kepemilikan: yup.string().required('Harus diisi'),  
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
            noPolisi: item.title,
            modelKendaraan: item.category,
            tahunPembuatan: item.minimumOrderQuantity,
            nomorRangka: item.meta.barcode,
            nomorMesin: item.warrantyInformation,
            kepemilikan: item.availabilityStatus,
        });           
        onOpenChangeModalForm();
    }

    function onCloseForm() {
        setEditId(null);
        setIsEdit(false);
        reset({
            noPolisi: '',
            modelKendaraan: '',
            tahunPembuatan: '',
            nomorRangka: '',
            nomorMesin: '',
            kepemilikan: '',
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
            toast.success('Data kendaraan berhasil dihapus!');
        } catch (error) {
            toast.error('Gagal hapus data kendaraan!');
        }
    }

    async function onSubmitForm(data) {
        try {
            await new Promise((r) => setTimeout(r, 1000));
            if (isEdit) {
                console.log(editId);
                console.log(data);
                toast.success('Data kendaraan berhasil diubah!');
            } else {
                console.log(data);
                toast.success('Kendaraan berhasil ditambah!');
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