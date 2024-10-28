import { ArrowPathIcon, EyeIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { Button, Card, CardBody, Checkbox, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Textarea, useDisclosure } from '@nextui-org/react';
import React, { useState } from 'react'
import * as yup from 'yup';
import useSWR from 'swr';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import IsValidIcon from '../../../../elements/IsValidDocument';
import ModalAlert from '../../../../elements/ModalAlert';

export default function DocumentReview({ data }) {
    // const fetcher = (...args) => authStateFetcher(...args);
    // const { data, isLoading } = useSWR('/todos?limit=20', fetcher);
    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
    const [isEditId, setIsEditId] = useState(null);

    const schema =  yup.object().shape({
        isValid: yup.boolean().oneOf([true, false], 'isi harus valid atau tidak valid'),
        validationNotes: yup.string().required('Harus diisi'),   
    }).required()

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({resolver: yupResolver(schema)});

    const columns = [
        'No',
        'Nama',
        'Status',
        'Catatan Validasi',
        'Aksi',
    ]

    async function handleOnSubmit(data) {
        try {
            await new Promise((r) => setTimeout(r, 1000));
            console.log(isEditId);
            console.log(data);
            toast.success('Status dokumen validasi berhasil diubah!');
            reset();
            onClose();
        } catch (error) {
            toast.success('Gagal ubah status dokumen validasi!');
        }
    }

    function handleOnClose() {
        setIsEditId(null);
        reset({
            isValid: '',
            validationNotes: '',   
        });
    }

    function handleOnEdit(item) {         
        setIsEditId(item.id);            
        onOpen();
    }

    async function handleOnValidate(data) {
        try {
            await new Promise((r) => setTimeout(r, 1000));
            console.log(data);
            toast.success('Status dokumen berhasil diubah!');
            reset();
            onClose();
        } catch (error) {
            toast.success('Gagal ubah status dokument!');
        }
    }

    return (
        <>
            <Card>
                <CardBody>
                    <div className='mb-6'>
                        <ModalAlert 
                            heading="Validasi Dokumen?" 
                            description="Pastikan semua dokumen sudah ditelaah"
                            buttonSubmitText="Ya, validasi"
                            buttonTriggerText="Validasi"
                            color="warning"
                            startIcon={<ArrowPathIcon className="size-4"/>}
                            onSubmit={() => handleOnValidate(data)}
                        />
                    </div>
                    <Table removeWrapper aria-label="validation-table" radius='sm'>
                        <TableHeader>
                        {columns.map((item, index) => <TableColumn key={index}>{item}</TableColumn>)}
                        </TableHeader>
                        <TableBody loadingContent={<Spinner/>} loadingState="idle">
                            {data?.documents.map((item, index) => (
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
                                        {
                                            item.archived
                                            ? <></>
                                            : <Button isIconOnly size="sm" color="warning" onPress={() => handleOnEdit(item)}><PencilSquareIcon className='size-4'/></Button>
                                        }
                                        
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={handleOnClose} isDismissable={false} isKeyboardDismissDisabled={false}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Ubah Status Dokumen</ModalHeader>
                            <ModalBody>
                                <form onSubmit={handleSubmit(handleOnSubmit)}>
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
        </>
    )
}
