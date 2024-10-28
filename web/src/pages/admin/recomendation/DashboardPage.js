import React from 'react'
import RootAdmin from '../../../components/layouts/RootAdmin'
import { Button, Card, CardBody, CardHeader, Chip, DatePicker, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import HeaderPage from '../../../components/elements/HeaderPage'
import { ArrowDownOnSquareIcon, ArrowPathIcon, CheckIcon, ClockIcon, DocumentArrowUpIcon, DocumentDuplicateIcon, DocumentPlusIcon, FunnelIcon, ListBulletIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { BarChart } from '@mui/x-charts/BarChart';
import { SparkLineChart } from '@mui/x-charts'
import CountWidget from '../../../components/elements/CountWidget'

export default function DashboardPage() {
    return (
        <RootAdmin>
            <HeaderPage
                title="Dashboard Rekomendasi"
                subtitle="Gambaran Umum"
                action={<FilterForm/>}
            />
            <div className='grid grid-cols-1 md:grid-cols-4 gap-3 pt-5'>
                <Card radius='sm' className='col-span-3'>
                    <CardBody>
                        <div className='flex flex-row gap-5'>
                            <div>
                                <h4 className="text-medium font-medium text-gray-400">Total Permohonan</h4>
                                <h1 className="text-5xl font-semibold pt-5">1654</h1>
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
                                <span className='text-2xl font-bold'>1153</span>
                            </div>
                            <Divider orientation="vertical" />
                            <div className='w-full flex flex-col gap-4'>
                                <div className='flex items-center gap-2'>
                                    <Button isIconOnly variant='flat' color='warning' size='sm' className='rounded-full'><DocumentDuplicateIcon className='size-4'/></Button>
                                    <span className='text-xs text-gray-400 capitalize'>penambahan unit kendaraan</span>
                                </div>
                                <span className='text-2xl font-bold'>1153</span>
                            </div>
                            <Divider orientation="vertical" />
                            <div className='w-full flex flex-col gap-4'>
                                <div className='flex items-center gap-2'>
                                    <Button isIconOnly variant='flat' color='danger' size='sm' className='rounded-full'><DocumentDuplicateIcon className='size-4'/></Button>
                                    <span className='text-xs text-gray-400 capitalize'>penambahan jenis b3</span>
                                </div>
                                <span className='text-2xl font-bold'>1153</span>
                            </div>
                            <Divider orientation="vertical" />
                            <div className='w-full flex flex-col gap-4'>
                                <div className='flex items-center gap-2'>
                                    <Button isIconOnly variant='flat' color='secondary' size='sm' className='rounded-full'><DocumentArrowUpIcon className='size-4'/></Button>
                                    <span className='text-xs text-gray-400 capitalize'>perpanjangan</span>
                                </div>
                                <span className='text-2xl font-bold'>1153</span>
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
                                <span className='text-lg font-semibold leading-3'>10</span>
                            </div>
                        </div>
                        <div className='flex items-center gap-3'>
                            <Button isIconOnly variant='flat' color='primary' size='sm' className='rounded-full'><ArrowPathIcon className='size-4'/></Button> 
                            <div className='flex flex-col gap-1'>
                                <span className='text-gray-400 text-xs uppercase leading-3'>Proses</span>
                                <span className='text-lg font-semibold leading-3'>10</span>
                            </div>
                        </div>
                        <div className='flex items-center gap-3'>
                            <Button isIconOnly variant='flat' color='primary' size='sm' className='rounded-full'><CheckIcon className='size-4'/></Button> 
                            <div className='flex flex-col gap-1'>
                                <span className='text-gray-400 text-xs uppercase leading-3'>Selesai</span>
                                <span className='text-lg font-semibold leading-3'>10</span>
                            </div>
                        </div>
                        <div className='flex items-center gap-3'>
                            <Button isIconOnly variant='flat' color='primary' size='sm' className='rounded-full'><XMarkIcon className='size-4'/></Button> 
                            <div className='flex flex-col gap-1'>
                                <span className='text-gray-400 text-xs uppercase leading-3'>Tolak</span>
                                <span className='text-lg font-semibold leading-3'>10</span>
                            </div>
                        </div>
                    </CardBody>
                </Card>  
                <Card radius='sm' className='col-span-4'>
                    <CardHeader>
                        <span className='text-primary text-xl font-bold'>10 Jenis B3 Terbanyak</span>
                    </CardHeader>
                    <CardBody className='w-full flex flex-col items-center py-5 text-center'>
                        <BarChart
                            xAxis={[{ 
                                scaleType: 'band', 
                                data: ['consectetur', 'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'adipiscing', 'pellentesque', 'pharetra', 'pretium'],
                                label: 'Jenis B3',
                                barGapRatio: 0,
                                categoryGapRatio: 0.4, 
                            }]}
                            series={[
                                { data: [4, 10, 12, 7, 10, 5, 3, 7, 8, 2] }, 
                            ]}
                            height={300}
                        />
                    </CardBody>
                </Card>
                <div className='col-span-4'>
                    <Table aria-label="Example static collection table">
                        <TableHeader>
                            <TableColumn>Perusahaan</TableColumn>
                            <TableColumn>Jumlah</TableColumn>
                        </TableHeader>
                        <TableBody>
                            <TableRow key="1">
                                <TableCell>PT. Tony Reichert</TableCell>
                                <TableCell>12 Permohonan</TableCell>
                            </TableRow>
                            <TableRow key="2">
                                <TableCell>PT. Zoey Lang</TableCell>
                                <TableCell>20 Permohonan</TableCell>
                            </TableRow>
                            <TableRow key="3">
                                <TableCell>PT. Jane Fisher</TableCell>
                                <TableCell>30 Permohonan</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </RootAdmin>
    )
}

function FilterForm() {
    return (
        <Dropdown closeOnSelect={false}>
            <DropdownTrigger>
                <Button radius='sm' variant='bordered' startContent={<FunnelIcon className='size-4'/>}>Saring</Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="">
                <DropdownItem isReadOnly>
                    <DatePicker size='sm' label="Tanggal Mulai" labelPlacement='outside' />
                </DropdownItem>
                <DropdownItem isReadOnly>
                    <DatePicker size='sm' label="Tanggal Akhir" labelPlacement='outside' />
                </DropdownItem>
                <DropdownItem isReadOnly>
                    <Button size='sm' color='primary'>Terapkan</Button>
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    )
}
