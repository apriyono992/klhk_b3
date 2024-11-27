import { useDisclosure } from "@nextui-org/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { adminReportValidation } from "../../../services/validation";
import { patchFetcher, postFetcher } from "../../../services/api";

export default function useValidateDistribution({ mutate }) {
    const {isOpen: isOpenModalForm, onOpen: onOpenModalForm, onOpenChange: onOpenChangeModalForm, onClose: onCloseModalForm} = useDisclosure();
    const [editId, setEditId] = useState(null);
    const [isChecked, setIsChecked] = useState(false);
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(adminReportValidation) });

    async function onSubmitForm(data) {
        try {
            const payload = {
                status: isChecked ? 'Disetujui' : 'Ditolak',
                adminNote: data.adminNote
            }
            await postFetcher(`/api/pelaporan-bahan-b3-distribusi/review/${editId}`, payload);
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