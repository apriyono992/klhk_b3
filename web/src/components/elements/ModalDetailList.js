import { EyeIcon } from "@heroicons/react/24/outline";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";

export default function ModalDetailList({ list, label }) {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    return (
        <>
            <Button isIconOnly size="sm" color="success" onPress={onOpen}><EyeIcon className='size-4'/></Button>
            <Modal size="xl" isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside">
                <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Detail {label}</ModalHeader>
                        <ModalBody>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                            {list.map((item, index) => (
                                <div key={index} className='flex flex-col'>
                                    <span className='text-xs text-gray-400 uppercase'>{item.label}</span>
                                    <span className='text-sm font-medium'>{item.value}</span>
                                </div>
                            ))}
                        </div>
                        </ModalBody>
                        <ModalFooter>

                        </ModalFooter>
                    </>
                )}
                </ModalContent>
            </Modal>
        </>
    );
}