import RootAdmin from '../../../../../components/layouts/RootAdmin'
import { Button, Card, CardBody, CardHeader, Checkbox, Chip, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, TableCell, TableRow, Textarea } from '@nextui-org/react'
import { getFetcher } from '../../../../../services/api';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import Error from '../../../../../components/fragments/Error';
import { CheckIcon, PencilSquareIcon, XMarkIcon } from '@heroicons/react/24/outline';
import IsValidIcon from '../../../../../components/elements/isValidIcon';
import ClientTablePagination from '../../../../../components/elements/ClientTablePagination';
import ButtonModalAlert from '../../../../../components/elements/ButtonModalAlert';
import ModalImageView from '../../../../../components/fragments/admin/report/storage/ModalImageView';
import useValidateImage from '../../../../../hooks/report/storage/useValidateImage';

export default function DetailPage() {
    const { id } = useParams();
    const { data, isLoading, error, mutate } = useSWR(`/api/penyimpananB3/${id}`, getFetcher)
    
    const { 
        modalForm: { isOpenModalForm, onOpenChangeModalForm },
        hookForm: { register, handleSubmit, formState: { errors, isSubmitting } },
        onCloseForm,
        onSubmitForm,
        onClickEdit,
        onValidate 
    } = useValidateImage({ mutate });

    const company = (item) => [
        {
            label: "Nama Perusahaan",
            value: item?.company?.name
        },
        {
            label: "Email",
            value: item?.company?.emailKantor
        },
        {
            label: "Telepon Kantor",
            value: item?.company?.telpKantor
        },
        {
            label: "Fax Kantor",
            value: item?.company?.faxKantor
        },
        {
            label: "Bidang Usaha",
            value: item?.company?.bidangUsaha
        },
        {
            label: "Alamat Kantor",
            value: item?.company?.alamatKantor
        },
    ]

    const header = [
        'Nama', 
        'Validasi', 
        'Catatan', 
        'Aksi'
    ];

    const content = (item) => (
        <TableRow key={item.id}>
            <TableCell>{item.tipeDokumen}</TableCell>
            <TableCell><IsValidIcon value={item.isApproved} /></TableCell>
            <TableCell>{item.notes}</TableCell>
            <TableCell>
                <div className="flex items-center gap-1">
                    <ModalImageView list={item.photosPenyimpananB3} />
                    {item?.status !== 'Rejected' && item?.status !== 'Approved' && (
                        <Button isIconOnly size="sm" color="warning" onPress={() => onClickEdit(item)}>
                            <PencilSquareIcon className='size-4' />
                        </Button>
                     )}
                </div>
            </TableCell>
        </TableRow>
    );
    
    if (error?.status === 404) return (<Error code={error?.status} header="Tidak ditemukan" message="Pastikan URL penyimpanan b3 sudah sesuai"/>) 

    return (
        <RootAdmin>
            <div className='flex gap-3'>
                <Card radius='sm' className='w-full md:w-1/3'>
                    <CardHeader>
                        Perusahaan
                    </CardHeader>
                    <Divider/>
                    <CardBody>
                        {company(data?.penyimpananB3).map((item, index) => (
                            <div key={index} className={`flex flex-col mb-3`}>
                                <span className='text-xs text-gray-400 uppercase'>{item.label}</span>
                                <span className='text-sm font-medium'>{item.value}</span>
                            </div>
                        ))}
                    </CardBody>
                </Card>
                <Card radius='sm' className='w-full md:w-2/3'>
                    <CardHeader>
                        <div className='w-full flex items-center justify-between'>
                            <span>Foto Gudang Penyimpanan B3</span>
                            <Chip 
                                color={
                                    data?.penyimpananB3?.status === 'Rejected'
                                        ? 'danger'
                                        : data?.penyimpananB3?.status === 'Pending'
                                        ? 'warning'
                                        : data?.penyimpananB3?.status === 'Menunggu Verifikasi'
                                        ? 'primary'
                                        : data?.penyimpananB3?.status === 'Review by Admin'
                                        ? 'secondary'
                                        : data?.penyimpananB3?.status === 'Approved'
                                        ? 'success'
                                        : data?.penyimpananB3?.status === 'Delete'
                                        ? 'default'
                                        : 'default'
                                }
                            >
                                {data?.penyimpananB3?.status}
                            </Chip>
                        </div>
                    </CardHeader>
                    <Divider/>
                    <CardBody>
                    {(data?.penyimpananB3?.status !== 'Rejected' && data?.penyimpananB3?.status !== 'Approved') && (
                        <div className='w-full flex items-center justify-end gap-2 mb-3'>
                            <div className='w-full flex items-center justify-end gap-1'>
                                <ButtonModalAlert
                                    buttonIsIconOnly={true}
                                    buttonTitle={<CheckIcon className='size-4' />}
                                    buttonColor="primary"
                                    modalIcon="success"
                                    modalHeading="Setujui Gudang?"
                                    modalDescription="Pastikan Foto-foto Gudang Sudah Sesuai"
                                    buttonSubmitText="Setujui"
                                    buttonCancelText="Batal"
                                    onSubmit={() => onValidate(data?.penyimpananB3?.id, true)}
                                />
                                <ButtonModalAlert
                                    buttonIsIconOnly={true}
                                    buttonTitle={<XMarkIcon className='size-4' />}
                                    buttonColor="danger"
                                    modalIcon="danger"
                                    modalHeading="Tolak Gudang?"
                                    buttonSubmitText="Tolak"
                                    buttonCancelText="Batal"
                                    onSubmit={() => onValidate(data?.penyimpananB3?.id, false)}
                                />
                            </div>
                        </div>
                    )}

                        <ClientTablePagination
                            data={data?.penyimpananB3?.PenyimpananB3Persyaratan?.map((item) => ({
                                ...item,
                                status: data?.penyimpananB3?.status,
                            }))}
                            header={header}
                            content={content}
                            isLoading={isLoading}
                        />
                    </CardBody>
                </Card>
            </div>
            <Modal isOpen={isOpenModalForm} onOpenChange={onOpenChangeModalForm} onClose={onCloseForm} isDismissable={false} isKeyboardDismissDisabled={false}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Ubah Status Dokumen</ModalHeader>
                            <ModalBody>
                                <form onSubmit={handleSubmit(onSubmitForm)}>
                                    <div className='flex flex-col gap-3 mb-6'>  
                                        <Checkbox 
                                            {...register('isValid')}
                                        >
                                            Dokumen valid
                                        </Checkbox>
                                        <Textarea
                                            {...register('validationNotes')}
                                            isRequired
                                            variant="faded" 
                                            type="text" 
                                            label="Catatan" 
                                            color={errors.validationNotes ? 'danger' : 'default'}
                                            isInvalid={errors.validationNotes} 
                                            errorMessage={errors.validationNotes && errors.validationNotes.message}
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
