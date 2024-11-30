import { Button, Card, CardBody, Chip, Tabs, Tab } from "@nextui-org/react";
import { ArrowPathIcon, CheckIcon, EyeIcon, ListBulletIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import RootAdmin from "../../../components/layouts/RootAdmin";
import CountWidget from "../../../components/elements/CountWidget";
import {authStateFetcher, getListRegistrasi, sendInsw} from "../../../services/api";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import useSWR from "swr";
import useCustomNavigate from "../../../hooks/useCustomNavigate";
import { useMemo } from "react";
import { calculateRegistrasiRekomendasiProcessingDays, formattedDate } from "../../../services/helpers";
import { differenceInDays } from 'date-fns'
import {TrashIcon} from "@heroicons/react/16/solid";
import toast from "react-hot-toast";
import StatusPermohonanRegistrasi from "../../../enums/statusRegistrasi";

export default function IndexPage() {
    const fetcher = (...args) => authStateFetcher(...args);
    const { getRegistrationDetailPath } = useCustomNavigate();

    const onSubmit = async (id) => {
        const data = {
            id: id,
            status: 'nonaktif data INSW',
            jnsPengajuan: '0000000010'
        }
        try {
            const response = await sendInsw(data);
            console.log(response, 'success');
            toast.success('Berhasil Nonaktif Data INSW')
        } catch (error) {
            console.log('error fetching:', error)
            toast.error('Gagal Nonaktif Data INSW!');
        }
    }

    const { data: pending, isLoading: loadingPending } = useSWR(`/api/registrasi/find-all/search?status=pending,${StatusPermohonanRegistrasi.VERIFIKASI_TEKNIS}&returnAll=true`, fetcher);
    const { data: draft, isLoading: loadingDraft } = useSWR(`/api/registrasi/find-all/search?status=draft,${StatusPermohonanRegistrasi.DRAFT_SK_TANDA_TANGAN_DIREKTUR},${StatusPermohonanRegistrasi.PEMBUATAN_DRAFT_SK},${StatusPermohonanRegistrasi.KIRIM_INSW}&returnAll=true`, fetcher);
    const { data: riwayat, isLoading: loadingRiwayat } = useSWR(`/api/registrasi/find-all/search?status=riwayat,${StatusPermohonanRegistrasi.SELESAI},${StatusPermohonanRegistrasi.DITOLAK}&returnAll=true`, fetcher);

    const columns = useMemo(() =>  [
        {
            field: 'index',
            headerName: 'No',
            width: 70,
        },
        {
            field: 'nomor',
            headerName: 'Nomor Registrasi',
            width: 300
        },
        {
            field: 'nama_perusahaan',
            headerName: 'Perusahaan',
            width: 300
        },
        {
            field: 'brand',
            headerName: 'Sub Layanan',
            width: 200,
            renderCell: () => "Registrasi B3 (Baru)"
        },
        {
            field: 'createdAt',
            headerName: 'Tanggal Masuk Data',
            width: 200,
            valueGetter: (value, row) => {
                return formattedDate(value)
            },
        },
        {
            field: 'shippingInformation',
            headerName: 'Lama Proses',
            width: 150,
            valueGetter: (value, row) => {
                const lamaProses = calculateRegistrasiRekomendasiProcessingDays(row.statusHistory);

                return lamaProses;
            },
            renderCell: (params) => {
                const lamaProses = calculateRegistrasiRekomendasiProcessingDays(params.row.statusHistory);
            
                // Gunakan if-else untuk perbandingan logika
                if (lamaProses < 2) {
                  return (
                    <Chip color="success" variant="flat" size="sm">
                      {lamaProses} Hari
                    </Chip>
                  );
                } else {
                  return (
                    <Chip color="danger" variant="flat" size="sm">
                      {lamaProses} Hari
                    </Chip>
                  );
                }
            },
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            renderCell: (params) => (<Chip size='sm' color='primary' variant='faded' className="capitalize">{params.value}</Chip>)
        },
        {
            field: 'id',
            headerName: 'Aksi',
            renderCell: (params) => (
                <div className={'flex gap-2'}>
                    <Button size='sm' color='primary' isIconOnly onClick={() => getRegistrationDetailPath(params.value)}><EyeIcon className='size-4'/></Button>
                    {/*<Button size='sm' color='danger' isIconOnly onClick={() => onSubmit(params.value)}><TrashIcon className='size-4'/></Button>*/}
                </div>
            ),
        },
    ], [getRegistrationDetailPath]);

    return(
        <RootAdmin>
            <Card radius="sm">
                <CardBody className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <CountWidget title="Total" count="6234" color={"bg-blue-500"} icon={<ListBulletIcon className="size-5 stroke-2 stroke-white" />} />
                    <CountWidget title="Proses" count="953" color={"bg-blue-500"} icon={<ArrowPathIcon className="size-6 stroke-2 stroke-white" />} />
                    <CountWidget title="Selesai" count="6234" color={"bg-blue-500"} icon={<CheckIcon className="size-5 stroke-2 stroke-white" />} />
                    <CountWidget title="Terkirim ke INSW" count="6234" color={"bg-blue-500"} icon={<PaperAirplaneIcon className="size-5 stroke-2 stroke-white" />} />
                </CardBody>
            </Card>
            <Card className="w-full mt-3" radius="sm">
                <CardBody className='w-full h-[550px] p-5'>
                    <Tabs aria-label="Daftar Penyimpanan B3" defaultValue="toValidate">
                        <Tab title="Perlu Divalidasi" value="toValidate">
                            <DataGrid
                                rows={pending?.registrasi || []}
                                loading={loadingPending}
                                columns={columns}
                                disableDensitySelector
                                initialState={{
                                    pagination: {
                                        paginationModel: {
                                            pageSize: 10,
                                        },
                                    },
                                    density: 'compact',
                                }}
                                slots={{
                                    toolbar: GridToolbar,
                                }}
                                pageSizeOptions={[5]}
                                checkboxSelection
                                disableRowSelectionOnClick
                            />
                        </Tab>
                        <Tab title="Draft SK" value="draftSk">
                            <DataGrid
                                rows={draft?.registrasi || []}
                                loading={loadingDraft}
                                columns={columns}
                                disableDensitySelector
                                initialState={{
                                    pagination: {
                                        paginationModel: {
                                            pageSize: 10,
                                        },
                                    },
                                    density: 'compact',
                                }}
                                slots={{
                                    toolbar: GridToolbar,
                                }}
                                pageSizeOptions={[5]}
                                checkboxSelection
                                disableRowSelectionOnClick
                            />
                        </Tab>
                        <Tab title="Riwayat" value="riwayat">
                            <DataGrid
                                rows={riwayat?.registrasi || []}
                                loading={loadingRiwayat}
                                columns={columns}
                                disableDensitySelector
                                initialState={{
                                    pagination: {
                                        paginationModel: {
                                            pageSize: 10,
                                        },
                                    },
                                    density: 'compact',
                                }}
                                slots={{
                                    toolbar: GridToolbar,
                                }}
                                pageSizeOptions={[5]}
                                checkboxSelection
                                disableRowSelectionOnClick
                            />
                        </Tab>
                    </Tabs>
                </CardBody>
            </Card>
        </RootAdmin>
    )
}
