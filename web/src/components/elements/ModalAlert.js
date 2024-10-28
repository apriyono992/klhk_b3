import { ExclamationCircleIcon, QuestionMarkCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import React from 'react'

export default function ModalAlert({ heading, description, buttonSubmitText, icon, onSubmit, isOpen, onOpenChange, }) {
    async function handleClick() {
        await onSubmit();
    }

    function iconSwitch(icon) {
        switch (icon) {
            case 'warning':
                return <QuestionMarkCircleIcon className="size-16 stoke-2 stroke-warning"/>
            case 'danger':
                return <XCircleIcon className="size-16 stoke-2 stroke-danger"/>
            default:
                return <ExclamationCircleIcon className="size-16 stoke-2 stroke-gray-400"/>
        }
    }

    return (
        <>
            <Modal hideCloseButton isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1"></ModalHeader>
                            <ModalBody className='flex flex-col items-center'>
                                {iconSwitch(icon)}
                                <span className='text-2xl font-semibold'>{heading ?? 'Apakan anda yakin?'}</span>
                                <span className='text-medium'>{description ?? 'Aksi ini tidak bisa dibatalkan'}</span>
                            </ModalBody>
                            <ModalFooter className='flex items-center justify-center'>
                                <Button className='bg-gray-200 text-gray-500' variant="faded" onPress={onClose}>
                                    Tidak
                                </Button>
                                <Button onClick={handleClick} color={icon ?? 'danger'} onPress={onClose}>
                                    {buttonSubmitText ?? 'Ya'}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </> 
    )
}
