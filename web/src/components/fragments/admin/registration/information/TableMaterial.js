import { Button, Card, CardBody, CardHeader, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from "@nextui-org/react";
import { getFetcher } from "../../../../../services/api";
import ModalAlert from "../../../../elements/ModalAlert";
import ModalDetailList from "../../../../elements/ModalDetailList";
import useSWR from "swr";
import * as yup from 'yup';
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function TableMaterial({ className, dataB3 }) {
    const { data, isLoading } = useSWR('/products?limit=4', getFetcher);
    const {isOpen: isOpenModalAlert, onOpen: onOpenModalAlert, onOpenChange: onOpenChangeModalAlert, onClose: onCloseModalAlert } = useDisclosure();
    const {isOpen: isOpenModalForm, onOpen: onOpenModalForm, onOpenChange: onOpenChangeModalForm, onClose : onCloseModalForm } = useDisclosure();
    const [editId, setEditId] = useState(null);

    const schema =  yup.object().shape({
        noRegBahan: yup.string().required('Harus diisi'),   
        namaDagang: yup.string().required('Harus diisi'),   
    }).required()

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({resolver: yupResolver(schema)});

    const columns = [
        'No',
        'HS Code',
        'Nama Dagang',
        'Nama Bahan Kimia',
        'No. Reg. Bahan Kimia',
        'Aksi',
    ]

    const list = (item) => [
        {
            'label': 'No. Reg. Bahan Kimia',
            'value': item?.no_reg_bahan
        },
        {
            'label': 'Cas Number',
            'value': item.cas_number
        },
        {
            'label': 'Nama Bahan Kimia',
            'value': item.nama_bahan
        },
        {
            'label': 'Nama Dagang',
            'value': item.nama_dagang
        },
        {
            'label': 'Kategori Bahan Kimia',
            'value': item?.kategori_b3
        },
        {
            'label': 'HS Code',
            'value': item?.cas_number
        },
        {
            'label': 'Klasifikasi Bahan Kimia',
            'value': item?.klasifikasi_b3
        },
        {
            'label': 'Karateristik Bahan Kimia',
            'value': item?.karakteristik_b3
        },
        {
            'label': 'Tujuan Penggunaan',
            'value': item?.tujuan_penggunaan
        },
        {
            'label': 'Jumlah Impor',
            'value': item.jumlah_impor
        },
        {
            'label': 'Jumlah Impor / TH',
            'value': item.jumlah_impor_per_tahun
        },
        {
            'label': 'Rencana Impor (Kali/TH)',
            'value': item.pelaksanaan_rencana_impor
        },
        {
            'label': 'Penggunaan',
            'value': item.penggunaan
        },
        {
            'label': 'Penghasil Bahan Kimia',
            'value': item.penghasil_bahan_kimia
        },
        {
            'label': 'Asal Negara',
            'value': item.asal_negara
        },
        {
            'label': 'Negara Muat',
            'value': item.negara_muat
        },
        {
            'label': 'Alamat Penghasil',
            'value': item.alamat_penghasil_b3
        },
        {
            'label': 'Pelabuhan Muat',
            'value': item.pelabuhan_muat[0]
        },
        {
            'label': 'Pelabuhan Bongkar',
            'value': item.pelabuhan_bongkar[0]
        },
        {
            'label': 'Provinsi Tujuan',
            'value': item.provinsi_pelabuhan_bongkar[0]
        },
    ]

    async function handleOnSubmit(data) {
        try {
            await new Promise((r) => setTimeout(r, 1000));
            console.log(data);
            toast.success('Data bahan b3 berhasil diubah!');
            reset();
            onCloseModalForm();
        } catch (error) {
            toast.success('Gagal ubah data bahan b3!');
        }
    }

    function handleOnClose() {
        reset({
            id: '',
            noRegBahan: '',
            namaDagang: '',   
        });
    }

    function handleOnEdit(item) {        
        reset({
            id: item.id,
        });        
        onOpenModalForm();
    }

    async function onSubmitDelete() {
        try {
            await new Promise((r) => setTimeout(r, 1000));
            console.log(editId);
            toast.success('Bahan B3 berhasil dihapus!');
        } catch (error) {
            toast.error('Gagal hapus bahan b3!');
        }
    }

    function onClickDelete(id) {
        setEditId(id);
        onOpenChangeModalAlert();
    }

    return (
        <>
            <Card className={className} radius="sm">
                <CardHeader>
                    <p className="text-md">Data Bahan B3</p>
                </CardHeader>
                <Divider />
                <CardBody>
                    <Table removeWrapper aria-label="material-table">
                        <TableHeader>
                            {columns.map((item, index) => <TableColumn key={index}>{item}</TableColumn>)}
                        </TableHeader>
                        <TableBody loadingContent={<Spinner />} loadingState={isLoading ? 'loading' : 'idle'}>
                            {dataB3?.BahanB3Registrasi?.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{item.hs_code}</TableCell>
                                    <TableCell>{item.nama_dagang}</TableCell>
                                    <TableCell>{item.nama_bahan}</TableCell>
                                    <TableCell>{item?.no_reg_bahan}</TableCell>
                                    <TableCell className='flex items-center gap-1'>
                                        <ModalDetailList list={list(item)}/>
                                        <Button isIconOnly size="sm" color="warning" onPress={() => handleOnEdit(item)}><PencilSquareIcon className="size-4" /></Button>
                                        <Button size='sm' onPress={() => onClickDelete(item.id)} color='danger' isIconOnly><TrashIcon className='size-4'/></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>

            <Modal isOpen={isOpenModalForm} onOpenChange={onOpenChangeModalForm} onClose={handleOnClose} isDismissable={false} isKeyboardDismissDisabled={false}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Ubah Data Bahan B3</ModalHeader>
                            <ModalBody>
                                <form onSubmit={handleSubmit(handleOnSubmit)}>
                                    <div className='flex flex-col gap-3 mb-6'>
                                        <input type="hidden" {...register('id')} />
                                        <Input
                                            {...register('noRegBahan')}
                                            isRequired
                                            variant="faded" 
                                            type="text" 
                                            label="No. Reg. Bahan" 
                                            color={errors.noRegBahan ? 'danger' : 'default'}
                                            isInvalid={errors.noRegBahan} 
                                            errorMessage={errors.noRegBahan && errors.noRegBahan.message}
                                        />
                                        <Input
                                            {...register('namaDagang')}
                                            isRequired
                                            variant="faded" 
                                            type="text" 
                                            label="Nama Dagang" 
                                            color={errors.namaDagang ? 'danger' : 'default'}
                                            isInvalid={errors.namaDagang} 
                                            errorMessage={errors.namaDagang && errors.namaDagang.message}
                                        />
                                    </div>
                                    <div className='flex items-center gap-1'>
                                        <Button isLoading={isSubmitting} isDisabled={isSubmitting} type='submit' color='primary'>Simpan</Button>
                                        <Button isDisabled={isSubmitting} color='danger' variant='faded' onPress={onClose}>Batal</Button>
                                    </div>
                                </form>
                            </ModalBody>
                            <ModalFooter>

                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <ModalAlert isOpen={isOpenModalAlert} onOpenChange={onOpenChangeModalAlert} onSubmit={onSubmitDelete} icon="danger"/>
        </>
    )
}