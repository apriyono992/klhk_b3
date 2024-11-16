import { ArrowUpTrayIcon, TrashIcon } from "@heroicons/react/24/outline";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Select, SelectItem} from "@nextui-org/react";
import { storageImageType } from "../../../../../services/enum";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { isResponseErrorObject } from "../../../../../services/helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { postMultipartFetcher } from "../../../../../services/api";
import { uploadStorageImageValidation } from "../../../../../services/validation";
import ControlledDropZone from "../../../../elements/ControlledDropZone";

export default function FormAddImage({ data, mutate }) {
    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
    const { register, control, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(uploadStorageImageValidation) });

    function onCloseModal() {
        reset({
            documentType: '',   
            photos: [],   
        });
        onClose()
    }
    
    async function onSubmitForm(formData) {
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("penyimpananId", data?.penyimpananB3?.id);
            formDataToSend.append("documentType", formData.documentType);
            formData.photos.forEach((file) => {
                formDataToSend.append(`photos`, file);
            });

            console.log([...formDataToSend]);
            await postMultipartFetcher('/api/penyimpananB3/upload', formDataToSend)
            mutate()
            toast.success('Upload foto gudang berhasil!')
        } catch (error) {
            isResponseErrorObject(error.response.data.message)
                ? Object.entries(error.response.data.message).forEach(([key, value]) => {
                    toast.error(value);
                })
                : toast.error(error.response.data.message)
        }
        onCloseModal()
    };

    return (
        <div>
            <Button size='sm' onPress={onOpen} color='primary' startContent={<ArrowUpTrayIcon className='size-4'/>}>Upload Foto Gudang</Button>
            <Modal scrollBehavior="inside" onClose={onCloseModal} isDismissable={false} isKeyboardDismissDisabled={false} isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
                <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Tambah Foto Gudang</ModalHeader>
                        <ModalBody>
                            <form onSubmit={handleSubmit(onSubmitForm)}>
                                <div className="flex flex-col gap-3">
                                    <Select 
                                        {...register("documentType")}
                                        label="Kategori" 
                                        isRequired
                                        variant="faded"
                                        labelPlacement="outside"
                                        placeholder="Pilih..."
                                        color={errors.documentType ? 'danger' : 'default'}
                                        isInvalid={errors.documentType} 
                                        errorMessage={errors.documentType && errors.documentType.message}
                                    >
                                        {storageImageType.map((item) => (<SelectItem key={item}>{item}</SelectItem>))}
                                    </Select>
                                    <ControlledDropZone
                                        name="photos"
                                        label="Foto Gudang"
                                        control={control}
                                        setValue={setValue}
                                    />
                                </div>
                                <div className="mt-6 flex gap-1">
                                    <Button isDisabled={isSubmitting} isLoading={isSubmitting} color="primary" type="submit">
                                        Simpan
                                    </Button>
                                    <Button color="danger" variant="light" onPress={onClose}>
                                        Batal
                                    </Button>
                                </div>
                            </form>
                        </ModalBody>
                        <ModalFooter>
                            
                        </ModalFooter>
                    </>
                )}
                </ModalContent>
            </Modal>
        </div>
    );
}