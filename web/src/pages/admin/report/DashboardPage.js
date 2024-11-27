import { Button, Card, CardBody, CardHeader, Tabs, Tab, Chip, Select, SelectItem, Spinner } from "@nextui-org/react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import useSWR from "swr";
import { getFetcher } from "../../../services/api";
import RootAdmin from "../../../components/layouts/RootAdmin";
import CustomDataGrid from "../../../components/elements/CustomDataGrid";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
import RolesAccess from "../../../enums/roles";
import FilterReactSelect from "../../../components/elements/FilterReactSelect";

export default function DashboardPage() {
    const { user, roles } = useAuth();
    const isSuperAdmin = roles.includes(RolesAccess.SUPER_ADMIN);
    const { data: dataCompany, isLoading: isLoadingCompany } = useSWR(`/api/company/search-company?returnAll=true${isSuperAdmin ? '' : `&companyIds=${user.companies.map((company) => company.id).join(",")}`}`, getFetcher);
    const { data: dataPeriod, isLoading: isLoadingPeriod } = useSWR(`/api/period/all`, getFetcher);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [isReported, setIsReported] = useState('1');
    const [company, setCompany] = useState(null);
    const [period, setPeriod] = useState(null);
    const [loading, setLoading] = useState(false);

    const queryString = useMemo(() => {
        const params = new URLSearchParams({
            page: page + 1,
            limit: pageSize,
            isReported: isReported === '1' ? true : false,
        });
        if (!isSuperAdmin) {
            params.append('companyIds', user.companies.map((company) => company.id).join(","))
        } else if (company) {
            params.append('companyIds', `${company},${company}`)
        }
        if (period) params.append('periodId', period);
        return params.toString();
    }, [page, pageSize, company, period, isReported]);
    
    const { data: reportedCompanies, mutate: mutateReportedCompanies } = useSWR(`/api/period/search/companies?${queryString}`, getFetcher);
    const { data: reportedApplications, mutate: mutateReportedApplications } = useSWR(`/api/period/search/applications?${queryString}`, getFetcher);
    const { data: reportedRegistrations, mutate: mutateReportedRegistrations } = useSWR(`/api/period/search/registrations?${queryString}`, getFetcher);

    const columns = useMemo(() => [
        {
            field: 'companyName',
            headerName: 'Nama Perusahaan',
            renderCell: (params) => <span>{params?.row?.company?.name || '-'}</span>,
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
            renderCell: (params) => <span>{params?.row?.company?.name || '-'}</span>,
        },
        {
            field: 'jenisLaporan',
            headerName: 'Jenis Laporan',
            renderCell: (params) => <span>{params?.row?.jenisLaporan || '-'}</span>,
  
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
                                    data={reportedCompanies?.data}
                                    rowCount={reportedCompanies?.total || 0}
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
                                    data={reportedApplications?.data}
                                    rowCount={reportedApplications?.total || 0}
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
                                    data={reportedRegistrations?.data}
                                    rowCount={reportedRegistrations?.total || 0}
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
