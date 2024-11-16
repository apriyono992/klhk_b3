import { yupResolver } from "@hookform/resolvers/yup";
import { useDisclosure } from "@nextui-org/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { postFetcher, putFetcher } from "../../../services/api";
import { isResponseErrorObject } from "../../../services/helpers";
import { b3Storage } from "../../../services/validation";

export default function useCreateStorage({ mutate }) {
    const {isOpen: isOpenModalForm, onOpen: onOpenModalForm, onOpenChange: onOpenChangeModalForm, onClose: onCloseModalForm} = useDisclosure();
    const [editId, setEditId] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const { register, handleSubmit, control, reset, formState: { errors, isSubmitting, dirtyFields } } = useForm({resolver: yupResolver(b3Storage)});

    function onClickEdit(item) {    
        setEditId(item.id);
        setIsEdit(true);
        reset({
            companyId: item.companyId,   
            alamatGudang: item.alamatGudang,   
            longitude: item.longitude,
            latitude: item.latitude,
            luasArea: item.luasArea,   
        });           
        onOpenChangeModalForm();
    }

    function onCloseForm() {
        setEditId(null);
        setIsEdit(false);
        reset({
            companyId: '',   
            alamatGudang: '',   
            longitude: '',
            latitude: '',
            luasArea: '',   
        });
        onCloseModalForm()
    }

    async function onSubmitForm(data) {
        try {
            if (isEdit) {
                await putFetcher('/api/penyimpananB3', editId, data);
                mutate()
                toast.success('Gudang B3 berhasil diubah!');
            } else {
                await postFetcher('/api/penyimpananB3/create', data);
                mutate()
                toast.success('Gudang B3 berhasil ditambah!');
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
        hookForm: {
            register, 
            handleSubmit, 
            control,
            reset, 
            formState: { errors, isSubmitting, dirtyFields }
        },
        isEdit,
        onClickEdit,
        onCloseForm,
        onSubmitForm,
    }
}