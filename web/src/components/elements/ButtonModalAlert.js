import { CheckCircleIcon, ExclamationCircleIcon, QuestionMarkCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";

export default function ButtonModalAlert({ buttonTitle, buttonColor, buttonIsIconOnly, modalIcon, modalHeading, modalDescription, buttonSubmitText, buttonCancelText, onSubmit }) {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    async function handleClick() {
        await onSubmit();
    }

    function iconSwitch(modalIcon) {
        switch (modalIcon) {
            case 'success':
                return <CheckCircleIcon className="size-16 stoke-2 stroke-success"/>
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
            <Button size="sm" color={buttonColor} isIconOnly={buttonIsIconOnly} onPress={onOpen}>{buttonTitle}</Button>
            <Modal hideCloseButton isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1"></ModalHeader>
                            <ModalBody className='flex flex-col items-center'>
                                {iconSwitch(modalIcon)}
                                <span className='text-2xl font-semibold'>{modalHeading ?? 'Apakan anda yakin?'}</span>
                                <span className='text-medium'>{modalDescription ?? 'Aksi ini tidak bisa dibatalkan'}</span>
                            </ModalBody>
                            <ModalFooter className='flex items-center justify-center'>
                                <Button className='bg-gray-200 text-gray-500' variant="faded" onPress={onClose}>
                                    {buttonCancelText ?? 'Tidak'}
                                </Button>
                                <Button onClick={handleClick} color={modalIcon ?? 'danger'} onPress={onClose}>
                                    {buttonSubmitText ?? 'Ya'}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}