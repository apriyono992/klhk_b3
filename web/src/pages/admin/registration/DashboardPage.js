import { useState, useEffect } from 'react';
import RootAdmin from '../../../components/layouts/RootAdmin'
import { Button, Card, CardBody, CardHeader, Tabs, Tab, Chip, DatePicker, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import HeaderPage from '../../../components/elements/HeaderPage'
import { ArrowDownOnSquareIcon, ArrowPathIcon, CheckIcon, ClockIcon, DocumentArrowUpIcon, DocumentDuplicateIcon, DocumentPlusIcon, FunnelIcon, ListBulletIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { BarChart } from '@mui/x-charts/BarChart';
import { SparkLineChart } from '@mui/x-charts'
import CountWidget from '../../../components/elements/CountWidget'
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

    const [selectedtype, setSelectedtype] = useState('import');
    const [dataChartImport, setDataChartImport] = useState([]);
    
    const { data, isLoading, mutate } = useSWR(`/api/dashboard/registrasi/header?startDate=${date.startDate}&endDate=${date.endDate}&type=${selectedtype}`, getFetcher);
    const { dataImport, isLoadingImport } = useSWR(`/api/dashboard/registrasi/content-import?startDate=${date.startDate}&endDate=${date.endDate}&type=${selectedtype}`, getFetcher);
     console.log(data);

    const handleTabClick = (value) => {
        console.log(value,'cek');
        
        setSelectedtype(value);
    };
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


    const labels = data?.responseData?.bahanB3.length < 0 ? data?.responseData?.bahanB3?.map(item => item.nama_bahan) : [];
    const values = data?.responseData?.bahanB3.length < 0 ? data?.responseData?.bahanB3?.map(item => item.count) : [];
    const labelsCom = data?.responseData?.company.length < 0 ? data?.responseData?.company?.map(item => item.company_name) : [];
    const valuesCom = data?.responseData?.company.length < 0 ? data?.responseData?.company?.map(item => item.count) : [];

    const labelsNegara = dataImport?.responseData?.negaraAsal.length ? dataImport?.responseData?.negaraAsal?.map(item => item.asal_negara) : [];
    const valuesNegara = dataImport?.responseData?.negaraAsal.length ? dataImport?.responseData?.negaraAsal?.map(item => item.total_registrasi) : [];
    const labelsAsal = dataImport?.responseData?.pelabuhan_asal.length ? dataImport?.responseData?.pelabuhan_asal?.map(item => item.pelabuhan_asal) : [];
    const valuesAsal = dataImport?.responseData?.pelabuhan_asal.length ? dataImport?.responseData?.pelabuhan_asal?.map(item => item.total_registrasi) : [];
    const labelsBongkar = dataImport?.responseData?.pelabuhan_bongkar.length ? dataImport?.responseData?.pelabuhan_bongkar?.map(item => item.nama_bahan) : [];
    const valuesBongkar = dataImport?.responseData?.pelabuhan_bongkar.length ? dataImport?.responseData?.pelabuhan_bongkar?.map(item => item.total_registrasi) : [];
    const labelsMuat = dataImport?.responseData?.pelabuhan_muat.length ? dataImport?.responseData?.pelabuhan_muat?.map(item => item.pelabuhan_muat) : [];
    const valuesMuat = dataImport?.responseData?.pelabuhan_muat.length ? dataImport?.responseData?.pelabuhan_muat?.map(item => item.total_registrasi) : [];
    
    

    return (
        <RootAdmin>
            <HeaderPage
                title="Dashboard Registrasi"
                subtitle="Gambaran Umum"
                action={<FilterForm handleStartDate={handleStartDate} handleEndDate={handleEndDate} handleFilterDate={handleFilterDate}/>}
            />
            <div className='grid grid-cols-1 md:grid-cols-4 gap-3 pt-5'>
                <Card radius='sm' className='col-span-3'>
                    <CardBody>
                        <div className='flex flex-row gap-5'>
                            <div>
                                <h4 className="text-medium font-medium text-gray-400">Total Registration</h4>
                                <h1 className="text-5xl font-semibold pt-5">{data?.responseData?.total}</h1>
                                <Chip size='sm' variant='flat' color='success' startContent={<ClockIcon className='size-4'/>}>dengan rata-rata proses {data?.responseData?.processAvg} hari</Chip>
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
                                    <span className='text-xs text-gray-400 capitalize'>Import</span>
                                </div>
                                <span className='text-2xl font-bold'>{data?.responseData?.typeRegistrasi?.import}</span>
                            </div>
                            <Divider orientation="vertical" />
                            <div className='w-full flex flex-col gap-4'>
                                <div className='flex items-center gap-2'>
                                    <Button isIconOnly variant='flat' color='primary' size='sm' className='rounded-full'><DocumentPlusIcon className='size-4'/></Button>
                                    <span className='text-xs text-gray-400 capitalize'>Produsen</span>
                                </div>
                                <span className='text-2xl font-bold'>{data?.responseData?.typeRegistrasi?.produsen}</span>
                            </div>
                        </div>
                    </CardBody>
                </Card>
                <Card radius='sm' className='col-span-1'>
                    <CardHeader className='text-primary font-semibold text-lg'>Registration Masuk Hari Ini</CardHeader>
                     <CardBody className='flex flex-col gap-4'>
                        <div className='flex items-center gap-3'>
                            <Button isIconOnly variant='flat' color='primary' size='sm' className='rounded-full'><ArrowDownOnSquareIcon className='size-4'/></Button> 
                            <div className='flex flex-col gap-1'>
                                <span className='text-gray-400 text-xs uppercase leading-3'>Masuk</span>
                                <span className='text-lg font-semibold leading-3'>{data?.responseData?.processStatus?.masuk}</span>
                            </div>
                        </div>
                        <div className='flex items-center gap-3'>
                            <Button isIconOnly variant='flat' color='primary' size='sm' className='rounded-full'><ArrowPathIcon className='size-4'/></Button> 
                            <div className='flex flex-col gap-1'>
                                <span className='text-gray-400 text-xs uppercase leading-3'>Proses</span>
                                <span className='text-lg font-semibold leading-3'>{data?.responseData?.processStatus?.proses}</span>
                            </div>
                        </div>
                        <div className='flex items-center gap-3'>
                            <Button isIconOnly variant='flat' color='primary' size='sm' className='rounded-full'><CheckIcon className='size-4'/></Button> 
                            <div className='flex flex-col gap-1'>
                                <span className='text-gray-400 text-xs uppercase leading-3'>Selesai</span>
                                <span className='text-lg font-semibold leading-3'>{data?.responseData?.processStatus?.selesai}</span>
                            </div>
                        </div>
                        <div className='flex items-center gap-3'>
                            <Button isIconOnly variant='flat' color='primary' size='sm' className='rounded-full'><XMarkIcon className='size-4'/></Button> 
                            <div className='flex flex-col gap-1'>
                                <span className='text-gray-400 text-xs uppercase leading-3'>Tolak</span>
                                <span className='text-lg font-semibold leading-3'>{data?.responseData?.processStatus?.ditolak}</span>
                            </div>
                        </div>
                    </CardBody>
                </Card>
                <Card radius='sm' className='col-span-4 p-3'>
                    <Tabs defaultValue={selectedtype}>
                        <Tab title="Import" value="import" onClick={() => console.log('test')
                        }>
                        <div>
                            <CardHeader>
                                <span className='text-primary text-xl font-bold'>10 Jenis B3 Terbanyak (import)</span>
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
                                <span className='text-primary text-xl font-bold'>Asal Negara</span>
                            </CardHeader>
                            <CardBody className='w-full flex flex-col items-center py-5 text-center'>
                                <BarChart
                                    xAxis={[{
                                        scaleType: 'band',
                                        data: labelsNegara,
                                        label: 'Jenis B3',
                                        barGapRatio: 0,
                                        categoryGapRatio: 0.4,
                                    }]}
                                    series={[
                                        { data: valuesNegara},
                                    ]}
                                    height={300}
                                />
                            </CardBody>
                        </div>
                         
                        <div>
                            <CardHeader>
                                <span className='text-primary text-xl font-bold'>Pelabuan Asal</span>
                            </CardHeader>
                            <CardBody className='w-full flex flex-col items-center py-5 text-center'>
                                <BarChart
                                    xAxis={[{
                                        scaleType: 'band',
                                        data: labelsAsal,
                                        label: 'Jenis B3',
                                        barGapRatio: 0,
                                        categoryGapRatio: 0.4,
                                    }]}
                                    series={[
                                        { data: valuesAsal },
                                    ]}
                                    height={300}
                                />
                            </CardBody>
                         </div>
                        
                        <div>
                            <CardHeader>
                                <span className='text-primary text-xl font-bold'>Pelabuan Muat</span>
                            </CardHeader>
                            <CardBody className='w-full flex flex-col items-center py-5 text-center'>
                                <BarChart
                                    xAxis={[{
                                        scaleType: 'band',
                                        data: labelsMuat,
                                        label: 'Jenis B3',
                                        barGapRatio: 0,
                                        categoryGapRatio: 0.4,
                                    }]}
                                    series={[
                                        { data: valuesMuat },
                                    ]}
                                    height={300}
                                />
                            </CardBody>
                        </div>
                        
                        
                        <div>
                            <CardHeader>
                                <span className='text-primary text-xl font-bold'>Pelabuan Bongkar</span>
                            </CardHeader>
                            <CardBody className='w-full flex flex-col items-center py-5 text-center'>
                                <BarChart
                                    xAxis={[{
                                        scaleType: 'band',
                                        data: labelsBongkar,
                                        label: 'Jenis B3',
                                        barGapRatio: 0,
                                        categoryGapRatio: 0.4,
                                    }]}
                                    series={[
                                        { data: valuesBongkar },
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
                        </Tab>
                        <Tab title="Produsen" value="produsen" onClick={() => handleTabClick('produsen')}>
                        <div>
                            <CardHeader>
                                <span className='text-primary text-xl font-bold'>10 Jenis B3 Terbanyak (Produsen)</span>
                            </CardHeader>
                            <CardBody className='w-full flex flex-col items-center py-5 text-center'>
                                <BarChart
                                    xAxis={[{
                                        scaleType: 'band',
                                        data:labels,
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
                        </Tab>
                    </Tabs>
                </Card>
                <div className='col-span-4'>
                    <Table aria-label="Example static collection table">
                        <TableHeader>
                            <TableColumn>Perusahaan</TableColumn>
                            <TableColumn>Jumlah</TableColumn>
                        </TableHeader>
                        <TableBody>
                             {data?.responseData?.company?.map((data,index) => (
                                <TableRow key={index}>
                                    <TableCell>{data?.company_name}</TableCell>
                                    <TableCell>{data?.count} Registration</TableCell>
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
