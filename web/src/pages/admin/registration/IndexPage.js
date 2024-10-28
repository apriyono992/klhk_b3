import { Button, Card, CardBody, Chip } from "@nextui-org/react";
import { ArrowPathIcon, CheckIcon, EyeIcon, ListBulletIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import RootAdmin from "../../../components/layouts/RootAdmin";
import CountWidget from "../../../components/elements/CountWidget";
import { authStateFetcher } from "../../../services/api";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import useSWR from "swr";
import useCustomNavigate from "../../../hooks/useCustomNavigate";
import { useMemo } from "react";

export default function IndexPage() {
    const fetcher = (...args) => authStateFetcher(...args);
    const { getRegistrationDetailPath } = useCustomNavigate();

    const { data, isLoading } = useSWR('/products?limit=200', fetcher);

    const columns = useMemo(() =>  [
        { 
            field: 'id', 
            headerName: 'No',
            width: 70 
        },
        {
            field: 'title',
            headerName: 'Nomor Registrasi',
            width: 300
        },
        {
            field: 'category',
            headerName: 'Perusahaan',
            width: 300
        },
        {
            field: 'brand',
            headerName: 'Sub Layanan',
            width: 200
        },
        {
            field: 'meta.createdAt',
            headerName: 'Tanggal Masuk Data',
            width: 200
        },
        {
            field: 'shippingInformation',
            headerName: 'Lama Proses',
            width: 200
        },
        {
            field: 'availabilityStatus',
            headerName: 'Status',
            width: 150,
            renderCell: (params) => (<Chip size='sm' color='primary' variant='faded'>{params.value}</Chip>)
        },
        {
            field: 'sku',
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
                        rows={data?.products}
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