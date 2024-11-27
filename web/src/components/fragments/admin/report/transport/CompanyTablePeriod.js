import { useMemo, useState } from 'react'
import RootAdmin from '../../../../../components/layouts/RootAdmin'
import { Button, Card, CardBody, CardHeader, Divider, ScrollShadow, } from '@nextui-org/react'
import { getFetcher, postFetcher, getSelectFetcher } from '../../../../../services/api';
import useSWR from 'swr';
import { format } from 'date-fns';
import CustomDataGrid from '../../../../../components/elements/CustomDataGrid';
import useCustomNavigate from '../../../../../hooks/useCustomNavigate';
import { ArrowUpTrayIcon, EyeIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { isResponseErrorObject, isSuperAdminRole } from '../../../../../services/helpers';
import TableFilter from '../../../../elements/TableFilter';
import { id } from 'date-fns/locale';  // Import Indonesian locale
import useAuth from '../../../../../hooks/useAuth';
import ReactSelect from '../../../../elements/ReactSelect';

export default function CompanyTablePeriod() {
    const {user, roles} = useAuth();
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [isSubmit , setIsSubmit] = useState(false);
    const { getReportTransportVehicle } = useCustomNavigate();
    const [availableMonths, setAvailableMonths] = useState([]);
    const [availableYears, setAvailableYears] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null); // Perusahaan yang dipilih
    const [selectedPeriod, setSelectedPeriod] = useState(null); // Periode yang dipilih
    const isSuperAdmin = isSuperAdminRole(roles); // Cek apakah user adalah Super Admin
    const { data: dataPeriod } = useSWR(`/api/period/report-actives`, getFetcher);
    // const { data, isLoading } = useSWR(dataPeriod ? `/api/rekom/permohonan/search?page=${page + 1}&limit=${pageSize}` : null, getFetcher);
    const { data, isLoading, mutate } = useSWR(
        `/api/rekom/permohonan/search?returnAll=true${
            selectedCompany ? `&companyId=${selectedCompany}` : ''
        }`,
        getFetcher
    );
    const { data: dataCompany, isLoading: isLoadingCompany } = useSWR(
        isSuperAdmin
            ? `/api/company/search-company` // Jika Super Admin, fetch semua perusahaan
            : `/api/company/search-company?ids=${user.companies?.map((company) => company.id).join(",")}`, // Jika bukan Super Admin, fetch perusahaan sesuai IDs
        getSelectFetcher
    );
    const periodOptions = dataPeriod?.data?.map((item) => ({ value: item.id, label: item.name }));
    

    async function onClickReportCreate(params) {
        setIsSubmit(true);
        try {
            const data = {
                applicationId: params.row.id,
                companyId: params.row.companyId,
                periodId: selectedPeriod
            }
            await postFetcher('/api/pelaporan-pengangkutan', selectedPeriod);
            toast.success('Laporan pengangkutan berhasil dibuat!');
            getReportTransportVehicle(params.row.id, selectedPeriod);
        } catch (error) {
            isResponseErrorObject(error.response.data.message)
                ? Object.entries(error.response.data.message).forEach(([key, value]) => {
                    toast.error(value);
                })
                : toast.error(error.response.data.message)
        } finally {
            setIsSubmit(false);
        }
    }

    const columns = useMemo(() =>  [
        {
            field: 'kodePermohonan',
            headerName: 'Kode Permohonan',
        },
        {
            field: 'companyName',
            headerName: 'Nama Perusahaan',
            valueGetter: (value, row) => row.company.name,
        },
        {
            field: 'totalKendaraan',
            headerName: 'Total Kendaraan',
            valueGetter: (value, row) => row.vehicles.length,
        },
        {
            field: 'jenisPermohonan',
            headerName: 'Jenis Permohonan',
        },
        {
            field: 'tipeSurat',
            headerName: 'Tipe Surat',
        },
        {
            field: 'tanggalPengajuan',
            headerName: 'Tanggal Pengajuan',
            valueGetter: (value, row) => format(row.tanggalPengajuan, 'PPP', { locale: id }),
        },
        {
            field: 'tanggalDisetujui',
            headerName: 'Tanggal Disetujui',
            valueGetter: (value, row) => format(row.tanggalDisetujui, 'PPP', { locale: id }),
        },
        {
            field: 'tanggalBerakhir',
            headerName: 'Tanggal Berakhir',
            valueGetter: (value, row) => format(row.tanggalBerakhir, 'PPP', { locale: id }),
        },
        
        {
            field: 'action',
            headerName: 'Aksi',
            renderCell: (params) => (
                <div className="flex items-center gap-1">
                    <Button isDisabled={isSubmit} isLoading={isSubmit} isIconOnly size='sm' color='success' onPress={() => onClickReportCreate(params)} ><ArrowUpTrayIcon className='size-4'/></Button>
                    <Button isIconOnly size='sm' color='success' onPress={() => getReportTransportVehicle(params.row.id, selectedPeriod)} ><EyeIcon className='size-4'/></Button>
                </div>
            ),
            sortable: false,
            filterable: false
        },
    ], [onClickReportCreate, getReportTransportVehicle]);

    return (
        <div className='h-[550px]'>
            <div className="flex gap-2 mb-5">
            <ReactSelect
                data={isLoadingCompany || !dataCompany ? [] : dataCompany}
                isLoading={isLoadingCompany} // Status loading
                value={dataCompany && Array.isArray(dataCompany) 
                    ? dataCompany.find((item) => item.value === selectedCompany) 
                    : null} // Cek apakah dataCompany adalah array
                onChange={(option) => {
                    setSelectedCompany(option?.value || null); // Perbarui state perusahaan
                }}
                label="Perusahaan"
                isMulti={false} // Single select
            />
             <ReactSelect
                data={periodOptions || []} // Default ke array kosong jika tidak ada data
                isLoading={!periodOptions?.length} // Status loading
                value={periodOptions?.find((item) => item.value === selectedPeriod) || null} // Nilai yang dipilih
                onChange={(option) => {
                    setSelectedPeriod(option?.value || null); // Perbarui state periode
                    console.log('Selected Period:', option?.value); // Debug log
                }}
                label="Periode"
                isMulti={false} // Single select
            />
            </div>
            <CustomDataGrid
                data={data?.applications}
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