import { Button, Card, CardBody, CardHeader, Divider, Tabs, Tab, Chip } from "@nextui-org/react";
import { EyeIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import useSWR from "swr";
import { postFetcher } from "../../../../../services/api";
import RootAdmin from "../../../../../components/layouts/RootAdmin";
import useCustomNavigate from "../../../../../hooks/useCustomNavigate";
import CustomDataGrid from "../../../../../components/elements/CustomDataGrid";
import { useMemo, useState } from "react";

export default function IndexPage() {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const { getAdminStorageDetailPath } = useCustomNavigate();

    const getStatusColor = (status) => {
        switch (status) {
          case 'Pending':
            return 'warning';
          case 'Menunggu Verifikasi':
            return 'info';
          case 'Review by Admin':
            return 'primary';
          case 'Approved':
            return 'success';
          case 'Rejected':
            return 'error';
          case 'Delete':
            return 'default';
          default:
            return 'default';
        }
    };

    // Opsi SWR untuk mengurangi frekuensi fetch
    const swrOptions = {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        dedupingInterval: 60000, // 60 detik
    };

    // Fetch data penyimpanan yang perlu divalidasi (Review by Admin atau Pending)
    const { data: dataToValidate, isLoading: isLoadingToValidate, mutate: mutateToValidate } = useSWR(
        '/api/penyimpananB3/search?status=Review%20by%20Admin&status=Pending',
        postFetcher,
        swrOptions
    );

    // Fetch data penyimpanan yang sudah disetujui
    const { data: dataApproved, isLoading: isLoadingApproved, mutate: mutateApproved } = useSWR(
        '/api/penyimpananB3/search?status=Approved&status=Rejected',
        postFetcher,
        swrOptions
    );


    console.log(dataToValidate, dataApproved);

    // Fungsi untuk refresh data
    const handleRefresh = () => {
        mutateToValidate();
        mutateApproved();
    };

    // Menghitung progress durasi
    const calculateProgressDuration = (history, isApproved) => {
        // Cek apakah history ada dan memiliki data
        if (!history || history.length === 0) return '-';
    
        // Temukan tanggal pengajuan awal
        const start = history.PenyimpananB3History.find(item => 
         item.statusPengajuan === 'Pending'
        )?.tanggalPengajuan ?? history.createdAt;
    
        // Tentukan tanggal akhir (tanggal penyelesaian jika disetujui, atau saat ini jika belum disetujui)
        const end = isApproved
            ? history.PenyimpananB3History.find(item => 
                item.statusPengajuan === 'Approved' || item.statusPengajuan === 'Rejected'
            )?.tanggalPenyelesaian
            : Date.now();
    
        // Jika tanggal pengajuan awal tidak ditemukan, kembalikan '-'
        if (!start) return '-';
    
        // Konversi tanggal ke timestamp (milidetik)
        const startDate = new Date(start).getTime();
        const endDate = isApproved ? new Date(end).getTime() : end;
    
        // Jika parsing tanggal gagal (hasilnya NaN), kembalikan '-'
        if (isNaN(startDate) || isNaN(endDate)) return '-';
    
        // Hitung durasi dalam hari
        const duration = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
    
        // Jika durasi kurang dari 0 (error perhitungan), kembalikan '-'
        return duration >= 0 ? duration : '-';
    };

    // Kolom untuk tabel
    const columns = useMemo(() => [
        {
            field: 'companyName',
            headerName: 'Nama Perusahaan',
            flex: 1,
            renderCell: (params) => {
                return <span>{params?.row?.company?.name || '-'}</span>;
            },
        },
        {
            field: 'locationDetails',
            headerName: 'Detail Lokasi',
            flex: 2,
            valueGetter: (params) => {
                const { province, regency, district, village } = params?.row ?? {};
                return `${village?.name || '-'}, ${district?.name || '-'}, ${regency?.name || '-'}, ${province?.name || '-'}`;
            },
        },
        {
            field: 'alamatGudang',
            headerName: 'Alamat Gudang',
            flex: 2,
        },
        {
            field: 'luasArea',
            headerName: 'Luas Area (M²)',
            flex: 1,
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            renderCell: (params) => {
                const status = params?.row?.status;

                switch (status) {
                    case 'Rejected':
                        return <Chip color="danger" variant="flat" size="sm">{status}</Chip>;
                    case 'Pending':
                        return <Chip color="warning" variant="flat" size="sm">{status}</Chip>;
                    case 'Menunggu Verifikasi':
                        return <Chip color="primary" variant="flat" size="sm">{status}</Chip>;
                    case 'Review by Admin':
                        return <Chip color="secondary" variant="flat" size="sm">{status}</Chip>;
                    case 'Approved':
                        return <Chip color="success" variant="flat" size="sm">{status}</Chip>;
                    case 'Delete':
                        return <Chip color="default" variant="flat" size="sm">{status}</Chip>;
                    default:
                        return <Chip color="default" variant="flat" size="sm">{status}</Chip>;
                }
            },
        },
        {
            field: 'progressDuration',
            headerName: 'Lama Proses',
            flex: 1,
            renderCell: (params) => {
                // Menghitung durasi hari dan mengonversi ke integer
                const hari = parseInt(calculateProgressDuration(params?.row, params?.row?.status === 'Approved'), 10);
            
                // Jika parsing gagal (hasilnya NaN), set nilai hari menjadi '-'
                const hariDisplay = isNaN(hari) ? '-' : `${hari} hari`;
            
                console.log(hari);
            
                // Mengembalikan Chip dengan warna yang sesuai berdasarkan durasi
                if (isNaN(hari)) {
                    return <Chip color="default" variant="flat" size="sm">{hariDisplay}</Chip>;
                } else if (hari < 3) {
                    return <Chip color="success" variant="flat" size="sm">{hariDisplay}</Chip>;
                } else if (hari >= 3 && hari <= 7) {
                    return <Chip color="warning" variant="flat" size="sm">{hariDisplay}</Chip>;
                } else if (hari > 7) {
                    return <Chip color="danger" variant="flat" size="sm">{hariDisplay}</Chip>;
                } else {
                    return <Chip color="default" variant="flat" size="sm">{hariDisplay}</Chip>;
                }
            }            
        },
        {
            field: 'action',
            headerName: 'Aksi',
            renderCell: (params) => (
                <div className="flex items-center gap-1">
                    <Button size='sm' onPress={() => getAdminStorageDetailPath(params?.row?.id)} color='primary' isIconOnly>
                        <EyeIcon className='size-4' />
                    </Button>
                </div>
            ),
            sortable: false,
            filterable: false,
        },
    ], []);

    return (
        <RootAdmin>
            <Card className="w-full" radius="sm">
                <CardHeader className="flex justify-between items-center">
                    <p className="text-md">Daftar Penyimpanan / Gudang B3</p>
                    <Button
                        size="sm"
                        color="primary"
                        startContent={<ArrowPathIcon className="size-4" />}
                        onPress={handleRefresh}
                    >
                        Refresh
                    </Button>
                </CardHeader>
                <Divider />
                <CardBody className="w-full h-[550px] p-5">
                    <Tabs aria-label="Daftar Penyimpanan B3" defaultValue="toValidate">
                        <Tab title="Perlu Divalidasi" value="toValidate">
                            <CustomDataGrid
                                data={dataToValidate?.data || []}
                                rowCount={dataToValidate?.totalRecords || 0}
                                isLoading={isLoadingToValidate}
                                columns={columns}
                                pageSize={pageSize}
                                setPageSize={setPageSize}
                                page={page}
                                setPage={setPage}
                            />
                        </Tab>
                        <Tab title="Sudah Disetujui" value="approved">
                            <CustomDataGrid
                                data={dataApproved?.data || []}
                                rowCount={dataApproved?.totalRecords || 0}
                                isLoading={isLoadingApproved}
                                columns={columns}
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
