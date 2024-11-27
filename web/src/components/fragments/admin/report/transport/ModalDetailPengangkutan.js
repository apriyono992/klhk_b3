import { EyeIcon } from "@heroicons/react/24/outline";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";

export default function ModalDetailPengangkutan({ data }) {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    return (
        <>
            <Button isIconOnly size="sm" color="primary" onPress={onOpen}><EyeIcon className="size-4" /></Button>
            <Modal scrollBehavior="inside" size="3xl" isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Detail Pengangkutan</ModalHeader>
                            <ModalBody>
                                
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