import { yupResolver } from "@hookform/resolvers/yup";
import { useDisclosure } from "@nextui-org/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { patchFetcher, postFetcher, putFetcher } from "../services/api";
import { dirtyInput, isResponseErrorObject } from "../services/helpers";
import { periodValidation } from "../services/validation";
import { format } from "date-fns";

export default function usePeriod({ mutate }) {
    const {isOpen: isOpenModalForm, onOpen: onOpenModalForm, onOpenChange: onOpenChangeModalForm, onClose: onCloseModalForm} = useDisclosure();
    const { register, control, handleSubmit, reset, formState: { errors, isSubmitting, dirtyFields } } = useForm({resolver: yupResolver(periodValidation)});

    async function onClickEdit(id) {    
        try {
            await patchFetcher(`/api/period/set-active`, id);
            mutate()
            toast.success('Periode diaktifkan!');
        } catch (error) {
            isResponseErrorObject(error.response.data.message)
                ? Object.entries(error.response.data.message).forEach(([key, value]) => {
                    toast.error(value);
                })
                : toast.error(error.response.data.message)
        }
    }

    function onCloseForm() {
        reset({
            name: '',   
            startDate: '',
            endDate: '',
            finalizationDeadline: '',
            isActive: ''
        });
        onCloseModalForm()
    }

    async function onSubmitForm(data) {
        try {
            await postFetcher('/api/period/create', data);
            mutate()
            toast.success('Periode berhasil ditambah!');
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
            control,
            handleSubmit, 
            reset, 
            formState: { errors, isSubmitting, dirtyFields }
        },
        onClickEdit,
        onCloseForm,
        onSubmitForm,
    }
}