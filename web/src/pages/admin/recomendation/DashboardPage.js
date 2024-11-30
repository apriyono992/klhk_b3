import React from 'react'
import { useState, useEffect } from 'react';
import RootAdmin from '../../../components/layouts/RootAdmin'
import { Button, Card, CardBody, CardHeader, Chip, DatePicker, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import HeaderPage from '../../../components/elements/HeaderPage'
import { ArrowDownOnSquareIcon, ArrowPathIcon, CheckIcon, ClockIcon, DocumentArrowUpIcon, DocumentDuplicateIcon, DocumentPlusIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { BarChart } from '@mui/x-charts/BarChart';
import { SparkLineChart } from '@mui/x-charts';
import {getFetcher} from '../../../services/api';
import useSWR from "swr";

export default function DashboardPage() {
    const currentDate = new Date();

    let month = currentDate.getMonth() + 1; // Months are zero-indexed, so add 1
    let day = currentDate.getDate();
    const year = currentDate.getFullYear();

    // Ensure month and day are always two digits
    month = month.toString().padStart(2, '0');
    day = day.toString().padStart(2, '0');

    // Construct the formatted date string
    const formattedDate = `${month}-${day}-${year}`;

    const [date, setDate] = useState({
    endDate: formattedDate,
    startDate: formattedDate,
    });

    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()
    
    const { DataBahanB3, isLoadingB3 } = useSWR(`/api/dashboard/permohonan/bahanb3?startDate=${date.startDate}&endDate=${date.endDate}`, getFetcher);
    const { DataJeniSurat, isLoadingSurat } = useSWR(`/api/dashboard/permohonan/jenis-surat?startDate=${date.startDate}&endDate=${date.endDate}`, getFetcher);
    const { DataStatus, isLoading, mutate } = useSWR(`/api/dashboard/permohonan/status?startDate=${date.startDate}&endDate=${date.endDate}`, getFetcher);
    
    const handleStartDate = (date) => {
    setStartDate(date)
    
    };
    const handleEndDate = (date) => {
    setEndDate(date)
    
    };
    const handleFilterDate = () => {
    console.log(startDate);
    
    setDate({
    startDate: startDate,
    endDate: endDate,
    })
    
    };

    const permohonanBaru = DataJeniSurat?.jenis_surat?.find(jenis => jenis?.tipe_surat === 'BARU')
    const penambahanUnit = DataJeniSurat?.jenis_surat?.find(jenis => jenis?.tipe_surat === 'PENAMBAHAN KENDARAAN')
    const penambahanJenisB3 = DataJeniSurat?.jenis_surat?.find(jenis => jenis?.tipe_surat === 'PENAMBAHAN KENDARAAN')
    const perpanjangan = DataJeniSurat?.jenis_surat?.find(jenis => jenis?.tipe_surat === 'PERPANJANGAN')

    const labels = DataBahanB3?.responseData.length < 0 ? DataBahanB3?.map(item => item.nama_bahan):[];
    const values = DataBahanB3?.responseData.length < 0 ?  DataBahanB3?.map(item => item.count): [];
    const labelsCom = DataJeniSurat?.responseData?.perusahaan.length < 0 ? DataJeniSurat?.perusahaan?.map(item => item.company_name) : [];
    const valuesCom =DataJeniSurat?.responseData?.perusahaan.length < 0 ? DataJeniSurat?.perusahaan?.map(item => item.count) : [];

    return (
        <RootAdmin>
            <HeaderPage
                title="Dashboard Rekomendasi"
                subtitle="Gambaran Umum"
                action={<FilterForm handleStartDate={handleStartDate} handleEndDate={handleEndDate} handleFilterDate={handleFilterDate}/>}
            />
            <div className='grid grid-cols-1 md:grid-cols-4 gap-3 pt-5'>
                <Card radius='sm' className='col-span-3'>
                    <CardBody>
                        <div className='flex flex-row gap-5'>
                            <div>
                                <h4 className="text-medium font-medium text-gray-400">Total Permohonan</h4>
                                <h1 className="text-5xl font-semibold pt-5">{DataJeniSurat?.total_permohonan}</h1>
                                <Chip size='sm' variant='flat' color='success' startContent={<ClockIcon className='size-4'/>}>dengan rata-rata proses 1 hari</Chip>
                            </div>
                            <div className='w-full'>
                                <SparkLineChart data={[1, 4, 2, 5, 7, 2, 4, 6]} height={100} />
                            </div>
                        </div>
                        <Divider className="my-4" />
                        <div className="flex items-center gap-3">
                            <div className='w-full flex flex-col gap-4'>
                                <div className='flex items-center gap-2'>
                                    <Button isIconOnly variant='flat' color='primary' size='sm' className='rounded-full'><DocumentPlusIcon className='size-4'/></Button>
                                    <span className='text-xs text-gray-400 capitalize'>Permohonan Baru</span>
                                </div>
                                <span className='text-2xl font-bold'>{permohonanBaru}</span>
                            </div>
                            <Divider orientation="vertical" />
                            <div className='w-full flex flex-col gap-4'>
                                <div className='flex items-center gap-2'>
                                    <Button isIconOnly variant='flat' color='warning' size='sm' className='rounded-full'><DocumentDuplicateIcon className='size-4'/></Button>
                                    <span className='text-xs text-gray-400 capitalize'>penambahan unit kendaraan</span>
                                </div>
                                <span className='text-2xl font-bold'>{penambahanUnit}</span>
                            </div>
                            <Divider orientation="vertical" />
                            <div className='w-full flex flex-col gap-4'>
                                <div className='flex items-center gap-2'>
                                    <Button isIconOnly variant='flat' color='danger' size='sm' className='rounded-full'><DocumentDuplicateIcon className='size-4'/></Button>
                                    <span className='text-xs text-gray-400 capitalize'>penambahan jenis b3</span>
                                </div>
                                <span className='text-2xl font-bold'>{penambahanJenisB3}</span>
                            </div>
                            <Divider orientation="vertical" />
                            <div className='w-full flex flex-col gap-4'>
                                <div className='flex items-center gap-2'>
                                    <Button isIconOnly variant='flat' color='secondary' size='sm' className='rounded-full'><DocumentArrowUpIcon className='size-4'/></Button>
                                    <span className='text-xs text-gray-400 capitalize'>perpanjangan</span>
                                </div>
                                <span className='text-2xl font-bold'>{perpanjangan}</span>
                            </div>
                        </div>
                    </CardBody>
                </Card>
                <Card radius='sm' className='col-span-1'>
                    <CardHeader className='text-primary font-semibold text-lg'>Permohonan Masuk Hari Ini</CardHeader>
                    <CardBody className='flex flex-col gap-4'>
                        <div className='flex items-center gap-3'>
                            <Button isIconOnly variant='flat' color='primary' size='sm' className='rounded-full'><ArrowDownOnSquareIcon className='size-4'/></Button> 
                            <div className='flex flex-col gap-1'>
                                <span className='text-gray-400 text-xs uppercase leading-3'>Masuk</span>
                                <span className='text-lg font-semibold leading-3'>{DataStatus?.MASUK}</span>
                            </div>
                        </div>
                        <div className='flex items-center gap-3'>
                            <Button isIconOnly variant='flat' color='primary' size='sm' className='rounded-full'><ArrowPathIcon className='size-4'/></Button> 
                            <div className='flex flex-col gap-1'>
                                <span className='text-gray-400 text-xs uppercase leading-3'>Proses</span>
                                <span className='text-lg font-semibold leading-3'>{DataStatus?.PROSES}</span>
                            </div>
                        </div>
                        <div className='flex items-center gap-3'>
                            <Button isIconOnly variant='flat' color='primary' size='sm' className='rounded-full'><CheckIcon className='size-4'/></Button> 
                            <div className='flex flex-col gap-1'>
                                <span className='text-gray-400 text-xs uppercase leading-3'>Selesai</span>
                                <span className='text-lg font-semibold leading-3'>{DataStatus?.SELESAI}</span>
                            </div>
                        </div>
                        <div className='flex items-center gap-3'>
                            <Button isIconOnly variant='flat' color='primary' size='sm' className='rounded-full'><XMarkIcon className='size-4'/></Button> 
                            <div className='flex flex-col gap-1'>
                                <span className='text-gray-400 text-xs uppercase leading-3'>Tolak</span>
                                <span className='text-lg font-semibold leading-3'>{DataStatus?.DITOLAK}</span>
                            </div>
                        </div>
                    </CardBody>
                </Card>  
                <Card radius='sm' className='col-span-4'>
                        <div>
                            <CardHeader>
                                <span className='text-primary text-xl font-bold'>Jenis B3 Terbanyak</span>
                            </CardHeader>
                            <CardBody className='w-full flex flex-col items-center py-5 text-center'>
                                <BarChart
                                    xAxis={[{
                                        scaleType: 'band',
                                        data: labels,
                                        label: 'Jenis B3',
                                        barGapRatio: 0,
                                        categoryGapRatio: 0.4,
                                    }]}
                                    series={[
                                        { data: values },
                                    ]}
                                    height={300}
                                />
                            </CardBody>
                        </div>
                          <div>
                            <CardHeader>
                                <span className='text-primary text-xl font-bold'>Perusahaan</span>
                            </CardHeader>
                            <CardBody className='w-full flex flex-col items-center py-5 text-center'>
                                <BarChart
                                    xAxis={[{
                                        scaleType: 'band',
                                        data: labelsCom,
                                        label: 'Jenis B3',
                                        barGapRatio: 0,
                                        categoryGapRatio: 0.4,
                                    }]}
                                    series={[
                                        { data: valuesCom },
                                    ]}
                                    height={300}
                                />
                            </CardBody>
                        </div>
                </Card>
                <div className='col-span-4'>
                    <Table aria-label="Example static collection table">
                        <TableHeader>
                            <TableColumn>Perusahaan</TableColumn>
                            <TableColumn>Jumlah</TableColumn>
                        </TableHeader>
                        <TableBody isLoading={isLoadingSurat}>
                            {DataJeniSurat?.perusahaan.map((data,index) => (
                                <TableRow key={index}>
                                    <TableCell>{data.company_name}</TableCell>
                                    <TableCell>{data.count} Permohonan</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </RootAdmin>
    )
}

function FilterForm({handleStartDate, handleEndDate, handleFilterDate}) {
    return (
        <Dropdown closeOnSelect={false}>
            <DropdownTrigger>
                <Button radius='sm' variant='bordered' startContent={<FunnelIcon className='size-4'/>}>Saring</Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="">
                <DropdownItem isReadOnly>
                    <DatePicker size='sm' label="Tanggal Mulai" labelPlacement='outside' onChange={handleStartDate}/>
                </DropdownItem>
                <DropdownItem isReadOnly>
                    <DatePicker size='sm' label="Tanggal Akhir" labelPlacement='outside' onChange={handleEndDate}/>
                </DropdownItem>
                <DropdownItem isReadOnly>
                    <Button size='sm' color='primary' onClick={handleFilterDate}>Terapkan</Button>
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    )
}
