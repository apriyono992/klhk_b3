import RootAdmin from '../../../components/layouts/RootAdmin';
import { Button, Card, CardBody, CardHeader, Chip, Divider } from '@nextui-org/react';
import { EyeIcon } from '@heroicons/react/24/outline';
import { getFetcher } from '../../../services/api';
import useSWR from 'swr';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import useCustomNavigate from '../../../hooks/useCustomNavigate';
import { useMemo, useState } from 'react';
import CustomDataGrid from '../../../components/elements/CustomDataGrid';
export default function IndexPage() {
    const { getRecomendationDetailPath } = useCustomNavigate();

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const { data, isLoading } = useSWR(`/api/rekom/permohonan/search?page=${page + 1}&limit=${pageSize}`, getFetcher);
    console.log(data);
    

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
                <Divider/>
                <CardBody className='w-full h-[530px] p-5'>
                    <CustomDataGrid
                        data={data?.applications}
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
