import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";

export default function DynamicModalForm({ buttonTitle, modalTitle, modalContent }) {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    return (
        <>
            <Button color="primary" variant="flat" size="sm" onPress={onOpen}>{buttonTitle}</Button>
            <Modal placement="top" scrollBehavior="inside" className="text-sm" isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                      <>
                          <ModalHeader className="flex flex-col gap-1">{modalTitle}</ModalHeader>
                          <ModalBody>
                              {modalContent}
                          </ModalBody>
                          <ModalFooter>
                              <Button color="primary" onPress={onClose}>
                                  Simpan
                              </Button>
                              <Button color="danger" variant="light" onPress={onClose}>
                                  Batal
                              </Button>
                          </ModalFooter>
                      </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}