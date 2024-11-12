import { ArrowPathIcon, EyeIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { Button, Card, CardBody, Checkbox, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Textarea } from '@nextui-org/react';
import IsValidIcon from '../../../elements/isValidIcon';
import ModalAlert from '../../../elements/ModalAlert';
import useValidationForm from '../../../../hooks/useValidationForm';

export default function Validation({ data, isLoading, mutate }) {
    const { 
        modalForm: { isOpenModalForm, onOpenChangeModalForm },
        modalAlert: { isOpenModalAlert, onOpenChangeModalAlert },
        hookForm: { register, handleSubmit, watch, formState: { errors, isSubmitting } },
        onCloseForm,
        onSubmitForm,
        onClickEdit,
        onValidate,
    } = useValidationForm({ mutate });
    // Watch for changes on 'isValid' checkbox
    const isValid = watch('isValid');
    const areAllDocumentValid = data?.documents?.every(
        document => document.isValid
    );

    const columns = [
        'No',
        'Nama',
        'Status',
        'Catatan Validasi',
        'Aksi',
    ]

    return (
        <>
            <Card>
                <CardBody>
                    <div className='mb-6'>
                        <Button isDisabled={!areAllDocumentValid || data?.status === 'VALIDASI_PEMOHONAN_SELESAI'} onPress={onOpenChangeModalAlert} color='warning' size='sm' startContent={<ArrowPathIcon className="size-4"/>}>Submit Validasi</Button>
                    </div>
                    <Table removeWrapper aria-label="validation-table" radius='sm'>
                        <TableHeader>
                            {columns.map((item, index) => <TableColumn key={index}>{item}</TableColumn>)}
                        </TableHeader>
                        <TableBody loadingContent={<Spinner/>} loadingState={isLoading ? 'loading' : 'idle'}>
                            {data?.documents?.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{item.documentType}</TableCell>
                                    <TableCell>
                                        <IsValidIcon value={item.isValid} />
                                    </TableCell>
                                    <TableCell>{item.validationNotes}</TableCell>
                                    <TableCell className='flex items-center gap-1'>
                                        <a target='_blank' href={item.fileUrl} className=''>
                                            <Button isIconOnly size="sm" color='primary'><EyeIcon className='size-4'/></Button>
                                        </a>
                                        <Button isIconOnly size="sm" color="warning" onPress={() => onClickEdit(item)}><PencilSquareIcon className='size-4'/></Button>
                                        
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>

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
                                            {...register('validationNotes', {
                                                required: !isValid ? 'Catatan harus diisi jika dokumen tidak valid' : false,
                                            })}
                                            isRequired={!isValid}
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

            <ModalAlert
                heading="Submit Validasi?"
                description="Pastikan semua file sudah tervalidasi"
                buttonSubmitText='Ya'
                icon='warning'
                onSubmit={() => onValidate(data.id)}
                isOpen={isOpenModalAlert}
                onOpenChange={onOpenChangeModalAlert}  
            />
        </>
    )
}
