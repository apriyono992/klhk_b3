import { yupResolver } from "@hookform/resolvers/yup";
import { useDisclosure } from "@nextui-org/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from 'yup';
import { deleteFetcher, postFetcher, putFetcher } from "../services/api";
import { dirtyInput, isResponseErrorObject } from "../services/helpers";
import { TipePerusahaan } from "../enums/tipePerusahaan.ts";
import { SkalaPerusahaan } from "../enums/skalaPerusahaan.ts";

export default function useCompany({ mutate }) {
    const formSchema =  yup.object().shape({
        name: yup.string().required('Harus diisi'),
        penanggungJawab: yup.string().required('Harus diisi'),
        alamatKantor: yup.string().required('Harus diisi'),
        telpKantor: yup.string().required('Harus diisi'),
        faxKantor: yup.string().required('Harus diisi'),
        emailKantor: yup.string().required('Harus diisi'),
        npwp: yup.string().required('Harus diisi'),
        // alamatPool: yup.string().required('Harus diisi'),
        bidangUsaha: yup.string().required('Harus diisi'),
        nomorInduk: yup.string().required('Harus diisi'),
        tipePerusahaan: yup.array().of(yup.string().required()).min(1, 'Tipe Perusahaan harus dipilih'),
        skalaPerusahaan: yup.string().nullable(),
    }).required()

    const {isOpen: isOpenModalForm, onOpen: onOpenModalForm, onOpenChange: onOpenChangeModalForm, onClose: onCloseModalForm} = useDisclosure();
    const {isOpen: isOpenModalAlert, onOpenChange: onOpenChangeModalAlert} = useDisclosure();
    const [editId, setEditId] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const { register, handleSubmit, reset, formState: { errors, isSubmitting, dirtyFields }, watch, control, } = useForm({resolver: yupResolver(formSchema)});

    function onClickEdit(item) {    
        setEditId(item.id);
        setIsEdit(true);
        reset({
            name: item.name,
            penanggungJawab: item.penanggungJawab,
            alamatKantor: item.alamatKantor,
            telpKantor: item.telpKantor,
            faxKantor: item.faxKantor,
            emailKantor: item.emailKantor,
            npwp: item.npwp,
            alamatPool: item.alamatPool,
            bidangUsaha: item.bidangUsaha,
            nomorInduk: item.nomorInduk,
            tipePerusahaan: item.tipePerusahaan || [],
            skalaPerusahaan: item.skalaPerusahaan || null,
        });           
        onOpenChangeModalForm();
    }

    function onCloseForm() {
        setEditId(null);
        setIsEdit(false);
        reset({
            name: '',
            penanggungJawab: '',
            alamatKantor: '',
            telpKantor: '',
            faxKantor: '',
            emailKantor: '',
            npwp: '',
            alamatPool: '',
            bidangUsaha: '',
            nomorInduk: '',
            tipePerusahaan: [],
            skalaPerusahaan: null,
        });
        onCloseModalForm()
    }

    function onClickDelete(id) {
        setEditId(id);
        onOpenChangeModalAlert();
    }
    
    async function onSubmitDelete() {
        try {
            await deleteFetcher('/api/company', editId);
            mutate()
            toast.success('Perusahaan berhasil dihapus!');
        } catch (error) {
            toast.error('Gagal hapus perusahaan!');
        }
    }

    async function onSubmitForm(data) {
        try {
            if (isEdit) {
                const filteredData = dirtyInput(dirtyFields, data);
                await putFetcher('/api/company/update-company', editId, filteredData);
                mutate()
                toast.success('Perusahaan berhasil diubah!');
            } else {
                await postFetcher('/api/company', data);
                mutate()
                toast.success('Perusahaan berhasil ditambah!');
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
        watch,
        control,
    }
}