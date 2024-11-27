import React from 'react'
import RootAdmin from '../../../../../components/layouts/RootAdmin'
import { Button, Card, CardBody, CardHeader, Chip, DatePicker, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import HeaderPage from '../../../../../components/elements/HeaderPage'
import { ArrowDownOnSquareIcon, ArrowPathIcon, CheckIcon, ClockIcon, DocumentArrowUpIcon, DocumentDuplicateIcon, DocumentPlusIcon, FunnelIcon, ListBulletIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { BarChart } from '@mui/x-charts/BarChart';
import { SparkLineChart } from '@mui/x-charts'
import CountWidget from '../../../../../components/elements/CountWidget'

export default function DashboardPage() {
    return (
        <RootAdmin>
            <HeaderPage
                title="Dashboard Registrasi"
                subtitle="Gambaran Umum"
                action={<FilterForm/>}
            />
            <div className='grid grid-cols-1 md:grid-cols-4 gap-3 pt-5'>
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
