import React from 'react'
import RootAdmin from '../../../../../components/layouts/RootAdmin'
import { Button, Card, CardBody, CardHeader, TableCell, TableRow } from '@nextui-org/react'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr';
import { getFetcher } from '../../../../../services/api';
import ClientTablePagination from '../../../../../components/elements/ClientTablePagination';
import { ArrowLeftIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import useCustomNavigate from '../../../../../hooks/useCustomNavigate';

export default function DetailPage() {
    const { id } = useParams();
    const navigate = useNavigate()
    const { editCompanyReportDistribution } = useCustomNavigate()
    const { data, isLoading } = useSWR(`/api/pelaporan-bahan-b3-distribusi/find/${id}`, getFetcher);
    const headerTransporter = ['Perusahaan Transporter', 'Alamat', 'Email']
    const headerCustomer = ['Perusahaan Pelanggan', 'Alamat', 'Email']
    const contentTransporter = (item) => (
        <TableRow key={item?.id}>
            <TableCell>{item?.dataTransporter?.namaTransPorter}</TableCell>
            <TableCell>{item?.dataTransporter?.alamat}</TableCell>
            <TableCell>{item?.dataTransporter?.email}</TableCell>
        </TableRow>
    )
    const contentCustomer = (item) => (
        <TableRow key={item?.id}>
            <TableCell>{item?.dataCustomer?.namaCustomer}</TableCell>
            <TableCell>{item?.dataCustomer?.alamat}</TableCell>
            <TableCell>{item?.dataCustomer?.email}</TableCell>
        </TableRow>
    )
    return (
        <RootAdmin>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-3'>
                <Card radius='sm' className='col-span-1'>
                    <CardHeader className='flex items-center gap-2'>
                        <Button onPress={() => navigate(-1)} size='sm' color='primary' startContent={<ArrowLeftIcon className='size-4' />}>Kembali</Button>
                        <Button onPress={() => editCompanyReportDistribution(data?.id)} size='sm' color='warning' startContent={<PencilSquareIcon className='size-4' />}>Ubah</Button>
                    </CardHeader>
                    <CardBody className='flex flex-col gap-3'>
                        <div className='flex flex-col'>
                            <span className='text-xs text-gray-400 uppercase'>Perusahaan</span>
                            <span className='text-sm font-medium'>Content</span>
                        </div>
                        <div className='flex flex-col'>
                            <span className='text-xs text-gray-400 uppercase'>Title</span>
                            <span className='text-sm font-medium'>Content</span>
                        </div>
                        <div className='flex flex-col'>
                            <span className='text-xs text-gray-400 uppercase'>Title</span>
                            <span className='text-sm font-medium'>Content</span>
                        </div>
                        <div className='flex flex-col'>
                            <span className='text-xs text-gray-400 uppercase'>Title</span>
                            <span className='text-sm font-medium'>Content</span>
                        </div>
                    </CardBody>
                </Card>
                <div className='col-span-3'>
                    <Card radius='sm' className='col-span-3'>
                        <CardBody>
                            <ClientTablePagination header={headerTransporter} content={contentTransporter} data={data?.DataTransporterOnPelaporanDistribusiBahanB3} />
                        </CardBody>
                    </Card>
                    <Card radius='sm' className='mt-3'>
                        <CardBody>
                            <ClientTablePagination header={headerCustomer} content={contentCustomer} data={data?.DataCustomerOnPelaporanDistribusiBahanB3} />
                        </CardBody>
                    </Card>
                </div>
            </div>
        </RootAdmin>
    )
}
