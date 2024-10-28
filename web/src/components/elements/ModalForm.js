import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function ModalForm({ isOpen, onOpenChange, onOpen, onClose, onSubmit }) {
    const [isEditId, setIsEditId] = useState(null);


    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

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

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={handleOnClose} isDismissable={false} isKeyboardDismissDisabled={false}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Ubah Status Dokumen</ModalHeader>
                            <ModalBody>
                                <form onSubmit={handleSubmit(handleOnSubmit)}>
                                    <div className='flex flex-col gap-3 mb-6'>  
                                        
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
    )
}
