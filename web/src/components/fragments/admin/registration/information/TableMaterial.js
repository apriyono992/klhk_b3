import { Button, Card, CardBody, CardHeader, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from "@nextui-org/react";
import {getDetailRegistrasi, getFetcher, updateBahanB3} from "../../../../../services/api";
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
    const {isOpen: isOpenModalAlert, onOpen: onOpenModalAlert, onOpenChange: onOpenChangeModalAlert, onClose: onCloseModalAlert } = useDisclosure();
    const {isOpen: isOpenModalForm, onOpen: onOpenModalForm, onOpenChange: onOpenChangeModalForm, onClose : onCloseModalForm } = useDisclosure();
    const [editId, setEditId] = useState(null);

    const schema =  yup.object().shape({
        no_reg_bahan: yup.string().required('Harus diisi'),
        nama_dagang: yup.string().required('Harus diisi'),
    }).required()

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({resolver: yupResolver(schema)});

    const columns = [
        'No',
        'No. Reg. Bahan Kimia',
        'No. Registrasi PTSP',
        'Kategori Bahan Kimia',
        'Nama Bahan Kimia',
        'Nama Dagang',
        'Cas Number',
        'HS Code',
        'Klasifikasi Bahan Kimia',
        'Karakteristik Bahan Kimia',
        'Tujuan Penggunaan',
        'Jumlah Impor',
        'Jumlah Impor / TH',
        'Rencana Impor (Kali/TH)',
        'Penggunaan',
        'Penghasil Bahan Kimia',
        'Asal Negara',
        'Negara Muat',
        'Alamat Penghasil',
        'Pelabuhan Muat',
        'Pelabuhan Bongkar',
        'Provinsi Tujuan',
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
        const {id, ...newData} = data
        try {
            await new Promise((r) => setTimeout(r, 1000));
            const response = await updateBahanB3(data.id, newData)
            console.log(response);
            toast.success('Data bahan b3 berhasil diubah!');
            reset();
            onCloseModalForm();
        } catch (error) {
            toast.error('Gagal ubah data bahan b3!');
        }
    }

    function handleOnClose() {
        reset({
            id: '',
            no_reg_bahan: '',
            nama_dagang: '',
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
                        <TableBody loadingContent={<Spinner />}>
                            {dataB3?.BahanB3Registrasi?.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{item?.no_reg_bahan}</TableCell>
                                    <TableCell>{item.registrasiId}</TableCell>
                                    <TableCell>{item.kategori_b3}</TableCell>
                                    <TableCell>{item?.nama_bahan}</TableCell>
                                    <TableCell>{item?.nama_dagang}</TableCell>
                                    <TableCell>{item?.cas_number}</TableCell>
                                    <TableCell>{item?.hs_code}</TableCell>
                                    <TableCell>{item?.klasifikasi_b3}</TableCell>
                                    <TableCell>{item?.karakteristik_b3}</TableCell>
                                    <TableCell>{item?.tujuan_penggunaan}</TableCell>
                                    <TableCell>{item?.jumlah_impor}</TableCell>
                                    <TableCell>{item?.jumlah_impor_per_tahun}</TableCell>
                                    <TableCell>{item?.pelaksanaan_rencana_impor}</TableCell>
                                    <TableCell>{item?.penggunaan}</TableCell>
                                    <TableCell>{item?.penghasil_bahan_kimia}</TableCell>
                                    <TableCell>{item?.asal_negara}</TableCell>
                                    <TableCell>{item?.negara_muat}</TableCell>
                                    <TableCell>{item?.alamat_penghasil_b3}</TableCell>
                                    <TableCell>{item?.pelabuhan_muat}</TableCell>
                                    <TableCell>{item?.pelabuhan_bongkar}</TableCell>
                                    <TableCell>{item?.provinsi_pelabuhan_bongkar}</TableCell>
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
                                            {...register('no_reg_bahan')}
                                            isRequired
                                            variant="faded"
                                            type="text"
                                            label="No. Reg. Bahan"
                                            color={errors.no_reg_bahan ? 'danger' : 'default'}
                                            isInvalid={errors.no_reg_bahan}
                                            errorMessage={errors.no_reg_bahan && errors.no_reg_bahan.message}
                                        />
                                        <Input
                                            {...register('nama_dagang')}
                                            isRequired
                                            variant="faded"
                                            type="text"
                                            label="Nama Dagang"
                                            color={errors.nama_dagang ? 'danger' : 'default'}
                                            isInvalid={errors.nama_dagang}
                                            errorMessage={errors.nama_dagang && errors.nama_dagang.message}
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
