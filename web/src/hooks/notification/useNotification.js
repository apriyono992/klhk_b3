import { yupResolver } from "@hookform/resolvers/yup";
import { useDisclosure } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { postFetcher } from "../../services/api";
import { isResponseErrorObject } from "../../services/helpers";
import useAuth from "../useAuth";
import { createNotificationValidation } from "../../services/validation";


export default function useNotification({ mutate }) {
    const { data : user } = useAuth()
    const {isOpen: isOpenModalForm, onOpen: onOpenModalForm, onOpenChange: onOpenChangeModalForm, onClose: onCloseModalForm} = useDisclosure();
    const {isOpen: isOpenModalAlert, onOpenChange: onOpenChangeModalAlert} = useDisclosure();
    const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm({resolver: yupResolver(createNotificationValidation)});

    function onCloseForm() {
        reset({
            databahanb3Id: '',
            referenceNumber: '',
            companyId: '',
            negaraAsal:'',
        });
        onCloseModalForm()
    }

    async function onSubmitForm(data) {
        try {
            data.status = 'Diterima dari Otoritas Asal B3'
            data.changeBy = user.userId
            await postFetcher('/api/notifikasi', data);
            mutate()
            toast.success('Notifikasi berhasil ditambah!');
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
            control,
            formState: { errors, isSubmitting }
        },
        onCloseForm,
        onSubmitForm,
    }
}