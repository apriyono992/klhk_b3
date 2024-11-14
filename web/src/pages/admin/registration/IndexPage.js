import { Button, Card, CardBody, Chip } from "@nextui-org/react";
import { ArrowPathIcon, CheckIcon, EyeIcon, ListBulletIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import RootAdmin from "../../../components/layouts/RootAdmin";
import CountWidget from "../../../components/elements/CountWidget";
import {authStateFetcher, getListRegistrasi, sendInsw} from "../../../services/api";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import useSWR from "swr";
import useCustomNavigate from "../../../hooks/useCustomNavigate";
import { useMemo } from "react";
import { formattedDate } from "../../../services/helpers";
import { differenceInDays } from 'date-fns'
import {TrashIcon} from "@heroicons/react/16/solid";
import toast from "react-hot-toast";

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

    const { data, isLoading } = useSWR('/api/registrasi/search?page=1&limit=10&sortBy=createdAt&sortOrder=desc', fetcher);
    const dataWithIndex = data?.registrasi?.map((item, index) => ({
        ...item,
        no: index + 1 // Auto-incrementing number
    })) || [];

    const columns = useMemo(() =>  [
        {
            field: 'no',
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
                let startDate = row.berlaku_dari
                let endDate = row.berlaku_sampai
                return `${differenceInDays(endDate, startDate)} Hari`
            }
        },
        {
            field: 'approval_status',
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
                    <DataGrid
                        rows={dataWithIndex}
                        loading={isLoading}
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
                </CardBody>
            </Card>
        </RootAdmin>
    )
}
