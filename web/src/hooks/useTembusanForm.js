import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDisclosure } from '@nextui-org/react';
import toast from 'react-hot-toast';
import { deleteFetcher, postFetcher, putFetcher} from '../services/api';
import { dirtyInput, isResponseErrorObject } from "../services/helpers";

// Define the validation schema
const schema = yup.object().shape({
    tembusanIds: yup.array().of(yup.string()).min(1, "Please select at least one tembusan."),
    nama: yup.string().required("Nama is required"),
    tipe: yup.string().required("Tipe is required"),
});

export default function useTembusanForm({ mutate, existingTembusan }) {
    const { isOpen: isEditModalOpen, onOpen: onOpenModalForm, onOpenChange: onOpenChangeModalForm, onClose: onCloseModalForm } = useDisclosure();
    const [selectedItems, setSelectedItems] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [editItemIndex, setEditItemIndex] = useState(null);

    const { control, handleSubmit, setValue, register, reset, formState: { errors, isSubmitting, dirtyFields } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: { tembusanIds: [], nama: "", tipe: "" }
    });

    // Initialize selected items and tembusanIds from existingTembusan
    useEffect(() => {
        if (existingTembusan) {
            const defaultItems = existingTembusan.map(item => ({
                id: item.id,
                label: item.nama,
                position: ""
            }));
            setSelectedItems(defaultItems);
            setValue("tembusanIds", existingTembusan.map(item => item.id));
        }
    }, [existingTembusan, setValue]);

    const handleSelectChange = (selectedOptions) => {
        const newItems = selectedOptions.map(option => ({
            id: option.value,
            label: option.label,
            position: ""
        }));
        setSelectedItems(newItems);
        setValue("tembusanIds", selectedOptions.map(option => option.value));
    };

    const handleDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination || source.index === destination.index) return;

        const reorderedItems = [...selectedItems];
        const [movedItem] = reorderedItems.splice(source.index, 1);
        reorderedItems.splice(destination.index, 0, movedItem);
        setSelectedItems(reorderedItems);
    };

    const onClickEdit = (index) => {
        const item = selectedItems[index];
        setEditItemIndex(index);
        setIsEdit(true);
        
        // Only reset the `nama` and `tipe` fields, not `tembusanIds`
        setValue('nama', item.label);
        setValue('tipe', item.position || "");
        
        onOpenModalForm();
    };

    const onClickDelete = (id) => {
        const updatedItems = selectedItems.filter(item => item.id !== id);
        setSelectedItems(updatedItems);
        setValue("tembusanIds", updatedItems.map(item => item.id));
    };

    const onCloseForm = () => {
        setIsEdit(false);
        setEditItemIndex(null);
        
        // Reset only `nama` and `tipe`, leave `tembusanIds` as-is
        reset({ nama: "", tipe: "" }, { keepValues: true });
        
        onCloseModalForm();
    };

    const onSubmitForm = async (data) => {
        try {
            const updatedItems = [...selectedItems];
            if (isEdit) {
                const filteredData = dirtyInput(dirtyFields, data);
                await putFetcher('/api/data-master/tembusan', data.tembusanIds[0], filteredData);
                toast.success('Tembusan berhasil diubah!');
                updatedItems[editItemIndex] = { ...updatedItems[editItemIndex], label: data.nama, position: data.tipe };
            } else {

            }
            setSelectedItems(updatedItems);
            
            // Reset only `nama` and `tipe` after save
            reset({ nama: "", tipe: "" }, { keepValues: true });

            onCloseForm();
        } catch (error) {
            console.log(error)
            toast.error('Gagal menyimpan tembusan!');
        }
    };

    return {
        selectedItems,
        control,
        register,
        handleSubmit,
        handleSelectChange,
        handleDragEnd,
        isEditModalOpen,
        isEdit,
        onOpenModalForm,
        onOpenChangeModalForm,
        onClickEdit,
        onClickDelete,
        onCloseForm,
        onSubmitForm,
        formState: { errors, isSubmitting }
    };
}
