import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, TableRow, TableCell} from "@nextui-org/react";
import { month } from "../../../../../services/enum";
import ClientTablePagination from "../../../../elements/ClientTablePagination";
import { EyeIcon } from "@heroicons/react/24/outline";

export default function ModalConsumptionDetail({ data }) {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const header = [
        'Nama Perusahaan',
        'Alamat Kantor',
    ]
    const content = (item) => (
        <TableRow key={item?.id}>
            <TableCell>{item?.dataSupplier?.namaSupplier}</TableCell>
            <TableCell>{item?.dataSupplier?.alamat}</TableCell>
        </TableRow>
    )

    return (
        <>
        <Button isIconOnly size="sm" color="primary" onPress={onOpen}><EyeIcon className="size-4" /></Button>
        <Modal size="3xl" isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
            {(onClose) => (
                <>
                    <ModalHeader className="flex flex-col gap-1">Detail Laporan Konsumsi</ModalHeader>
                    <ModalBody className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className='flex flex-col'>
                            <span className='text-xs text-gray-400 uppercase'>Perusahaan</span>
                            <span className='text-sm font-medium'>{data?.company?.name}</span>
                        </div>
                        <div className='flex flex-col'>
                            <span className='text-xs text-gray-400 uppercase'>Jenis B3</span>
                            <span className='text-sm font-medium'>{data?.dataBahanB3?.namaBahanKimia}</span>
                        </div>
                        <div className='flex flex-col'>
                            <span className='text-xs text-gray-400 uppercase'>Jumlah Pembelian</span>
                            <span className='text-sm font-medium'>{data?.jumlahPembelianB3}</span>
                        </div>
                        <div className='flex flex-col'>
                            <span className='text-xs text-gray-400 uppercase'>Jumlah Konsumsi</span>
                            <span className='text-sm font-medium'>{data?.jumlahB3Digunakan}</span>
                        </div>
                        <div className='flex flex-col'>
                            <span className='text-xs text-gray-400 uppercase'>Periode</span>
                            <span className='text-sm font-medium'>{data?.period?.name}</span>
                        </div>
                        <div className='flex flex-col'>
                            <span className='text-xs text-gray-400 uppercase'>Bulan</span>
                            <span className='text-sm font-medium'>{month[data?.bulan-1]}</span>
                        </div>
                        <div className='flex flex-col'>
                            <span className='text-xs text-gray-400 uppercase'>Tahun</span>
                            <span className='text-sm font-medium'>{data?.tahun}</span>
                        </div>
                        <div className="col-span-2">
                            <ClientTablePagination header={header} content={content} data={data?.DataSupplierOnPelaporanPenggunaanB3}/>
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