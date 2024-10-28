import { EyeIcon } from "@heroicons/react/24/outline";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";

export default function ModalDetailList({ list }) {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    return (
        <>
            <Button isIconOnly color="primary" size="sm" onPress={onOpen}><EyeIcon className="size-4" /></Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside">
                <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Detail</ModalHeader>
                        <ModalBody>
                        <div className='flex flex-col gap-3'>
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