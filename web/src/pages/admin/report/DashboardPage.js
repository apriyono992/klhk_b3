import { Button, Card, CardBody, CardHeader, Tabs, Tab, Chip, Select, SelectItem, Spinner } from "@nextui-org/react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import useSWR from "swr";
import { getFetcher } from "../../../services/api";
import RootAdmin from "../../../components/layouts/RootAdmin";
import CustomDataGrid from "../../../components/elements/CustomDataGrid";
import { useMemo, useState, useEffect } from "react";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
import RolesAccess from "../../../enums/roles";
import FilterReactSelect from "../../../components/elements/FilterReactSelect";
import { month } from "../../../services/enum";

export default function DashboardPage() {
    const { user, roles } = useAuth();
    const isSuperAdmin = roles.includes(RolesAccess.SUPER_ADMIN);
    const { data: dataCompany, isLoading: isLoadingCompany } = useSWR(`/api/company/search-company?returnAll=true${isSuperAdmin ? '' : `&companyIds=${user.companies.map((company) => company.companyId).join(",")}`}`, getFetcher);
    const { data: dataPeriod, isLoading:  isLoadingPeriod } = useSWR(`/api/period/all`, getFetcher);
    // const { data: Test, isLoading: isLoadingTest } = useSWR(`/api/company/reports-status?returnAll=true&periodId=ec4277b6-706b-4a9f-bcbf-51456fbe5d55`, getFetcher);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [isReported, setIsReported] = useState('1');
    const [company, setCompany] = useState(null);
    const [period, setPeriod] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("reportedCompanies"); // Tambahkan state untuk tab aktif

    // Reset page saat tab berubah
    useEffect(() => {
        setPage(0);
    }, [activeTab]);

    const queryString = useMemo(() => {
        const params = new URLSearchParams({
            page: page + 1,
            limit: pageSize,
            isReported: isReported === '1' ? true : false,
        });
        if (!isSuperAdmin) {
            params.append('companyIds', user.companies.map((company) => company.companyId).join(","))
        } else if (company) {
            params.append('companyIds', `${company},${company}`)
        }
        if (period) params.append('periodId', period);
        return params.toString();
    }, [page, pageSize, company, period, isReported]);

    const queryStringReport = useMemo(() => {
        const params = new URLSearchParams({
            returnAll: true,
        });
        if (!isSuperAdmin && !company) {
            params.append('companyIds', user.companies.map((company) => company.companyId).join(","))
        } else if (company) {
            params.append('companyIds', `${company},${company}`)
        }
        if (period) params.append('periodId', period);
        return params.toString();
    }, [page, pageSize, company, period]);
    
    const { data: reportedCompanies, mutate: mutateReportedCompanies } = useSWR(`api/company/reports-status?${queryStringReport}`, getFetcher);
    const { data: reportedApplications, mutate: mutateReportedApplications } = useSWR(`api/rekom/permohonan/pelaporan/report-status?${queryStringReport}`, getFetcher);
    const { data: reportedRegistrations, mutate: mutateReportedRegistrations } = useSWR(`api/registrasi/pelaporan/report-status?${queryStringReport}`, getFetcher);

    const columns = useMemo(() => [
        {
            field: 'nomorSurat',
            headerName: 'Nomor Surat',
            renderCell: (params) => <span>{params?.row?.applicationName || '-'}</span>,
        },
        {
            field: 'applicationName',
            headerName: 'Kode Permohonan',
            renderCell: (params) => <span>{params?.row?.applicationName || '-'}</span>,
        },
        {
            field: 'companyName',
            headerName: 'Nama Perusahaan',
            renderCell: (params) => <span>{params?.row?.companyName || '-'}</span>,
        },
        {
            field: 'bulan',
            headerName: 'Bulan',
            renderCell: (params) => <span>{month[params?.row?.bulan] || '-'}</span>,
  
        },
        {
            field: 'tahun',
            headerName: 'Tahun',
            renderCell: (params) => <span>{params?.row?.tahun || '-'}</span>,
  
        },
        {
            field: 'status',
            headerName: 'Status',
            renderCell: (params) => {
                const status = params.row.sudahDilaporkan ? 'Sudah' : 'Belum';
                return (
                    <Chip
                        color={status === 'Sudah' ? 'success' : 'danger'}
                        variant="flat"
                        size="sm"
                    >
                        {status}
                    </Chip>
                );
            }    
        },
    ], []);

    const columnsPerusahaan = useMemo(() => [
        {
            field: 'companyName',
            headerName: 'Nama Perusahaan',
            renderCell: (params) => <span>{params?.row?.companyName || '-'}</span>,
        },
        {
            field: 'tipePerusahaan',
            headerName: 'Tipe Perusahaan',
            renderCell: (params) => <span>{params?.row?.tipePerusahaan?.join(', ') || '-'}</span>,
  
        },
        {
            field: 'jenisLaporan',
            headerName: 'Jenis Laporan',
            renderCell: (params) => <span>{params?.row?.jenisLaporan || '-'}</span>,
  
        },
        {
            field: 'bulan',
            headerName: 'Bulan',
            renderCell: (params) => <span>{month[params?.row?.bulan] || '-'}</span>,
  
        },
        {
            field: 'tahun',
            headerName: 'Tahun',
            renderCell: (params) => <span>{params?.row?.tahun || '-'}</span>,
  
        },
        {
            field: 'status',
            headerName: 'Status',
            renderCell: (params) => {
                const status = params.row.sudahDilaporkan ? 'Sudah' : 'Belum'; // Mengambil nilai dari params.value
                return (
                    <Chip
                    color={status === 'Sudah' ? 'success' : 'danger'}
                    variant="flat"
                    size="sm"
                >
                    {status}
                </Chip>
                );
            }    
        },
    ], []);


    async function handleRefresh() {
        try {
            setLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            mutateReportedCompanies();
            mutateReportedApplications();
            mutateReportedRegistrations();
        } catch {
            toast.error('Gagal muat ulang data');
        } finally {
            setLoading(false);
        }
    };

    // Di dalam komponen utama (misalnya DashboardPage)
    const paginatedReportedCompanies = useMemo(() => {
        if (!reportedCompanies?.data) return [];
        const startIndex = page * pageSize;
        const endIndex = startIndex + pageSize;
        return reportedCompanies.data.slice(startIndex, endIndex);
    }, [reportedCompanies?.data, page, pageSize]);
    
    const paginatedReportedApplications = useMemo(() => {
        if (!reportedApplications?.data) return [];
        const startIndex = page * pageSize;
        const endIndex = startIndex + pageSize;
        return reportedApplications.data.slice(startIndex, endIndex);
    }, [reportedApplications?.data, page, pageSize]);
    
    const paginatedReportedRegistrations = useMemo(() => {
        if (!reportedRegistrations?.data) return [];
        const startIndex = page * pageSize;
        const endIndex = startIndex + pageSize;
        return reportedRegistrations.data.slice(startIndex, endIndex);
    }, [reportedRegistrations?.data, page, pageSize]);

    const handleTabChange = (tabValue) => {
        setActiveTab(tabValue); // Perbarui tab aktif
    };

    return (
        <RootAdmin>
            <Card className="w-full" radius="sm">
                <CardHeader className="flex justify-between items-center">
                    <p className="text-md">Dashboard Pelaporan B3</p>
                    <div className="flex gap-2">
                        <Button 
                            size="sm" 
                            color="primary" 
                            startContent={
                                loading ? <Spinner color="default" size="sm" /> :
                                <ArrowPathIcon className="size-4" color="default" />
                            } 
                            onPress={handleRefresh}
                        >
                            Muat Ulang
                        </Button>
                    </div>
                </CardHeader>
                <CardBody>
                    <Filter
                        isReported={isReported}
                        setIsReported={setIsReported}
                        dataPeriod={dataPeriod}
                        isLoadingPeriod={isLoadingPeriod}
                        setPeriod={setPeriod}
                        dataCompany={dataCompany}
                        isLoadingCompany={isLoadingCompany}
                        setCompany={setCompany}
                    />
                    <Tabs 
                        color="primary"
                        variant="underlined"
                        aria-label="tabs"
                        onSelectionChange={handleTabChange} // Panggil handler saat tab berubah
                        classNames={{
                            tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                            cursor: "w-full",
                            tab: "max-w-fit px-1.5 h-12",
                            tabContent: "group-data-[selected=true]:font-semibold"
                        }}
                    >
                        <Tab title="Perusahaan" value="reportedCompanies">
                            <div className="h-[500px]">
                                <CustomDataGrid
                                   data={paginatedReportedCompanies}
                                   rowCount={reportedCompanies?.data?.length || 0}
                                   columns={columnsPerusahaan}
                                   pageSize={pageSize}
                                   setPageSize={setPageSize}
                                   page={page}
                                   setPage={setPage}
                                />
                            </div>
                        </Tab>
                        <Tab title="Rekomendasi" value="reportedApplications">
                            <div className="h-[500px]">
                                <CustomDataGrid
                                    data={paginatedReportedApplications}
                                    rowCount={reportedApplications?.data?.length || 0}
                                    columns={columns}
                                    pageSize={pageSize}
                                    setPageSize={setPageSize}
                                    page={page}
                                    setPage={setPage}
                                />
                            </div>
                        </Tab>
                        <Tab title="Registrasi" value="reportedRegistrations">
                            <div className="h-[500px]">
                                <CustomDataGrid
                                    data={paginatedReportedRegistrations}
                                    rowCount={reportedRegistrations?.data?.length || 0}
                                    columns={columns}
                                    pageSize={pageSize}
                                    setPageSize={setPageSize}
                                    page={page}
                                    setPage={setPage}
                                />
                            </div>
                        </Tab>
                    </Tabs>
                </CardBody>
            </Card>
        </RootAdmin>
    );
}

function Filter({ isReported, setIsReported, dataPeriod, isLoadingPeriod,setPeriod, dataCompany, isLoadingCompany, setCompany }) {
    console.log(dataPeriod);
    
    return(
        <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center">
                <span>Filter:</span>
            </div>
            <div className="w-1/4">
                <FilterReactSelect options={dataCompany?.data?.map(item => ({label: item.name, value: item.id}))} setValue={setCompany} placeholder="Pilih Perusahaan" isLoading={isLoadingCompany} />
            </div>
            <div className="w-1/4">
                <FilterReactSelect options={dataPeriod?.map(item => ({label: item.name, value: item.id}))} setValue={setPeriod} placeholder="Pilih Periode" isLoading={isLoadingPeriod} />
            </div>
            <Select
                variant="underlined"
                label=""
                placeholder="Pilih..."
                selectedKeys={isReported}
                className="w-1/4"
                onChange={(e) => setIsReported(e.target.value)}
            >
                <SelectItem key="1">Sudah Lapor</SelectItem>
                <SelectItem key="0">Belum Lapor</SelectItem>
            </Select>
        </div>
    )
}
