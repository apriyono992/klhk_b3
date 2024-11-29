import React, { useState, useEffect } from 'react';
import RootAdmin from '../../../../components/layouts/RootAdmin'
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Chip,
    DatePicker,
    Divider,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from '@nextui-org/react'
import HeaderPage from '../../../../components/elements/HeaderPage'
import { ArrowDownOnSquareIcon, ArrowPathIcon, CheckIcon, ClockIcon, DocumentArrowUpIcon, DocumentDuplicateIcon, DocumentPlusIcon, FunnelIcon, ListBulletIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { BarChart } from '@mui/x-charts/BarChart';
import { SparkLineChart } from '@mui/x-charts'
import CountWidget from '../../../../components/elements/CountWidget'
import CustomDataGrid from "../../../../components/elements/CustomDataGrid";
import useSWR from "swr";
import { getFetcher } from "../../../../services/api";
import ControlledInput from "../../../../components/elements/ControlledInput";
import {useForm} from "react-hook-form";

export default function ProdusenGrafik() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [b3Data, setB3Data] = useState([]);
    const [companyData, setCompanyData] = useState([]);

    // Fetch data grafik bahan b3 & perusahaan terbanyak
    const { data: produsenB3, mutate: mutateProdusenB3 } = useSWR(
        `/api/dashboard/pelaporan/Produsen/grafik/bahanb3?startDate=${startDate}&endDate=${endDate}`,
        getFetcher
    );

    const { data: produsenPerusahaan, mutate: mutateProdusenPerusahaan } = useSWR(
        `/api/dashboard/pelaporan/Produsen/grafik/perusahaan?startDate=${startDate}&endDate=${endDate}`,
        getFetcher
    );

    // masukkan ke data usestate setiap data baru ter-fetch
    useEffect(() => {
        console.log(produsenB3)
        if (produsenB3) {
            setB3Data(produsenB3.responseData.map(item => ({
                name: item.namaBahanKimia,
                total: item.total
            })));
        }

        if (produsenPerusahaan) {
            setCompanyData(produsenPerusahaan.responseData.map(item => ({
                name: item.name,
                total: item.total
            })));
        }
    }, [produsenB3, produsenPerusahaan]);

    const handleFilterApply = (start, end) => {
        setStartDate(start);
        setEndDate(end);
        mutateProdusenB3(); // Refresh data for produsenB3
        mutateProdusenPerusahaan(); // Refresh data for produsenPerusahaan
    };

    return (<RootAdmin>
            <HeaderPage
                title="Grafik Pelaporan Produsen"
                subtitle="Gambaran Umum"
                action={<FilterForm onApplyFilter={handleFilterApply}/>}
            />
            <div className='grid grid-rows-1 md:grid-rows-4 gap-3 pt-5'>
                <Card>

                    <Tabs aria-label="Pelaporan Grafik B3" defaultValue="PelaporanGrafik">
                        <Tab title="Grafik Besaran B3 Terbanyak" value="B3Terbanyak">
                            <Card radius='sm' className='col-span-4'>
                                <CardHeader>
                                    <span className='text-primary text-xl font-bold'>10 Jenis B3 Terbanyak</span>
                                </CardHeader>
                                <CardBody className='w-full flex flex-col items-center py-5 text-center'>
                                    <BarChart
                                        xAxis={[{
                                            scaleType: 'band',
                                            data: b3Data.map(item => item.name),
                                            label: 'Jenis B3',
                                            barGapRatio: 0,
                                            categoryGapRatio: 0.4,
                                        }]}
                                        series={[
                                            { data: b3Data.map(item => item.total) }
                                        ]}
                                        height={300}
                                    />
                                </CardBody>
                            </Card>
                            <div className='col-span-4'>
                                <Table aria-label="Example static collection table">
                                    <TableHeader>
                                        <TableColumn>Jenis B3</TableColumn>
                                        <TableColumn>Jumlah</TableColumn>
                                    </TableHeader>
                                    <TableBody>
                                        {b3Data.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell>{item.total}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </Tab>
                        <Tab title="Grafik Produksi B3 Berdasarkan Perusahaan" value="B3TerbanyakPerusahaan">
                            <Card radius='sm' className='col-span-4'>
                                <CardHeader>
                                    <span className='text-primary text-xl font-bold'>10 Jenis B3 Terbanyak Berdasarkan Perusahaan</span>
                                </CardHeader>
                                <CardBody className='w-full flex flex-col items-center py-5 text-center'>
                                    <BarChart
                                        xAxis={[{
                                            scaleType: 'band',
                                            data: companyData.map(item => item.name),
                                            label: 'Perusahaan',
                                            barGapRatio: 0,
                                            categoryGapRatio: 0.4,
                                        }]}
                                        series={[
                                            { data: companyData.map(item => item.total) },
                                        ]}
                                        height={300}
                                    />
                                </CardBody>
                            </Card>
                            <div className='col-span-4'>
                                <Table aria-label="Example static collection table">
                                    <TableHeader>
                                        <TableColumn>Perusahaan</TableColumn>
                                        <TableColumn>Jumlah Produksi</TableColumn>
                                    </TableHeader>
                                    <TableBody>
                                        {companyData.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell>{item.total}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </Tab>
                    </Tabs>
                </Card>
            </div>
        </RootAdmin>)
}

function FilterForm({onApplyFilter}) {
    const { control, watch } = useForm({
        defaultValues: {
            startDate: "",
            endDate: "",
        },
    });
    const filters = watch();

    const handleApply = () => {
        onApplyFilter(filters.startDate, filters.endDate);
    };

    return (
        <Dropdown closeOnSelect={false}>
            <DropdownTrigger>
                <Button radius='sm' variant='bordered' startContent={<FunnelIcon className='size-4' />}>
                    Saring
                </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Filter Date">
                <DropdownItem isReadOnly>
                    <ControlledInput
                        name="startDate"
                        label="Tanggal Mulai"
                        type="date"
                        control={control}
                        isRequired
                        rules={{
                            required: "Tanggal Mulai harus diisi.",
                        }}
                    />
                </DropdownItem>
                <DropdownItem isReadOnly>
                    <ControlledInput
                        name="endDate"
                        label="Tanggal Selesai"
                        type="date"
                        control={control}
                        isRequired
                        rules={{
                            required: "Tanggal Selesai harus diisi.",
                        }}
                    />
                </DropdownItem>
                <DropdownItem isReadOnly>
                    <Button size='sm' color='primary' onClick={handleApply}>
                        Terapkan
                    </Button>
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
}
