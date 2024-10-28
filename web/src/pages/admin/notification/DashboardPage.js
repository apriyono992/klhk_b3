import React from 'react'
import RootAdmin from '../../../components/layouts/RootAdmin'
import { Button, Card, CardBody, DatePicker, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input } from '@nextui-org/react'
import { BellAlertIcon, ClockIcon, FunnelIcon, ListBulletIcon } from '@heroicons/react/24/outline'
import HeaderPage from '../../../components/elements/HeaderPage'

export default function DashboardPage() {
    return (
        <RootAdmin>
            <HeaderPage
                title="Dashboard Notifikasi"
                subtitle="Gambaran Umum"
                action={<FilterForm/>}
            />
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pt-5'>
                <Card radius="sm">
                    <CardBody className='flex flex-col gap-3'>
                        <span className='text-gray-400 text-sm'>Rata Rata proses notifikasi</span>
                        <div className='flex flex-row items-center gap-2'>
                            <Button isIconOnly variant='flat' color='primary' className='rounded-full p-2'><ClockIcon className='size-10'/></Button>
                            <span className='text-2xl font-semibold'>1 Hari</span>
                        </div> 
                    </CardBody>
                </Card>
                <Card radius="sm">
                    <CardBody className='flex flex-col gap-3'>
                        <span className='text-gray-400 text-sm'>Jumlah data notifikasi</span>
                        <div className='flex flex-row items-center gap-2'>
                            <Button isIconOnly variant='flat' color='primary' className='rounded-full p-2'><ListBulletIcon className='size-10'/></Button>
                            <span className='text-2xl font-semibold'>1</span>
                        </div> 
                    </CardBody>
                </Card>
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
