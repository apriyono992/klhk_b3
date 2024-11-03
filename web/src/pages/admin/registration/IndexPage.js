import { Button, Card, CardBody, Chip } from "@nextui-org/react";
import { ArrowPathIcon, CheckIcon, EyeIcon, ListBulletIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import RootAdmin from "../../../components/layouts/RootAdmin";
import CountWidget from "../../../components/elements/CountWidget";
import { getFetcher } from "../../../services/api";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import useSWR from "swr";
import useCustomNavigate from "../../../hooks/useCustomNavigate";
import { useMemo } from "react";
import { formattedDate } from "../../../services/helpers";
import { differenceInMonths} from 'date-fns'

export default function IndexPage() {
    const { getRegistrationDetailPath } = useCustomNavigate();
    const { data, isLoading } = useSWR('/registrasi/search?page=1&limit=10&sortBy=createdAt&sortOrder=desc', getFetcher);

    const columns = useMemo(() =>  [
        { 
            field: 'updatedAt', 
            headerName: 'No',
            width: 70,
            renderCell: (params) => 1,
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
            field: 'tanggal_terbit',
            headerName: 'Tanggal Masuk Data',
            width: 200,
            valueGetter: (value, row) => {
                return formattedDate(value)
            },
        },
        {
            field: 'shippingInformation',
            headerName: 'Lama Proses',
            width: 200,
            valueGetter: (value, row) => {
                let startDate = row.berlaku_dari
                let endDate = row.berlaku_sampai
                return `${differenceInMonths(endDate, startDate)} Bulan`
            }
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            renderCell: (params) => (<Chip size='sm' color='primary' variant='faded'>{params.value}</Chip>)
        },
        {
            field: 'id',
            headerName: 'Aksi',
            renderCell: (params) => (
                <Button size='sm' color='primary' isIconOnly onClick={() => getRegistrationDetailPath(params.value)}><EyeIcon className='size-4'/></Button>
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
                        rows={data?.registrasi}
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