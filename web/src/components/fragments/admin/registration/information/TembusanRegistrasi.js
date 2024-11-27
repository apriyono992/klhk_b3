import { Button, Card, CardHeader, CardBody, Divider, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,  Input, Select, SelectItem, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner} from '@nextui-org/react';
import { useState } from 'react';
import ReactSelect from 'react-select';
import { useForm, Controller } from "react-hook-form";
import { PlusIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import useSWR from 'swr';
import toast from 'react-hot-toast';
import {
    getFetcher,
    getSelectFetcher,
    patchFetcherWithoutId,
    postFetcher,
    putFetcher,
    simpanSK
} from '../../../../../services/api';
import StatusPermohonanRegistrasi from '../../../../../enums/statusRegistrasi';
import useAuth from '../../../../../hooks/useAuth';
import RolesAccess from '../../../../../enums/roles';
import { hasValidRole, hasValidStatus } from '../../../../../services/helpers';

export default function TembusanRegistrasi({ dataTembusan, isLoadingTembusan, existingTembusan, mutate, registrasiId, status }) {
    const {user, roles } = useAuth();
    const { control, handleSubmit, setValue, reset, register, formState: { errors, isSubmitting } } = useForm({
        // defaultValues: {
        //     tembusanIds: existingTembusan || [],
        //     nip: '',
        //     tipe: '',
        // },
    });

    const { data: tembusanList, isLoading, mutate: mutateTembusanList } = useSWR(`/api/data-master/tembusan`, getSelectFetcher);

    const [selectedItems, setSelectedItems] = useState(() => {
        // Check if existing data is available
        // const existingPejabatIds = [];
        const existingPejabatIds = existingTembusan?.map((tembusan) => tembusan.DataTembusan) || [];

        // Map existing pejabat IDs to the format required by ReactSelect
        return existingPejabatIds?.map((tembusan) => ({
            value: tembusan.id,
            label: `${tembusan.nama}`, // Fallback to ID if label not found
        }));
    });

    const [isEdit, setIsEdit] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [editId, setEditId] = useState(null);
    const [isOpenModalForm, setIsOpenModalForm] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [draggedItemIndex, setDraggedItemIndex] = useState(null);
    const tipe = ['UMUM', 'DIREKTUR'];
    const columns = ['No', 'Tembusan', 'Actions'];
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Handler untuk membuka modal form
    const openModalForm = async (item = null) => {
        if (item) {
            setIsEdit(true);
            setEditId(item.value);
            setIsFetching(true);

            try {
                // Mengambil data pejabat dari API menggunakan getFetcher
                const tembusanData = await getFetcher(`/api/data-master/tembusan/${item.value}`);
                reset({
                    nama: tembusanData.nama,
                    tipe: tembusanData.tipe,
                });
            } catch (error) {
                toast.error('Gagal mengambil data tembusan.');
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
                    tipe: data.tipe,
                }
                await putFetcher('/api/data-master/tembusan', editId, data);
                // Update data di tabel setelah edit
                const updatedItems = selectedItems.map((item) =>
                    item.value === editId ? { value: editId, label: `${data.nama}` } : item
                );
                setSelectedItems(updatedItems);
                toast.success('Tembusan berhasil diubah!');
            } else {
                data = {
                    nama: data.nama,
                    tipe: data.tipe,
                }
                const newPejabat = await postFetcher('/api/data-master/tembusan', data);

                // Tambahkan data baru ke tabel setelah tambah
                const newItem = { value: newPejabat.id, label: `${data.nama}` };
                setSelectedItems([...selectedItems, newItem]);
                toast.success('Tembusan berhasil ditambah!');
            }
            // Mutate data list pejabat untuk memperbarui daftar di ReactSelect
            await mutateTembusanList();

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
    const onSubmitList = async (data) => {
        try {
            const payload = {
                tembusanIds: selectedItems?.map((item) => item.value)
            };
            await simpanSK(registrasiId, payload);
            setHasUnsavedChanges(false);
            toast.success('Daftar pejabat berhasil disimpan!');
        } catch (error) {
            console.log(error, 'isi error registrasi')
            toast.error('Gagal menyimpan daftar pejabat.');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmitList)}>
            <Card radius='sm' className='col-span-3 h-fit shadow-lg'>
                <CardHeader className="flex flex-col gap-2">
                    <div className="flex items-center justify-between w-full">
                        <p className="text-md">Tembusan</p>
                        <Button isIconOnly size="sm" color="primary" onPress={() => openModalForm()} isDisabled={
                                hasValidRole(roles, [RolesAccess.SUPER_ADMIN, RolesAccess.PIC_REGISTRASI]) && hasValidStatus(status,[StatusPermohonanRegistrasi.PEMBUATAN_DRAFT_SK]) ? false : true
                                }>
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
                <CardBody className="text-sm">
                    <Controller
                        name="tembusanIds"
                        control={control}
                        render={({ field }) => (
                            <ReactSelect
                                isDisabled={
                                    hasValidRole(roles, [RolesAccess.SUPER_ADMIN, RolesAccess.PIC_REGISTRASI]) 
                                    && hasValidStatus(status,[StatusPermohonanRegistrasi.PEMBUATAN_DRAFT_SK])
                                    ? false : true
                                }
                                label="Pilih Tembusan"
                                isMulti
                                options={tembusanList || []}
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
                        <Button size="sm" type="submit" color="primary" isDisabled={
                                hasValidRole(roles, [RolesAccess.SUPER_ADMIN, RolesAccess.PIC_REGISTRASI]) 
                                && hasValidStatus(status,[StatusPermohonanRegistrasi.PEMBUATAN_DRAFT_SK])
                                ? false : true
                                }>
                            Submit
                        </Button>
                    </div>
                </CardBody>

                {/* Modal Form Tambah/Edit Pejabat */}
                <Modal isOpen={isOpenModalForm} onOpenChange={setIsOpenModalForm} onClose={closeModalForm}>
                    <ModalContent>
                        <ModalHeader>{isEdit ? 'Edit Pejabat' : 'Tambah Pejabat'}</ModalHeader>
                        <ModalBody>
                            {isFetching ? <Spinner /> : (
                                <>
                                    <Input {...register('nama')} label="Nama" isRequired />
                                    <Select {...register('tipe')} label="Tipe" isRequired>
                                        {tipe.map((status) => <SelectItem key={status}>{status}</SelectItem>)}
                                    </Select>
                                </>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <Button onPress={handleSubmit(onSubmitForm)} color="primary" >{isEdit ? 'Simpan' : 'Tambah'}</Button>
                            <Button onPress={closeModalForm} color="danger">Batal</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Card>
        </form>
    );
}
