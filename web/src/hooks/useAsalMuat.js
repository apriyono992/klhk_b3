import { yupResolver } from "@hookform/resolvers/yup";
import { useDisclosure } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { deleteFetcher, getFetcher, postFetcher, putFetcher } from "../services/api";
import { dirtyInput, isResponseErrorObject } from "../services/helpers";
import { asalMuatValidation } from "../services/validation";
import useSWR from "swr";

export default function useAsalMuat({ mutate }) {
    const {isOpen: isOpenModalForm, onOpen: onOpenModalForm, onOpenChange: onOpenChangeModalForm, onClose: onCloseModalForm} = useDisclosure();
    const [editId, setEditId] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const { register, handleSubmit, reset, control, watch, setValue, formState: { errors, isSubmitting, dirtyFields } } = useForm({resolver: yupResolver(asalMuatValidation)});
    const provinceId = watch('provinceId')
    const regencyId = watch('regencyId')
    const districtId = watch('districtId')
    const { data: dataProvince } = useSWR('/api/location/provinces', getFetcher)
    const { data: dataRegency } = useSWR(provinceId ? `/api/location/cities?provinceId=${provinceId}`: null, getFetcher)
    const { data: dataDistrict } = useSWR(regencyId ? `/api/location/districts?regencyId=${regencyId}`: null, getFetcher)
    const { data: dataVillage } = useSWR(districtId ? `/api/location/villages?districtId=${districtId}`: null, getFetcher)

    function onClickEdit(item) {    
        setEditId(item.id);
        setIsEdit(true);
        reset({
            companyId: item.companyId,
            namaPerusahaan: item.namaPerusahaan,
            alamat: item.alamat,   
            locationType: item.locationType,   
            latitude: item.latitude,   
            longitude: item.longitude,   
            provinceId: item.provinceId,  
            regencyId: item.regencyId,
            districtId: item.districtId,
            villageId: item.villageId  
        });
        onOpenChangeModalForm();
    }

    function onCloseForm() {
        setEditId(null);
        setIsEdit(false);
        reset({
            companyId: '',
            namaPerusahaan: '',
            alamat: '',
            locationType: '',
            latitude: '',
            longitude: '',
            provinceId: '',
            regencyId: '',
            districtId: '',
            villageId: '',
        });
        onCloseModalForm()
    }
    
    async function onSubmitDelete(id) {
        try {
            await deleteFetcher('/api/company/asal-muat', id);
            mutate()
            toast.success('Asal muat berhasil dihapus!');
        } catch (error) {
            toast.error('Gagal hapus asal muat!');
        }
    }

    async function onSubmitForm(data) {
        try {
            if (isEdit) {
                await postFetcher(`/api/company/asal-muat/${editId}`, data);
                mutate()
                toast.success('Asal muat berhasil diubah!');
            } else {
                await postFetcher('/api/company/asal-muat', data);
                mutate()
                toast.success('Asal muat berhasil ditambah!');
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
            handleSubmit, 
            register,
            reset, 
            control,
            setValue,
            formState: { errors, isSubmitting, dirtyFields }
        },
        fetchData: {
            dataProvince,
            dataRegency,
            dataDistrict,
            dataVillage
        },
        isEdit,
        onClickEdit,
        onCloseForm,
        onSubmitDelete,
        onSubmitForm,
        dataVillage,
    }
}