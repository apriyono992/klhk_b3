import { useState } from "react";
import useSWR from "swr";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, TableCell, TableRow, useDisclosure } from "@nextui-org/react";
import { getFetcher } from "../../../../services/api";
import ClientTablePagination from "../../../elements/ClientTablePagination";

export default function ModalCompanyNotReport({ api }) {
    const [modalType, setModalType] = useState('');
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const { data: dataPeriod } = useSWR(`/api/period/active`, getFetcher);
    const { data: dataNotReport, isLoading: isLoadingNotReport } = useSWR(modalType === 'notReport' ? `${api}/missing-reports/${dataPeriod?.id}` : null, getFetcher);
    const { data: dataNotFinalized, isLoading: isLoadingNotFinalized } = useSWR(modalType === 'notFinalized'  ? `${api}/missing-finalized-reports/${dataPeriod?.id}` : null, getFetcher);    

    const header = [
        'Nama Perusahaan',
        'Alamat Kantor',
        'Penganggung Jawab',
        'Telepon Kantor',
        'Tipe Perusahaan'
    ]
    const content = (item) => (
        <TableRow key={item?.id}>
            <TableCell>{item?.name}</TableCell>
            <TableCell>{item?.alamatKantor}</TableCell>
            <TableCell>{item?.penanggungJawab}</TableCell>
            <TableCell>{item?.telpKantor}</TableCell>
            <TableCell>{item?.tipePerusahaan?.map((item) => item.join(', '))}</TableCell>
        </TableRow>
    )
    const handleModalOpen = (type) => {
        setModalType(type);
        onOpen();
    };

    return(
        <>
            <div className="flex items-center justify-end gap-1 mb-4">
                <Button onPress={() => handleModalOpen("notReport")} size="sm" color="primary">Belum Lapor</Button>
                <Button onPress={() => handleModalOpen("notFinalized")} size="sm" color="primary">Belum Finalisasi</Button>
            </div>

            <Modal size="3xl" isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            {
                                modalType === "notReport" 
                                    ? "Daftar Perusahaan Belum Lapor" 
                                    : modalType === "notFinalized" 
                                    ? "Daftar Perusahaan Belum Finalisasi" 
                                    : ""
                            }
                        </ModalHeader>
                        <ModalBody>
                            <ClientTablePagination 
                                header={header} 
                                content={content} 
                                data={
                                    modalType === "notReport" 
                                        ? dataNotReport?.companies 
                                        : modalType === "notFinalized" 
                                        ? dataNotFinalized?.companies 
                                        : []
                                } 
                                isLoading={
                                    modalType === "notReport" 
                                        ? isLoadingNotReport 
                                        : modalType === "notFinalized" 
                                        ? isLoadingNotFinalized 
                                        : false
                                } 
                            />
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
