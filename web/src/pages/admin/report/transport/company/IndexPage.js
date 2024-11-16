import { useMemo, useState } from 'react'
import RootAdmin from '../../../../../components/layouts/RootAdmin'
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, ScrollShadow, } from '@nextui-org/react'
import { getFetcher } from '../../../../../services/api';
import useSWR from 'swr';
import { format } from 'date-fns';
import CustomDataGrid from '../../../../../components/elements/CustomDataGrid';

export default function IndexPage() {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [vehicle, setVehicle] = useState([]);
    const [applicationCode, setApplicationCode] = useState(null)
    const { data, isLoading } = useSWR(`/api/rekom/permohonan/search?page=${page + 1}&limit=${pageSize}&companyId=14997adf-dcdf-40c6-b67b-60b2aeec3c13`, getFetcher);

    const columns = useMemo(() =>  [
        {
            field: 'kodePermohonan',
            headerName: 'Kode Permohonan',
        },
        {
            field: 'jenisPermohonan',
            headerName: 'Jenis Permohonan',
        },
        {
            field: 'tipeSurat',
            headerName: 'Tipe Surat',
        },
        {
            field: 'tanggalPengajuan',
            headerName: 'Tanggal Pengajuan',
            valueGetter: (value, row) => format(row.tanggalPengajuan, 'PPP'),
        },
        {
            field: 'tanggalDisetujui',
            headerName: 'Tanggal Disetujui',
            valueGetter: (value, row) => format(row.tanggalDisetujui, 'PPP'),
        },
        {
            field: 'tanggalBerakhir',
            headerName: 'Tanggal Berakhir',
            valueGetter: (value, row) => format(row.tanggalBerakhir, 'PPP'),
        },
    ], []);

    function onRowClick(row) {
        setVehicle(row.row.vehicles)
        setApplicationCode(row.row.kodePermohonan)
    }

    return (
        <RootAdmin>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                <Card radius='sm' className='col-span-2'>
                    <CardHeader>
                        Daftar Permohonan Rekomendasi
                    </CardHeader>
                    <Divider/>
                    <CardBody className='w-full h-[480px] p-5'>
                        <CustomDataGrid
                            data={data?.applications}
                            rowCount={data?.total || 0}
                            isLoading={isLoading}
                            columns={columns}
                            pageSize={pageSize}
                            setPageSize={setPageSize}
                            page={page}
                            setPage={setPage}
                            disableRowSelectionOnClick={false}
                            onRowClick={onRowClick}
                            initialState={{
                                columns: {
                                    columnVisibilityModel: {
                                        tanggalDisetujui: false,
                                        tanggalBerakhir: false
                                    },
                                },
                            }}
                        />
                    </CardBody>
                </Card>
                <Card radius='sm' className='col-span-1'>
                    <CardHeader>
                        {applicationCode && `Permohonan ${applicationCode}`}  
                    </CardHeader>
                    <Divider/>
                    <CardBody className='w-full h-[480px] p-0'>
                        <ScrollShadow className='space-y-3 p-3' hideScrollBar>
                        {
                            vehicle.length > 0
                            ?
                            vehicle.map((item) => (
                                <Card radius='sm' key={item.vehicleId}>
                                    <CardBody>
                                        <div className='flex flex-col text-xs'>
                                            <div className='flex items-center gap-2 mb-3'>
                                                <span className='text-base font-semibold'>Model Kendaraan</span>
                                                /
                                                <span className='text-base'>No Polisi</span>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <div className='flex flex-col w-1/2'>
                                                    <span>Nomor Rangka</span>
                                                    <span>Nomor Mesin</span>
                                                </div>
                                                <div className='flex flex-col w-1/2'>
                                                    <span>Tahun Pembuatan</span>
                                                    <span>Kepemilikan</span>
                                                </div> 
                                            </div>
                                        </div>
                                    </CardBody>
                                    <CardFooter className='flex gap-1'>
                                        <Button onPress={() => console.log(applicationCode) }color='primary' size='sm'>Lapor</Button>
                                        <Button color='primary' variant='faded' size='sm'>Riwayat</Button>
                                    </CardFooter>
                                </Card>
                            )) 
                            :
                            <></>
                        }
                        </ScrollShadow>
                    </CardBody>
                </Card>
            </div>
        </RootAdmin>
    )
}
