import { yupResolver } from "@hookform/resolvers/yup";
import { modal, useDisclosure } from "@nextui-org/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { validateStorageValidation } from "../../../services/validation";
import useAuth from "../../useAuth";
import { postFetcher, putFetcherWithoutId } from "../../../services/api";
import { isResponseErrorObject } from "../../../services/helpers";

export default function useValidateImage({ mutate }) {
    const {isOpen: isOpenModalForm, onOpen: onOpenModalForm, onOpenChange: onOpenChangeModalForm, onClose: onCloseModalForm} = useDisclosure();
    const {isOpen: isOpenModalAlert, onOpenChange: onOpenChangeModalAlert} = useDisclosure();
    const {isOpen: isOpenModelImage, onOpenChange: onOpenChangeModalImage} = useDisclosure();
    const [editId, setEditId] = useState(null);
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({resolver: yupResolver(validateStorageValidation)});
    const { data: user } = useAuth()

    async function onSubmitForm(data) {
        try {
            data.penyimpananB3PersyaratanId = editId;
            data.userId = user.userId;
            console.log(data);
            await postFetcher('/api/penyimpananB3/validate-document', data);
            mutate()
            toast.success('Status dokumen berhasil diubah!');
            onCloseForm();
        } catch (error) {
            isResponseErrorObject(error.response.data.message)
                ? Object.entries(error.response.data.message).forEach(([key, value]) => {
                    toast.error(value);
                })
                : toast.error(error.response.data.message)
        }
    }

    function onCloseForm() {
        setEditId(null);
        reset({
            isValid: '',
            validationNotes: '',   
        });
        onCloseModalForm();
    }

    function onClickEdit(item) {     
        console.log(item);
            
        setEditId(item.id);
        reset({
            isValid: item.isApproved,   
            validationNotes: item.notes,
        })            
        onOpenModalForm();
    }

    async function onValidate(penyimpananB3Id, isValid) {
        try {            
            const data = {
                penyimpananB3Id: penyimpananB3Id,
                isValid: isValid,
                status: isValid ? 'Approved' : 'Rejected',
                userId: user.userId
            }
            await postFetcher('/api/penyimpananB3/validate-penyimpanan', data);
            toast.success('Status gudang berhasil diubah')
            onOpenChangeModalAlert()
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
            onOpenChangeModalForm
        },
        hookForm: {
            register,
            handleSubmit,
            formState: {errors,isSubmitting}
        },
        onCloseForm, 
        onSubmitForm,
        onClickEdit,
        onValidate
    }
}