import { useState } from 'react';
import { Button, Card, CardHeader, CardBody, Divider, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Select, SelectItem, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner } from '@nextui-org/react';
import ReactSelect from 'react-select';
import { useForm, Controller } from "react-hook-form";
import { PlusIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import useSWR from 'swr';
import { getFetcher, getSelectPejabatFetcher, patchFetcher, postFetcher, putFetcher } from '../../../../../services/api';
import toast from 'react-hot-toast';
import { patch } from '@mui/material';

export default function PejabatSelectorComponent({ existingPejabat, mutate }) {
    const { control, handleSubmit, setValue, reset, register, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            pejabatIds: existingPejabat || [],
            nip: '',
            nama: '',
            jabatan: '',
            status: '',
        },
    });
    const { data: pejabatList, isLoading, mutate: mutatePejabatList } = useSWR(`/api/data-master/pejabat`, getSelectPejabatFetcher);
    const [selectedItems, setSelectedItems] = useState(() => {
        // Check if existing data is available
        const existingPejabatIds = existingPejabat?.TelaahTeknisRekomendasiB3[0]?.TelaahTeknisPejabat?.map((pejabat) => pejabat.DataPejabat) || [];

        // Map existing pejabat IDs to the format required by ReactSelect
        return existingPejabatIds?.map((pejabat) => ({
            value: pejabat.id,
            label: `${pejabat.nama} - ${pejabat.jabatan}`, // Fallback to ID if label not found
        }));
    });

    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [editId, setEditId] = useState(null);
    const [isOpenModalForm, setIsOpenModalForm] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [draggedItemIndex, setDraggedItemIndex] = useState(null);
    const officialStatus = ['PLT', 'PLH', 'AKTIF'];
    const columns = ['No', 'Pejabat', 'Actions'];

    // Handler untuk membuka modal form
    const openModalForm = async (item = null) => {
        if (item) {
            setIsEdit(true);
            setEditId(item.value);
            setIsFetching(true);

            try {
                // Mengambil data pejabat dari API menggunakan getFetcher
                const pejabatData = await getFetcher(`/api/data-master/pejabat/${item.value}`);
                reset({
                    nip: pejabatData.nip,
                    nama: pejabatData.nama,
                    jabatan: pejabatData.jabatan,
                    status: pejabatData.status,
                });
            } catch (error) {
                toast.error('Gagal mengambil data pejabat.');
            } finally {
                setIsFetching(false);
            }
        } else {
            setIsEdit(false);
            reset({ nip: '', nama: '', jabatan: '', status: '' });
        }
        setIsOpenModalForm(true);
    };

    // Handler untuk menutup modal form
    const closeModalForm = () => {
        setIsOpenModalForm(false);
        reset();
    };

    // Handler untuk submit form tambah/edit
    const onSubmitForm = async (data) => {
        try {
            if (isEdit) {
                data = {
                    nama: data.nama,
                    status: data.status,
                    jabatan: data.jabatan
                }
                await putFetcher('/api/data-master/pejabat', editId, data);
                // Update data di tabel setelah edit
                const updatedItems = selectedItems.map((item) =>
                    item.value === editId ? { value: editId, label: `${data.nama} - ${data.jabatan}` } : item
                );
                setSelectedItems(updatedItems);
                toast.success('Pejabat berhasil diubah!');
            } else {    
                const payload = {
                    nip: data.nip,
                    nama: data.nama,
                    jabatan: data.jabatan,
                    status: data.status,
                };
                const newPejabat = await postFetcher('/api/data-master/pejabat', payload);

                // Tambahkan data baru ke tabel setelah tambah
                const newItem = { value: newPejabat.id, label: `${data.nama} - ${data.jabatan}` };
                setSelectedItems([...selectedItems, newItem]);
                toast.success('Pejabat berhasil ditambah!');
            }
            setHasUnsavedChanges(true);
            // Mutate data list pejabat untuk memperbarui daftar di ReactSelect
            await mutatePejabatList();
            
            closeModalForm();
        } catch (error) {
            toast.error('Gagal menyimpan data.');
        }
    };

    // Handler untuk mengubah pilihan di ReactSelect
    const handleSelectChange = (options) => {
        setSelectedItems(options || []);
        setValue("pejabatIds", options ? options.map((item) => item.value) : []);
        setHasUnsavedChanges(true);
    };

    // Drag and Drop Handlers
    const handleDragStart = (index) => {
        setDraggedItemIndex(index);
    };

    const handleDragEnter = (index) => {
        const items = Array.from(selectedItems);
        const draggedItem = items[draggedItemIndex];
        items.splice(draggedItemIndex, 1);
        items.splice(index, 0, draggedItem);
        setDraggedItemIndex(index);
        setSelectedItems(items);
        setValue("pejabatIds", items.map((item) => item.value));
    };

    const handleDragEnd = () => {
        setDraggedItemIndex(null);
        setHasUnsavedChanges(true);
    };

    // Handler untuk menghapus pejabat
    const handleDeleteItem = (id) => {
        const updatedItems = selectedItems.filter((item) => item.value !== id);
        setSelectedItems(updatedItems);
        setValue("pejabatIds", updatedItems.map((item) => item.value));
        setHasUnsavedChanges(true);
    };

    // Handler untuk submit list pejabat
    const onSubmitList = async () => {
        try {
            const payload = { pejabat: selectedItems?.map((item) => item.value) };
            await patchFetcher('api/rekom/permohonan/update-telaah', existingPejabat.id, payload);
            setHasUnsavedChanges(false);
            toast.success('Daftar pejabat berhasil disimpan!');
        } catch (error) {
            toast.error('Gagal menyimpan daftar pejabat.');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmitList)}>
            <Card radius="sm" className="shadow-lg">
                <CardHeader className="flex flex-col gap-2">
                    <div className="flex items-center justify-between w-full">
                        <p className="text-md">Pilih Pejabat</p>
                        <Button isIconOnly size="sm" color="primary" onPress={() => setIsOpenModalForm(true)}>
                            <PlusIcon className="size-4" />
                        </Button>
                    </div>
                    {hasUnsavedChanges && (
                        <div className="flex justify-start w-full">
                            <span className="text-red-500 text-sm">Perubahan belum disimpan</span>
                        </div>
                    )}
                </CardHeader>
                <Divider />
                <CardBody>
                    <Controller
                        name="pejabatIds"
                        control={control}
                        render={({ field }) => (
                            <ReactSelect
                                label="Pilih Pejabat"
                                isMulti
                                options={pejabatList}
                                isLoading={isLoading}
                                value={selectedItems}
                                onChange={handleSelectChange}
                                menuPortalTarget={document.body}
                                menuPlacement="auto"
                                styles={{
                                    control: (provided) => ({ ...provided, fontSize: '14px' }),
                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                    menu: (provided) => ({ ...provided, maxHeight: '200px', overflowY: 'auto' }),
                                }}
                            />
                        )}
                    />

                    <div className="mt-4">
                        <Table removeWrapper aria-label="table-pejabat">
                            <TableHeader>
                                {columns.map((col, index) => (
                                    <TableColumn key={index}>{col}</TableColumn>
                                ))}
                            </TableHeader>
                            <TableBody loadingContent={<Spinner />} loadingState={isLoading ? 'loading' : 'idle'} emptyContent="Tidak ada data">
                                {selectedItems.map((item, index) => (
                                    <TableRow
                                        key={index}
                                        style={{
                                            cursor: isDragging ? 'grabbing' : 'grab',
                                            backgroundColor: isDragging ? '#e0f7fa' : 'transparent',
                                        }}
                                        draggable
                                        onDragStart={() => handleDragStart(index)}
                                        onDragEnter={() => handleDragEnter(index)}
                                        onDragEnd={handleDragEnd}
                                    >
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{item.label}</TableCell>
                                        <TableCell className="flex items-center gap-1">
                                            <Button size="sm" onPress={() => openModalForm(item)} color="warning" isIconOnly>
                                                <PencilSquareIcon className="size-4" />
                                            </Button>
                                            <Button size="sm" onPress={() => handleDeleteItem(item.value)} color="danger" isIconOnly>
                                                <TrashIcon className="size-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="mt-4">
                        <Button size="sm" type="submit" color="primary" isDisabled={isSubmitting || selectedItems.length === 0}>
                            Submit
                        </Button>
                    </div>
                </CardBody>
            </Card>
            
            {/* Modal Form Tambah/Edit Pejabat */}
            <Modal isOpen={isOpenModalForm} onOpenChange={setIsOpenModalForm} onClose={closeModalForm}>
                <ModalContent>
                    <ModalHeader>{isEdit ? 'Edit Pejabat' : 'Tambah Pejabat'}</ModalHeader>
                    <ModalBody>
                        {isFetching ? <Spinner /> : (
                            <>
                                {!isEdit && <Input {...register('nip')} label="NIP" isRequired />}
                                <Input {...register('nama')} label="Nama" isRequired />
                                <Input {...register('jabatan')} label="Jabatan" isRequired />
                                <Select {...register('status')} label="Status" isRequired>
                                    {officialStatus.map((status) => <SelectItem key={status}>{status}</SelectItem>)}
                                </Select>
                            </>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button onPress={handleSubmit(onSubmitForm)}>{isEdit ? 'Simpan' : 'Tambah'}</Button>
                        <Button onPress={closeModalForm} color="danger">Batal</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </form>
    );
}
