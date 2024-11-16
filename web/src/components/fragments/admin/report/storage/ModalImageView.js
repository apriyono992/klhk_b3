import { EyeIcon, PhotoIcon } from "@heroicons/react/24/outline";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Image} from "@nextui-org/react";
import { useState } from "react";

export default function ModalImageView({ list }) {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [isLoaded, setIsLoaded] = useState(true);
    return (
        <>
            <Button isIconOnly size="sm" color="primary" onPress={onOpen}><PhotoIcon className='size-4'/></Button>
            <Modal size="xl" isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside">
                <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">List Foto Gudang</ModalHeader>
                        <ModalBody>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                            {list.map((item, index) => (
                                <div key={index} className="h-40 drop-shadow-xl">
                                    <img 
                                        className="w-full h-full rounded-lg object-cover object-center" 
                                        src={ isLoaded ? item.fileUrl : 'https://placehold.co/600x400?text=Not+Found' } 
                                        alt={`storage-image${index+1}`} 
                                        onError={() => setIsLoaded(false)}
                                    />
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