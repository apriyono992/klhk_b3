import {Button, Card, CardBody, Tab, Tabs, Chip, Spinner } from "@nextui-org/react";
import RootAdmin from "../../../../../components/layouts/RootAdmin";
import { useMemo, useState } from "react";
import IsValidIcon from "../../../../../components/elements/isValidIcon";
import TableHistory from "../../../../../components/fragments/admin/report/TableHistory";
import { month } from "../../../../../services/enum";
import ButtonModalAlert from "../../../../../components/elements/ButtonModalAlert";
import { ArrowPathIcon, EyeIcon, PencilSquareIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { getFetcher, getSelectFetcher, postFetcher } from "../../../../../services/api";
import useSWR from "swr";
import CustomDataGrid from "../../../../../components/elements/CustomDataGrid";
import { REPORT_DISTRIBUTION_MATERIAL_CREATE } from "../../../../../services/routes";
import useAuth from "../../../../../hooks/useAuth";
import RoleAccess from "../../../../../enums/roles";
import ControlledReactSelect from "../../../../../components/elements/ControlledReactSelect";
import ReactSelect from "../../../../../components/elements/ReactSelect";
import toast from "react-hot-toast";

export default function IndexPage() {
    const api = '/api/pelaporan-bahan-b3-distribusi'
    const { user, roles } = useAuth();
    const navigate = useNavigate();
    const { getCompanyReportDistributionDetail } = useNavigate()
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [availableMonths, setAvailableMonths] = useState([]);
    const [availableYears, setAvailableYears] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null); // Perusahaan yang dipilih
    const [selectedPeriod, setSelectedPeriod] = useState(null); // Periode yang dipilih
    const isSuperAdmin = roles.includes(RoleAccess.SUPER_ADMIN); // Cek apakah user adalah Super Admin
    const { data: dataPeriod } = useSWR(`/api/period/report-actives`, getFetcher);
    const { data, isLoading, mutate } = useSWR(
        `/api/pelaporan-bahan-b3-distribusi/search?returnAll=true${
            selectedCompany ? `&companyId=${selectedCompany}` : ''
        }${selectedPeriod ? `&periodId=${selectedPeriod}` : ''}`,
        getFetcher
    );
    const { data: dataCompany, isLoading: isLoadingCompany } = useSWR(
        isSuperAdmin
            ? `/api/company/search-company` // Jika Super Admin, fetch semua perusahaan
            : `/api/company/search-company?companyIds=${user.companies?.map((company) => company.id).join(",")}`, // Jika bukan Super Admin, fetch perusahaan sesuai IDs
        getSelectFetcher
    );
    const periodOptions = dataPeriod?.data?.map((item) => ({ value: item.id, label: item.name }));
    const columnsTableHistory = useMemo(() =>  [
        {
            field: 'perusahaan',
            headerName: 'Perusahaan',
            valueGetter: (value, row) => row.company.name,
        },
        {
            field: 'jenisb3',
            headerName: 'Jenis B3',
            valueGetter: (value, row) => row.dataBahanB3.namaBahanKimia,
        },
        {
            field: 'jumlahB3Distribusi',
            headerName: 'Jumlah Distribusi',
            valueGetter: (value, row) => `${row.jumlahB3Dihasilkan} KG`,
        },
        {
            field: 'periode',
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
            field: 'tipeProduk',
            headerName: 'Tipe Produk',
        },
        {
            field: 'prosesProduksi',
            headerName: 'Proses Produksi',
        },
        {
            field: 'isApproved',
            headerName: 'Status',
            renderCell: (params) => (<IsValidIcon value={params.row.isApproved} />),
        },
    ], []);
    const columnsTableActivePeriod = useMemo(() =>  [
        {
            field: 'perusahaan',
            headerName: 'Perusahaan',
            valueGetter: (value, row) => row.company.name,
        },
        {
            field: 'jenisb3',
            headerName: 'Jenis B3',
            valueGetter: (value, row) => row.dataBahanB3.namaBahanKimia,
        },
        {
            field: 'jumlahB3Distribusi',
            headerName: 'Jumlah Distribusi',
            valueGetter: (value, row) => `${row.jumlahB3Distribusi} KG`,
        },
        {
            field: 'periode',
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
            field: 'status',
            headerName: 'Status',
            renderCell: (params) => {
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
            field: 'isFinalized',
            headerName: 'Finalisasi',
            renderCell: (params) => (
                <div className="mt-1">
                    <IsValidIcon value={params.row.isFinalized} validMessage="Sudah Finalisasi" invalidMessage="Belum Finalisasi" />
                </div>
            ),
        },
        {
            field: 'action',
            headerName: 'Aksi',
            renderCell: (params) => (
                <div className="flex items-center gap-1">
                    <Button onPress={() => getCompanyReportDistributionDetail(params.row.id)} isIconOnly size='sm' color='success'><EyeIcon className='size-4'/></Button>
                    <Button size='sm' color='warning' isIconOnly><PencilSquareIcon className='size-4'/></Button>
                    <ButtonModalAlert
                        buttonIsIconOnly={true}
                        buttonTitle={<TrashIcon className='size-4' />}
                        buttonColor="danger"
                        modalIcon="danger"
                        modalHeading="Apakah anda yakin?"
                        modalDescription="Laporan tidak bisa dikembalikan"
                        buttonSubmitText="Hapus"
                        buttonCancelText="Batal"
                    />
                </div>
            ),
            sortable: false,
            filterable: false
        },
    ], []);

    async function onSubmitFinalize(companyId, periodId) {
        if (!companyId || !periodId) {
            toast.error("Perusahaan dan Periode harus dipilih sebelum finalisasi.");
            return;
        }
    
        try {
            await postFetcher(`/api/pelaporan-bahan-b3-distribusi/finalize/${companyId}/${periodId}`);
            toast.success("Laporan berhasil difinalisasi.");
            mutate(); // Refresh data setelah finalisasi
        } catch (error) {
            toast.error( "Terjadi kesalahan saat finalisasi. " + error?.response?.data?.message || "Terjadi kessalahan saat finalisasi.");
        }
    }
    if (isLoadingCompany) {
        return (
            <RootAdmin>
                <div className="flex justify-center items-center h-screen">
                    <Spinner size="lg" />
                </div>
            </RootAdmin>
        );
    }

    return(
        <RootAdmin>
            <Card radius="sm">
                <CardBody>
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
                        <Tab key="1" title="Periode Aktif">
                            <div className="h-[550px] mt-3">
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
                                <div className=" flex gap-2 mb-5">
                                    <Button onPress={() => navigate(REPORT_DISTRIBUTION_MATERIAL_CREATE)} size="sm" color="primary" startContent={<PlusIcon className="size-4 stroke-2"/>}>Tambah</Button>
                                    <ButtonModalAlert
                                        buttonTitle={<><ArrowPathIcon className='size-4' /> Finalisasi Laporan</>}
                                        buttonColor="warning"
                                        modalIcon="warning"
                                        modalHeading="Apakah anda yakin?"
                                        modalDescription="Pastikan laporan sudah sesuai dan lengkap"
                                        buttonSubmitText="Submit"
                                        buttonCancelText="Batal"
                                        onSubmit={() => onSubmitFinalize(selectedCompany, selectedPeriod)} // Gunakan fungsi anonim
                                        isDisabled={!selectedCompany || !selectedPeriod} // Disable jika salah satu kosong
                                    />
                                </div>
                                <CustomDataGrid
                                    data={data?.data}
                                    rowCount={data?.total || 0}
                                    isLoading={isLoading}
                                    columns={columnsTableActivePeriod}
                                    pageSize={pageSize}
                                    setPageSize={setPageSize}
                                    page={page}
                                    setPage={setPage}
                                />
                            </div>
                        </Tab>
                        <Tab key="2" title="Riwayat">
                            <TableHistory columns={columnsTableHistory} api={`${api}/search`}/>
                        </Tab>
                    </Tabs>
                </CardBody>
            </Card>
        </RootAdmin>
    )
}
