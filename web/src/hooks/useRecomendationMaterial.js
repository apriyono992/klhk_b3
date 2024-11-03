import { yupResolver } from "@hookform/resolvers/yup";
import { useDisclosure } from "@nextui-org/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { deleteFetcher, postFetcher, putFetcherWithoutId } from "../services/api";
import { dirtyInput, formDataWithParsedLocation, isResponseErrorObject } from "../services/helpers";
import { reviewMaterialSchema } from "../services/validation";

export default function useRecomendationMaterial({ mutate }) {
    const {isOpen: isOpenModalForm, onOpen: onOpenModalForm, onOpenChange: onOpenChangeModalForm, onClose: onCloseModalForm} = useDisclosure();
    const {isOpen: isOpenModalAlert, onOpenChange: onOpenChangeModalAlert} = useDisclosure();
    const [applicationId, setApplicationId] = useState(null);
    const [editId, setEditId] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const { register, handleSubmit, control, reset, formState: { errors, isSubmitting, dirtyFields } } = useForm({
        resolver: yupResolver(reviewMaterialSchema),
        defaultValues: {
            asalMuat: [
                { name: "", alamat: "", longitude: "", latitude: "" }, 
            ],
            tujuanBongkar: [
                { name: "", alamat: "", longitude: "", latitude: "" },
            ],
        },
    });

    function onClickCreate(applicationId) {
        setApplicationId(applicationId);
        onOpenModalForm()
    }

    function onClickEdit(item) {
        setEditId(item.id);    
        setIsEdit(true);
        reset({
            dataBahanB3Id: item.dataBahanB3Id,  
            b3pp74: item.b3pp74,   
            b3DiluarList: item.b3DiluarList,   
            karakteristikB3: item.karakteristikB3,
            fasaB3: item.fasaB3,
            jenisKemasan: item.jenisKemasan,
            asalMuat: item?.asalMuatLocations?.map((location) => ({
                name: location.name,
                alamat: location.alamat,
                longitude: location.longitude,
                latitude: location.latitude
            })),
            tujuanBongkar: item?.tujuanBongkarLocations?.map((location) => ({
                name: location.name,
                alamat: location.alamat,
                longitude: location.longitude,
                latitude: location.latitude
            })),
            tujuanPenggunaan: item.tujuanPenggunaan,
        });           
        onOpenChangeModalForm();
    }

    function onCloseForm() {
        setEditId(null);
        setIsEdit(false);
        reset({
            dataBahanB3Id: '',
            b3pp74: '',   
            b3DiluarList: '',   
            karakteristikB3: '',
            fasaB3: '',
            jenisKemasan: '',
            asalMuat: [{ name: "", alamat: "", longitude: "", latitude: "" }],
            tujuanBongkar: [{ name: "", alamat: "", longitude: "", latitude: "" }],
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
            console.log(editId);
            await deleteFetcher(`/api/b3-substance`, editId);
            mutate();
            toast.success('Data bahan b3 berhasil dihapus!');
        } catch (error) {
            toast.error('Gagal hapus data bahan b3!');
        }
    }

    async function onSubmitForm(data) {
        try {
            if (isEdit) {
                const filteredData = dirtyInput(dirtyFields, data);
                filteredData.dataBahanB3Id = editId;
                const transformedData = formDataWithParsedLocation(filteredData);
                console.log(transformedData);
                
                await putFetcherWithoutId(`/api/b3-substance/`, transformedData); 
                mutate();                
                toast.success('Data bahan b3 berhasil diubah!');
            } else {
                data.applicationId = applicationId;                
                const transformedData = formDataWithParsedLocation(data);
                await postFetcher('/api/b3-substance/', transformedData);
                mutate()
                toast.success('Bahan b3 berhasil ditambah!');
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
            control, 
            reset, 
            formState: { errors, isSubmitting, dirtyFields }
        },
        isEdit,
        onClickCreate,
        onClickEdit,
        onCloseForm,
        onClickDelete,
        onSubmitDelete,
        onSubmitForm,
    }
}