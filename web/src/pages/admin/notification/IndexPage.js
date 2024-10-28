import RootAdmin from '../../../components/layouts/RootAdmin';
import { Button, Card, CardBody, CardHeader, Divider } from '@nextui-org/react';
import { EyeIcon, PlusIcon } from '@heroicons/react/24/outline';
import { authStateFetcher } from '../../../services/api';
import useSWR from 'swr';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import useCustomNavigate from '../../../hooks/useCustomNavigate';
import { useMemo } from 'react';
export default function IndexPage() {
    const fetcher = (...args) => authStateFetcher(...args);
    const { getNotificationDetailPath } = useCustomNavigate();

    const { data, isLoading } = useSWR('/products?limit=200', fetcher);

    const columns = useMemo(() => [
        { 
            field: 'id', 
            headerName: 'No',
            width: 70 
        },
        {
            field: 'sku',
            headerName: 'Nomor Registrasi Notifikasi',
            width: 300
        },
        {
            field: 'category',
            headerName: 'Perusahaan',
            width: 300
        },
        {
            field: 'action',
            headerName: 'Aksi',
            renderCell: (params) => (
                <Button size='sm' color='primary' isIconOnly onClick={() => getNotificationDetailPath(params.row.sku)}><EyeIcon className='size-4'/></Button>
            ),
            sortable: false,
            filterable: false
        }, 
    ], [getNotificationDetailPath])
    return (
        <RootAdmin>
            <Card className="w-full mt-3" radius='sm'>
                <CardHeader>
                    <p className="text-md">Daftar Notifikasi</p>
                </CardHeader>
                <Divider/>
                <CardBody className='w-full h-[530px] p-5'>
                    <div className="mb-5">
                        <Button size="sm" color="primary" startContent={<PlusIcon className="size-4 stroke-2"/>}>Tambah</Button>
                    </div>
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
                        pageSizeOptions={[5, 10, 15]}
                        scrollbarSize={5}
                    />
                </CardBody>
            </Card>
        </RootAdmin>
    );
};
