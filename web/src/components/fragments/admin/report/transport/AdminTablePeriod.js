import React, { useMemo, useState } from 'react'
import CustomDataGrid from '../../../../elements/CustomDataGrid'
import useSWR from 'swr'
import { getFetcher } from '../../../../../services/api';
import { Button, Card, CardBody, Chip } from '@nextui-org/react';
import { EyeIcon } from '@heroicons/react/24/outline';
import { month } from '../../../../../services/enum';
import IsValidIcon from '../../../../elements/isValidIcon';
import FilterReactSelect from '../../../../elements/FilterReactSelect';
import useCustomNavigate from '../../../../../hooks/useCustomNavigate';

export default function AdminTablePeriod() {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [appFilter, setAppFilter] = useState('');
    const { getAdminReportTransportVehicleDetail } = useCustomNavigate();
    const { data: dataApp, isLoading: isLoadingApp } = useSWR(`/api/rekom/permohonan/search`, getFetcher); 
    const { data: dataActivePeriod, isLoading: isLoadingActivePeriod } = useSWR('/api/period/active', getFetcher)
    const { data, isLoading } = useSWR(!isLoadingActivePeriod ? `/api/pelaporan-pengangkutan/search?page=${page + 1}&limit=${pageSize}&periodId=${dataActivePeriod?.id}${appFilter ? `&applicationId=${appFilter}` : ''}` : null, getFetcher);
    console.log(data);

    const columns = useMemo(() =>  [
        {
            field: 'period',
            headerName: 'Periode',
            valueGetter: (value, row) => row.period.name,
        },
        {
            field: 'bulan',
            headerName: 'Bulan',
            valueGetter: (value, row) => month[row.bulan-1],
        },
        {
            field: 'tahun',
            headerName: 'Tahun',
            valueGetter: (value, row) => row.tahun,
        },
       
        {
            field: 'application',
            headerName: 'Kode Permohonan',
            valueGetter: (value, row) => row.application.kodePermohonan,
        },
        {
            field: 'vehicle',
            headerName: 'Kendaraan',
            valueGetter: (value, row) => `${row.vehicle.modelKendaraan} - ${row.vehicle.noPolisi}`,
        },
        {
            field: 'bahanB3',
            headerName: 'Bahan B3',
            valueGetter: (value, row)  => 
                row?.pengangkutanDetails
                    ?.map((detail) => detail.b3Substance?.dataBahanB3?.namaBahanKimia)
                    ?.filter((nama) => nama)
                    ?.join(', ') || '-',
        },
        {
            field: 'perusahaanAsalMuat',
            headerName: 'Perusahaan Asal Muat',
            valueGetter: (value, row) =>
                row.pengangkutanDetails
                    ?.map((detail) =>
                        detail.DataPerusahaanTujuanBongkarOnPengakutanDetail
                            ?.map((subDetail) => subDetail.perusahaanAsalMuat?.namaPerusahaan)
                            ?.filter((nama) => nama)
                    )
                    .flat()
                    .join(', ') || '-',
        },
        {
            field: 'perusahaanTujuanBongkar',
            headerName: 'Perusahaan Tujuan Bongkar',
            valueGetter: (value, row) =>
                row.pengangkutanDetails
                    ?.map((detail) =>
                        detail.DataPerusahaanTujuanBongkarOnPengakutanDetail
                            ?.map((subDetail) => subDetail.perusahaanTujuanBongkar?.namaPerusahaan)
                            ?.filter((nama) => nama)
                    )
                    .flat()
                    .join(', ') || '-',
        },
        {
            field: 'totalDiangkut',
            headerName: 'Total yang Diangkut (Kg)',
            valueGetter: (value, row)  =>
                row?.pengangkutanDetails
                    ?.reduce((total, detail) => total + (detail.jumlahB3 || 0), 0) || 0,
        },
        {
            field: 'isFinalized',
            headerName: 'Finalisasi',
            renderCell: (params) => (
                <div className="flex mt-1">
                    <IsValidIcon value={params.row.isFinalized} validMessage="Sudah" invalidMessage="Belum" />
                </div>
            ),
        },
        {
            field: 'status',
            headerName: 'Status',
            renderCell: (params) => {
                console.log(params);
                switch (params.row.status) {
                    case 'Menunggu Persetujuan':
                        return (
                            <Chip color="warning" variant="flat" size="sm">
                                {params.row.status}
                            </Chip>
                        )
                    case 'Disetujui':
                        return (
                            <Chip color="success" variant="flat" size="sm">
                                {params.row.status}
                            </Chip>
                        )
                    case 'Ditolak':
                        return (
                            <Chip color="danger" variant="flat" size="sm">
                                {params.row.status}
                            </Chip>
                        )
                    default:
                        return (
                            <Chip color="secondary" variant="flat" size="sm">
                                Draft
                            </Chip>
                        )
                }
            },
            sortable: false,
            filterable: false,
        },
        {
            field: 'action',
            headerName: 'Aksi',
            renderCell: (params) => (
                <div className="flex items-center gap-1">
                    <Button onPress={() => getAdminReportTransportVehicleDetail(params.row.id)} isIconOnly size='sm' color='primary'><EyeIcon className='size-4'/></Button>
                </div>
            ),
            sortable: false,
            filterable: false
        },
    ], [getAdminReportTransportVehicleDetail]);
    
    return (
        <div>
            <div className='w-full grid grid-cols-4 gap-2 mb-2'>  
                <div className='flex flex-col justify-end'>
                    <FilterReactSelect 
                        placeholder="Cari Permohonan"
                        options={dataApp?.applications?.map(item => ({label: item.kodePermohonan, value: item.id}))} 
                        isLoading={isLoadingApp} 
                        setValue={setAppFilter} 
                    />
                </div>
            </div>
            <div className='h-[550px]'>
                <CustomDataGrid
                    data={data?.data}
                    isLoading={isLoading}
                    rowCount={data?.total || 0}
                    columns={columns}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    page={page}
                    setPage={setPage}
                />
            </div>
        </div>
        
    )
}