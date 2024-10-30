import { yupResolver } from "@hookform/resolvers/yup";
import { useDisclosure } from "@nextui-org/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from 'yup';
import { deleteFetcher, deleteWithFormFetcher, postFetcher, putFetcherWithoutId } from "../services/api";
import { isResponseErrorObject } from "../services/helpers";

export default function useRecomendationVehicle({ mutate }) {
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
    const [vehicleId, setVehicleId] = useState(null);
    const [applicationId, setApplicationId] = useState(null);
    const [companyId, setCompanyId] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({resolver: yupResolver(formSchema)});

    function onClickCreate(applicationId, companyId) {
        setApplicationId(applicationId);
        setCompanyId(companyId);
        onOpenModalForm()
    }

    function onClickEdit(item) {    
        setVehicleId(item.id);
        setIsEdit(true);
        reset({
            noPolisi: item.noPolisi,
            modelKendaraan: item.modelKendaraan,
            tahunPembuatan: item.tahunPembuatan,
            nomorRangka: item.nomorRangka,
            nomorMesin: item.nomorMesin,
            kepemilikan: item.kepemilikan,
        });           
        onOpenChangeModalForm();
    }

    function onCloseForm() {
        setVehicleId(null);
        setApplicationId(null);
        setCompanyId(null);
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

    function onClickDelete(vehicleId, applicationId) {
        setVehicleId(vehicleId);
        setApplicationId(applicationId)
        onOpenChangeModalAlert();
    }
    
    async function onSubmitDelete() {
        try {
            const data = {
                vehicleId: vehicleId,
                applicationId: applicationId
            }
            console.log(data);
            
            await deleteWithFormFetcher('/api/vehicles/vehicle/application/remove-vehicle', data);
            mutate();
            toast.success('Data kendaraan berhasil dihapus!');
        } catch (error) {
            toast.error('Gagal hapus data kendaraan!');
        }
    }

    async function onSubmitForm(data) {
        try {
            if (isEdit) {
                data.vehicleId = vehicleId;
                console.log(data);
                await putFetcherWithoutId('/api/vehicles', data);
                mutate();
                toast.success('Data kendaraan berhasil diubah!');
            } else {
                data.applicationId = applicationId;
                data.companyId = companyId;
                console.log(data);
                await postFetcher('/api/vehicles/add-to-application', data);
                mutate()
                toast.success('Kendaraan berhasil ditambah!');
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
        onClickCreate,
        onClickEdit,
        onCloseForm,
        onClickDelete,
        onSubmitDelete,
        onSubmitForm,
    }
}