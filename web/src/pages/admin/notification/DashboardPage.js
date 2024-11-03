import React from 'react'
import RootAdmin from '../../../components/layouts/RootAdmin'
import { Button, Card, CardBody, Chip, DatePicker, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react'
import { BellAlertIcon, ClockIcon, DocumentPlusIcon, FunnelIcon } from '@heroicons/react/24/outline'
import HeaderPage from '../../../components/elements/HeaderPage'

export default function DashboardPage() {
    const chart = [
        { label: 'Diterima dari Otoritas Asal B3', value: 1153 },
        { label: 'Verifikasi Administrasi dan Teknis', value: 1000 },
        { label: 'Kirim Surat Kebenaran Impor ke Importir', value: 800 },
        { label: 'Tunggu Respon', value: 700 },
        { label: 'Ada Rencana Import', value: 600 },
        { label: 'Tidak Ada Import', value: 500 },
        { label: 'Selesai', value: 400 },
        { label: 'Dibatalkan', value: 300 },
    ]
    return (
        <RootAdmin>
            <HeaderPage
                title="Dashboard Notifikasi"
                subtitle="Gambaran Umum"
                action={<FilterForm/>}
            />
            <div className='grid grid-cols-1 md:grid-cols-4 gap-3 pt-5'>
                <Card radius='sm' className='col-span-2'>
                    <CardBody className='h-full flex flex-col items-center justify-center group'>
                        <BellAlertIcon className="size-20 stroke-slate-300 transform group-hover:rotate-12 ease-out duration-300"/>
                        <h4 className="text-medium font-medium text-gray-400">Total Notifikasi</h4>
                        <h1 className="text-5xl font-semibold pt-4 pb-2">1654</h1>
                        <Chip size='sm' variant='flat' color='success' startContent={<ClockIcon className='size-4'/>}>dengan rata-rata proses 1 hari</Chip>
                    </CardBody>
                </Card>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3 col-span-2'>
                    {chart.map((item, index) => (
                        <Card key={index} radius='sm'>
                            <CardBody className='flex flex-col gap-4'>
                                <div className='flex items-center gap-2'>
                                    <Button isIconOnly variant='flat' color='secondary' size='sm' className='rounded-full'><DocumentPlusIcon className='size-4'/></Button>
                                    <span className='text-xs text-gray-400 capitalize'>{item.label}</span>
                                </div>
                                <span className='text-2xl font-bold'>{item.value}</span>
                            </CardBody>
                        </Card>

                    ))}
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
