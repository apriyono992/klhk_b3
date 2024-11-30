import useSWR from "swr";
import useCustomNavigate from "../../../../../hooks/useCustomNavigate";
import { getFetcher } from "../../../../../services/api";
import { useMemo, useState } from "react";
import { month } from "../../../../../services/enum";
import IsValidIcon from "../../../../elements/isValidIcon";
import FilterReactSelect from "../../../../elements/FilterReactSelect";
import CustomDataGrid from "../../../../elements/CustomDataGrid";
import { Button } from "@nextui-org/react";
import { EyeIcon } from "@heroicons/react/24/outline";

export default function AdminTableHistory() {
    const api = '/api/pelaporan-pengangkutan/search'
    const { getReportTransportVehicleDetail, getAdminReportTransportVehicleDetail } = useCustomNavigate();
    const { data: dataPeriod, isLoading: isLoadingPeriod } = useSWR(`/api/period/all`, getFetcher);
    const { data: dataApp, isLoading: isLoadingApp } = useSWR(`/api/rekom/permohonan/search`, getFetcher);    
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [periodFilter, setPeriodFilter] = useState('');
    const [appFilter, setAppFilter] = useState('');
    const { data, isLoading } = useSWR(`${api}?page=${page + 1}&limit=${pageSize}
                                                ${appFilter ? `&applicationId=${appFilter}` : ''}
                                                ${periodFilter ? `&periodId=${periodFilter}` : ''}`, getFetcher);

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
        },
        {
            field: 'vehicle',
            headerName: 'Kendaraan',
            valueGetter: (value, row) => `${row.vehicle.modelKendaraan} - ${row.vehicle.noPolisi}`,
        },
        {
            field: 'bahanB3',
            headerName: 'Bahan B3',
        },
        {
            field: 'isApproved',
            headerName: 'Status',
            renderCell: (params) => (
                <div className="mt-1">
                    <IsValidIcon value={params.row.isApproved} validMessage="Disetujui" invalidMessage="Tidak Disetujui" />
                </div>
            ),
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
            field: 'action',
            headerName: 'Aksi',
            renderCell: (params) => (
                <div className="flex items-center gap-1">
                    <Button onPress={() => getAdminReportTransportVehicleDetail(params.row.id) } size='sm' color='success' isIconOnly><EyeIcon className='size-4'/></Button>
                </div>
            ),
            sortable: false,
            filterable: false
        },

    ], [getReportTransportVehicleDetail]);
    
    return(
        <div className="h-[550px]">
            <div className='w-full grid grid-cols-4 gap-2 mb-2'>  
                <div className='flex flex-col justify-end'>
                    <FilterReactSelect 
                        placeholder="Cari Periode"
                        options={dataPeriod?.map(item => ({label: item.name, value: item.id}))} 
                        isLoading={isLoadingPeriod} 
                        setValue={setPeriodFilter} 
                    />
                </div>
                <div className='flex flex-col justify-end'>
                    <FilterReactSelect 
                        placeholder="Cari Permohonan"
                        options={dataApp?.applications?.map(item => ({label: item.kodePermohonan, value: item.id}))} 
                        isLoading={isLoadingApp} 
                        setValue={setAppFilter} 
                    />
                </div>
            </div>
            <CustomDataGrid
                data={data?.data || data?.applications}
                rowCount={data?.total || 0}
                isLoading={isLoading}
                columns={columns}
                pageSize={pageSize}
                setPageSize={setPageSize}
                page={page}
                setPage={setPage}
            />
        </div>
    )
}