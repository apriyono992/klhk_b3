import React from 'react'
import RootAdmin from '../../../../../components/layouts/RootAdmin'
import { Button, Card, CardBody, CardHeader, Checkbox, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, TableCell, TableRow, Textarea, Spinner } from '@nextui-org/react'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr';
import { getFetcher } from '../../../../../services/api';
import ClientTablePagination from '../../../../../components/elements/ClientTablePagination';
import { ArrowLeftIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import useValidateDistribution from '../../../../../hooks/report/distribution/useValidateDistribution';

export default function DetailPage() {
    const { id } = useParams();
    const navigate = useNavigate()
    const { data, isLoading, mutate } = useSWR(`/api/pelaporan-bahan-b3-distribusi/find/${id}`, getFetcher);
    const { 
        modalForm: { isOpenModalForm, onOpenChangeModalForm },
        hookForm: { register, handleSubmit, formState: { errors, isSubmitting } },
        onCloseForm,
        onSubmitForm,
        onClickEdit,
        isChecked,
        setIsChecked
    } = useValidateDistribution({ mutate });
    const headerTransporter = ['Perusahaan Transporter', 'Alamat', 'Email']
    const headerCustomer = ['Perusahaan Pelanggan', 'Alamat', 'Email']
    const contentTransporter = (item) => (
        <TableRow key={item?.id}>
            <TableCell>{item?.dataTransporter?.namaTransPorter}</TableCell>
            <TableCell>{item?.dataTransporter?.alamat}</TableCell>
            <TableCell>{item?.dataTransporter?.email}</TableCell>
        </TableRow>
    )
    const contentCustomer = (item) => (
        <TableRow key={item?.id}>
            <TableCell>{item?.dataCustomer?.namaCustomer}</TableCell>
            <TableCell>{item?.dataCustomer?.alamat}</TableCell>
            <TableCell>{item?.dataCustomer?.email}</TableCell>
        </TableRow>
    )
    if (isLoading) {
        return (
            <RootAdmin>
                <div className="flex justify-center items-center h-screen">
                    <Spinner size="lg" />
                </div>
            </RootAdmin>
        );
    }
    return (
        <RootAdmin>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-3'>
                <Card radius='sm' className='col-span-1'>
                    <CardHeader className='flex items-center gap-2'>
                        <Button onPress={() => navigate(-1)} size='sm' color='primary' startContent={<ArrowLeftIcon className='size-4' />}>Kembali</Button>
                        <Button onPress={() => onClickEdit(data?.id)} size='sm' color='warning' startContent={<PencilSquareIcon className='size-4' />}>Validasi</Button>
                    </CardHeader>
                    <CardBody className='flex flex-col gap-3'>
                        <div className='flex flex-col'>
                            <span className='text-xs text-gray-400 uppercase'>Jenis B3</span>
                            <span className='text-sm font-medium'>{data?.dataBahanB3?.casNumber}/{data?.dataBahanB3?.namaBahanKimia}</span>
                        </div>
                        <div className='flex flex-col'>
                            <span className='text-xs text-gray-400 uppercase'>Total Distribusi</span>
                            <span className='text-sm font-medium'>{data.jumlahB3Distribusi} Kg</span>
                        </div>
                        <div className='flex flex-col'>
                            <span className='text-xs text-gray-400 uppercase'>Bulan/Tahun</span>
                            <span className='text-sm font-medium'>{data.bulan} / {data.tahun}</span>
                        </div>
                        <div className='flex flex-col'>
                            <span className='text-xs text-gray-400 uppercase'>Perusahaan</span>
                            <span className='text-sm font-medium'>{data?.company?.name}</span>
                        </div>
                        <div className='flex flex-col'>
                            <span className='text-xs text-gray-400 uppercase'>Alamat</span>
                            <span className='text-sm font-medium'>{data.company.alamatKantor}</span>
                        </div>
                        <div className='flex flex-col'>
                            <span className='text-xs text-gray-400 uppercase'>Periode</span>
                            <span className='text-sm font-medium'>{data.period.name}</span>
                        </div>
                    </CardBody>
                </Card>
                <div className='col-span-3'>
                    <Card radius='sm' className='col-span-3'>
                        <CardBody>
                            <ClientTablePagination header={headerTransporter} content={contentTransporter} data={data?.DataTransporterOnPelaporanDistribusiBahanB3} />
                        </CardBody>
                    </Card>
                    <Card radius='sm' className='mt-3'>
                        <CardBody>
                            <ClientTablePagination header={headerCustomer} content={contentCustomer} data={data?.DataCustomerOnPelaporanDistribusiBahanB3} />
                        </CardBody>
                    </Card>
                </div>
            </div>

            <Modal isOpen={isOpenModalForm} onOpenChange={onOpenChangeModalForm} onClose={onCloseForm} isDismissable={false} isKeyboardDismissDisabled={false}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Validasi Laporan</ModalHeader>
                            <ModalBody>
                                <form onSubmit={handleSubmit(onSubmitForm)}>
                                    <div className='flex flex-col gap-3 mb-6'>  
                                        <Checkbox 
                                            {...register('status')}
                                            onValueChange={setIsChecked}
                                        >
                                            Disetujui
                                        </Checkbox>
                                        <Textarea
                                            {...register('adminNote')}
                                            variant="faded" 
                                            type="text" 
                                            isRequired={isChecked ? false : true}
                                            isDisabled={isChecked ? true : false}
                                            label="Catatan" 
                                            color={errors.adminNote ? 'danger' : 'default'}
                                            isInvalid={errors.adminNote} 
                                            errorMessage={errors.adminNote && errors.adminNote.message}
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
        </RootAdmin>
    )
}
