import { Button, Card, CardBody, Checkbox, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tab, Tabs, Chip } from '@nextui-org/react';
import { useMemo, useState } from 'react'
import RootAdmin from '../../../../../components/layouts/RootAdmin';
import TableHistory from '../../../../../components/fragments/admin/report/TableHistory';
import useSWR from 'swr';
import { getFetcher } from '../../../../../services/api';
import CustomDataGrid from '../../../../../components/elements/CustomDataGrid';
import ModalCompanyNotReport from '../../../../../components/fragments/admin/report/ModalCompanyNotReport';
import useValidateDistribution from '../../../../../hooks/report/distribution/useValidateDistribution';
import { month } from '../../../../../services/enum';
import IsValidIcon from '../../../../../components/elements/isValidIcon';
import useCustomNavigate from '../../../../../hooks/useCustomNavigate';
import { EyeIcon } from '@heroicons/react/24/outline';

export default function IndexPage() {
    const api = '/api/pelaporan-bahan-b3-distribusi';
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const { getAdminReportDistributionDetail } = useCustomNavigate();
    const { data: dataPeriod } = useSWR(`/api/period/active`, getFetcher);
    const { data, isLoading } = useSWR(dataPeriod ? `${api}/search?page=${page + 1}&limit=${pageSize}&periodId=${dataPeriod?.id}` : null, getFetcher);
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
                    case 'Menunggu Persetujuan ':
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
                <div className="flex mt-1">
                    <IsValidIcon value={params.row.isFinalized} validMessage="Sudah" invalidMessage="Belum" />
                </div>
            ),
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
                    <Button onPress={() => getAdminReportDistributionDetail(params.row.id)} size='sm' color='success' isIconOnly><EyeIcon className='size-4'/></Button>
                </div>
            ),
            sortable: false,
            filterable: false
        },
    ], [getAdminReportDistributionDetail]);

    return(
        <RootAdmin>
            <Card radius='sm'>
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
                            <ModalCompanyNotReport api={api} />
                            <div className='h-[500px]'>
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
                            <TableHistory columns={columnsTableHistory} api={`${api}/search`} />
                        </Tab>
                    </Tabs>
                </CardBody>
            </Card>
        </RootAdmin>
    )
}
