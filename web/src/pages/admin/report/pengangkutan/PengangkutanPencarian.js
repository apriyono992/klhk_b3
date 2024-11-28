import { Button, Card, CardBody, CardHeader, Divider, Tabs, Tab, Chip } from "@nextui-org/react";
import { EyeIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import useSWR from "swr";
import { getFetcher } from "../../../../services/api";
import RootAdmin from "../../../../components/layouts/RootAdmin";
import useCustomNavigate from "../../../../hooks/useCustomNavigate";
import CustomDataGrid from "../../../../components/elements/CustomDataGrid";
import { useMemo, useState } from "react";

export default function PengangkutanPencarian() {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const { getAdminStorageDetailPath } = useCustomNavigate();

    // Opsi SWR tanpa fetch otomatis
    const swrOptions = {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale: false,
        revalidateOnMount: false,
        dedupingInterval: 60000,
        suspense: false,
        fallbackData: null,
    };

    // Fetch data perusahaan yang sudah dan belum melaporkan
    const { data: reportedCompanies, mutate: mutateReportedCompanies } = useSWR(
        '/api/period/search/companies?isReported=true',
        getFetcher,
        swrOptions
    );

    const { data: unreportedCompanies, mutate: mutateUnreportedCompanies } = useSWR(
        '/api/period/search/companies?isReported=false',
        getFetcher,
        swrOptions
    );

    // Fetch data aplikasi yang sudah dan belum melaporkan
    const { data: reportedApplications, mutate: mutateReportedApplications } = useSWR(
        '/api/period/search/applications?isReported=true',
        getFetcher,
        swrOptions
    );

    const { data: unreportedApplications, mutate: mutateUnreportedApplications } = useSWR(
        '/api/period/search/applications?isReported=false',
        getFetcher,
        swrOptions
    );

    // Fetch data registrasi yang sudah dan belum melaporkan
    const { data: reportedRegistrations, mutate: mutateReportedRegistrations } = useSWR(
        '/api/period/search/registrations?isReported=true',
        getFetcher,
        swrOptions
    );

    const { data: unreportedRegistrations, mutate: mutateUnreportedRegistrations } = useSWR(
        '/api/period/search/registrations?isReported=false',
        getFetcher,
        swrOptions
    );

    // Kolom untuk tabel
    const columnsPerusahaan = useMemo(() => [
        {
            field: 'companyName',
            headerName: 'Nama Perusahaan',
            flex: 1,
            renderCell: (params) => <span>{params?.row?.company?.name || '-'}</span>,
        },
        {
            field: 'jenisLaporan',
            headerName: 'Jenis Laporan',
            flex: 1,
            renderCell: (params) => <span>{params?.row?.jenisLaporan || '-'}</span>,

        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
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
        {
            field: 'action',
            headerName: 'Aksi',
            renderCell: (params) => (
                <Button size='sm' onPress={() => getAdminStorageDetailPath(params?.row?.id)} color='primary' isIconOnly>
                    <EyeIcon className='size-4' />
                </Button>
            ),
            sortable: false,
            filterable: false,
        },
    ], []);


    // Fungsi untuk refresh data
    const handleRefresh = () => {
        mutateReportedCompanies();
        mutateUnreportedCompanies();
        mutateReportedApplications();
        mutateUnreportedApplications();
        mutateReportedRegistrations();
        mutateUnreportedRegistrations();
    };

    // Fungsi untuk mendapatkan data pertama kali
    const handleGetData = () => {
        mutateReportedCompanies();
        mutateUnreportedCompanies();
        mutateReportedApplications();
        mutateUnreportedApplications();
        mutateReportedRegistrations();
        mutateUnreportedRegistrations();
    };

    return (
        <RootAdmin>
            <Card className="w-full" radius="sm">
                <CardHeader className="flex justify-between items-center">
                    <p className="text-md">Dashboard Pencarian Pelaporan Pengangkutan B3</p>
                    <div className="flex gap-2">
                        <Button size="sm" color="primary" onPress={handleGetData}>
                            Get Data
                        </Button>
                        <Button size="sm" color="secondary" startContent={<ArrowPathIcon className="size-4" />} onPress={handleRefresh}>
                            Refresh
                        </Button>
                    </div>
                </CardHeader>
                <Divider />
                <CardBody className="w-full h-[550px] p-5">
                    <Tabs aria-label="Pelaporan Pencarian B3" defaultValue="reportedCompanies">
                        <Tab title="Pelaporan Bedasarkan Jenis B3" value="reportedCompanies">
                            <CustomDataGrid
                                data={reportedCompanies?.data || []}
                                rowCount={reportedCompanies?.total || 0}
                                columns={columnsPerusahaan}
                                pageSize={pageSize}
                                setPageSize={setPageSize}
                                page={page}
                                setPage={setPage}
                            />
                        </Tab>
                        <Tab title="Pelaporan Bedasarkan Perusahaan" value="unreportedCompanies">
                            <CustomDataGrid
                                data={unreportedCompanies?.data || []}
                                rowCount={unreportedCompanies?.total || 0}
                                columns={columnsPerusahaan}
                                pageSize={pageSize}
                                setPageSize={setPageSize}
                                page={page}
                                setPage={setPage}
                            />
                        </Tab>
                    </Tabs>
                </CardBody>
            </Card>
        </RootAdmin>
    );
}
