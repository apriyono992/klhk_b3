import RootAdmin from '../../../components/layouts/RootAdmin';
import { Button, Card, CardBody, CardHeader, Chip, Divider, Tab, Tabs } from '@nextui-org/react';
import { EyeIcon } from '@heroicons/react/24/outline';
import { getFetcher } from '../../../services/api';
import useSWR from 'swr';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import useCustomNavigate from '../../../hooks/useCustomNavigate';
import { useMemo, useState } from 'react';
import CustomDataGrid from '../../../components/elements/CustomDataGrid';
import { calculateRegistrasiRekomendasiProcessingDays, calculateRekomendasiProcessingDays, hasValidStatus } from '../../../services/helpers';
import TipeSurat from '../../../enums/tipeSurat';
export default function IndexPage() {
    const { getRecomendationDetailPath } = useCustomNavigate();
    const [activeTab, setActiveTab] = useState("toValidate"); // Menyimpan tab yang aktif
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const apiEndpoint = useMemo(() => {
        switch (activeTab) {
            case "toValidate":
                return `/api/rekom/permohonan/search?status=Verifikasi Teknis&page=${page + 1}&limit=${pageSize}`;
            case "draft":
                return `/api/rekom/permohonan/search?status=Pembuatan Telaah dan Draft SK,Menunggu Draft SK Tanda Tangan Direktur&page=${page + 1}&limit=${pageSize}`;  
            case "history":      
                return `/api/rekom/permohonan/search?status=Selesai,Ditolak&page=${page + 1}&limit=${pageSize}`;
            default:
                return null;
        }
    }, [activeTab, page, pageSize]);

    // Fetch data menggunakan SWR
    const { data, isLoading } = useSWR(apiEndpoint, getFetcher, {
        revalidateOnFocus: true,
        keepPreviousData: true,
    });
    
    const columns = useMemo(() => [
        {
            field: 'kodePermohonan',
            headerName: 'Kode Permohonan',
            width: 300
        },
        {
            field: 'company',
            headerName: 'Perusahaan',
            width: 300,
            renderCell: (params) => params.row.company.name
        },
        {
            field: 'jenisPermohonan',
            headerName: 'Jenis Permohonan',
            width: 300,
        },
        {
            field: 'tipeSurat',
            headerName: 'Tipe Surat',
            width: 300,
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 250,
            renderCell: (params) => (<Chip size='sm' color='primary' variant='faded'>{params.value}</Chip>)
        },
        {
            field: 'lamaProses',
            headerName: 'Lama Proses',
            width: 150,
            valueGetter: (value, row) => {
                const lamaProses = calculateRekomendasiProcessingDays(row.statusHistory);

                return lamaProses;
            },
            renderCell: (params) => {
                const lamaProses = calculateRekomendasiProcessingDays(params.row.statusHistory);
            
                // Gunakan if-else untuk perbandingan logika
                if (lamaProses < 45 && (hasValidStatus([params.row.tipeSurat], [TipeSurat.BARU, TipeSurat.PENAMBAHAN_KENDARAAN])) ) {
                  return (
                    <Chip color="success" variant="flat" size="sm">
                      {lamaProses} Hari
                    </Chip>
                  );
                }
                else if(lamaProses < 14 && (hasValidStatus([params.row.tipeSurat], [TipeSurat.PENAMBAHAN_JENIS_B3, TipeSurat.PERPANJANGAN]))){
                    return (
                        <Chip color="success" variant="flat" size="sm">
                          {lamaProses} Hari
                        </Chip>
                    );
                }else if(!hasValidStatus([params.row.tipeSurat], [TipeSurat.PENAMBAHAN_JENIS_B3, TipeSurat.PERPANJANGAN, 
                    TipeSurat.BARU, TipeSurat.PENAMBAHAN_KENDARAAN])){
                    return (
                        <Chip color="success" variant="flat" size="sm">
                          {lamaProses} Hari
                        </Chip>
                    );
                }
                else {
                  return (
                    <Chip color="danger" variant="flat" size="sm">
                      {lamaProses} Hari
                    </Chip>
                  );
                }
            },
        },
        {
            field: 'action',
            headerName: 'Aksi',
            renderCell: (params) => (
                <Button size='sm' color='primary' isIconOnly onClick={() => getRecomendationDetailPath(params.row.id)}><EyeIcon className='size-4'/></Button>
            ),
            sortable: false,
            filterable: false
        }, 
    ], [getRecomendationDetailPath])

    return (
        <RootAdmin>
            <Card className="w-full mt-3" radius='sm'>
                <CardHeader>
                    <p>Daftar Permohonan Rekomendasi</p>
                </CardHeader>
                <CardBody className="w-full h-[530px] p-5">
                <Tabs
                        aria-label="Daftar Permohonan"
                        onSelectionChange={(key) => {
                            setActiveTab(key); // Ubah tab aktif
                            setPage(0); // Reset pagination saat tab berubah
                        }}
                >
                    <Tab title="Perlu Divalidasi" key="toValidate" />
                    <Tab title="Draft" key="draft" />   
                    <Tab title="Riwayat" key="history" />
                </Tabs>
                    <CustomDataGrid
                        data={data?.applications || []}
                        rowCount={data?.total || 0}
                        isLoading={isLoading}
                        columns={columns}
                        pageSize={pageSize}
                        setPageSize={setPageSize}
                        page={page}
                        setPage={setPage}
                    />
                </CardBody>
            </Card>
        </RootAdmin>
    );
};
