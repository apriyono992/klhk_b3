import { Button, useDisclosure } from "@nextui-org/react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { patchFetcher, putFetcher } from "../../../services/api";
import { adminReportValidation } from "../../../services/validation";
import { yupResolver } from "@hookform/resolvers/yup";

export default function useValidateTransport({ mutate }) {
    const {isOpen: isOpenModalForm, onOpen: onOpenModalForm, onOpenChange: onOpenChangeModalForm, onClose: onCloseModalForm} = useDisclosure();
    const [editId, setEditId] = useState(null);
    const [isChecked, setIsChecked] = useState(false);
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(adminReportValidation)});

    async function onSubmitForm(data) {
        try {
            const payload = {
                status: isChecked ? 'Disetujui' : 'Ditolak',
                adminNote: data.adminNote
            }
            console.log(data);
            await putFetcher('/api/pelaporan-pengangkutan/review', editId, payload);
            mutate()
            toast.success('Status laporan berhasil diubah!');
            onCloseForm();
        } catch (error) {
            console.log(error);
            toast.error('Gagal ubah status laporan!');
        }
    }

    function onCloseForm() {
        setEditId(null);
        setIsChecked(false);
        reset({
            status: '',
            adminNote: '',   
        });
        onCloseModalForm();
    }

    function onClickEdit(id) {         
        setEditId(id);            
        onOpenModalForm();
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
        isChecked,
        setIsChecked
    }
}