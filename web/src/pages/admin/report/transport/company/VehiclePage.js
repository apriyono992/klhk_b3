import React, { useMemo, useState } from 'react'
import { Button, Card, CardBody, CardHeader, Divider, RadioGroup, ScrollShadow, Spinner, Chip } from '@nextui-org/react'
import { useParams } from 'react-router-dom'
import CustomDataGrid from '../../../../../components/elements/CustomDataGrid'
import RootAdmin from '../../../../../components/layouts/RootAdmin'
import useSWR from 'swr'
import { getFetcher, postFetcher } from '../../../../../services/api'
import { ArrowPathIcon, EyeIcon } from '@heroicons/react/24/outline'
import useCustomNavigate from '../../../../../hooks/useCustomNavigate'
import RadioVehicleButton from '../../../../../components/fragments/admin/report/transport/RadioVehicleButton'
import { month } from '../../../../../services/enum'
import ButtonModalAlert from '../../../../../components/elements/ButtonModalAlert'
import toast from 'react-hot-toast';
import IsValidIcon from '../../../../../components/elements/isValidIcon'

export default function VehiclePage() {
    const { applicationId, periodId } = useParams()
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const { getReportTransportVehicleDetail } = useCustomNavigate() 
    const [selectedVehicle, setSelectedVehicle] = useState(undefined)
    const { data, isLoading, } = useSWR(`/api/rekom/permohonan/${applicationId}`, getFetcher)
    const { data: dataReport, isLoading: isLoadingReport, mutate } = useSWR(selectedVehicle? `/api/pelaporan-pengangkutan/search?page=${page + 1}&limit=${pageSize}&vehicleIds=${selectedVehicle}` : null, getFetcher)
    
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
                    <Button onPress={() => getReportTransportVehicleDetail(params.row.id) } size='sm' color='success' isIconOnly><EyeIcon className='size-4'/></Button>
                </div>
            ),
            sortable: false,
            filterable: false
        },

    ], []);

    async function onSubmitFinalize(companyId, periodId, applicationId) {
        if (!companyId || !periodId || !applicationId) {
            toast.error("Perusahaan dan Periode harus dipilih sebelum finalisasi.");
            return;
        }
    
        try {
            await postFetcher(`/api/pelaporan-pengangkutan/finalize/${companyId}/${periodId}/${applicationId}`);
            toast.success("Laporan berhasil difinalisasi.");
            mutate(); // Refresh data setelah finalisasi
        } catch (error) {
            toast.error( "Terjadi kesalahan saat finalisasi. " + error?.response?.data?.message || "Terjadi kessalahan saat finalisasi.");
        }
    }

    return (
        <RootAdmin>
            <div className='grid grid-cols-3 gap-3 mt-3'>
                <Card radius='sm' className='col-span-3 md:col-span-1 h-[550px]'>
                    <CardHeader>
                        Kendaraan
                        <ButtonModalAlert
                            buttonTitle={
                                <>
                                    <ArrowPathIcon className="size-4" /> Finalisasi Laporan
                                </>
                            }
                            buttonColor="warning"
                            modalIcon="warning"
                            modalHeading="Apakah anda yakin?"
                            modalDescription="Pastikan laporan sudah sesuai dan lengkap"
                            buttonSubmitText="Submit"
                            buttonCancelText="Batal"
                            onSubmit={() => onSubmitFinalize(data.companyId, periodId, applicationId)} // Gunakan fungsi anonim
                            // isDisabled={!selectedCompany || !selectedPeriod} // Disable jika salah satu kosong
                        />
                    </CardHeader>
                    <Divider/>
                    <CardBody className='w-full p-3 space-y-3'>
                        <ScrollShadow hideScrollBar className='h-full'>
                            {
                                isLoading
                                ?
                                <Spinner className='mx-auto'/>
                                :
                                <RadioGroup
                                    value={selectedVehicle}
                                    onValueChange={setSelectedVehicle}
                                >
                                    {data?.vehicles?.map((item) => (
                                        <RadioVehicleButton key={item?.vehicleId} value={item?.vehicleId} description={item?.vehicle} />
                                    ))}
                                </RadioGroup>

                            }
                        </ScrollShadow>
                    </CardBody>
                </Card>
                <Card radius='sm' className='col-span-3 md:col-span-2 h-[550px]'>
                    <CardHeader>
                        Riwayat
                    </CardHeader>
                    <Divider/>
                    <CardBody>
                        <CustomDataGrid
                            data={dataReport?.data}
                            rowCount={dataReport?.total || 0}
                            isLoading={isLoadingReport}
                            columns={columns}
                            pageSize={pageSize}
                            setPageSize={setPageSize}
                            page={page}
                            setPage={setPage}
                            initialState={{
                                sorting: {
                                    sortModel: [{ field: 'nama', sort: 'asc' }],
                                },
                            }}
                        />
                    </CardBody>
                </Card>
            </div>
        </RootAdmin>
    )
}