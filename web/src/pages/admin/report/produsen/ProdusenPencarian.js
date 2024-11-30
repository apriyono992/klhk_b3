import { Button, Card, CardBody, CardHeader, Divider, Tabs, Tab, Chip } from "@nextui-org/react";
import { EyeIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import useSWR from "swr";
import { getFetcher } from "../../../../services/api";
import RootAdmin from "../../../../components/layouts/RootAdmin";
import useCustomNavigate from "../../../../hooks/useCustomNavigate";
import CustomDataGrid from "../../../../components/elements/CustomDataGrid";
import {useEffect, useMemo, useState} from "react";

export default function ProdusenPencarian() {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const { getAdminStorageDetailPath } = useCustomNavigate();
    const [b3Data, setB3Data] = useState({});
    const [companyData, setCompanyData] = useState({});

    // Opsi SWR tanpa fetch otomatis
    const swrOptions = {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale: false,
        revalidateOnMount: false,
        dedupingInterval: 60000,
        suspense: false,
        fallbackData: null,
    };

    // Fetch data perusahaan yang sudah dan belum melaporkan
    const { data: produsenB3, mutate: mutateProdusenB3 } = useSWR(
        `/api/dashboard/pelaporan/Produsen/pencarian/bahanb3?page=${page + 1}&limit=${pageSize}&keyword=&startDate=&endDate=`,
        getFetcher,
    );

    const { data: produsenPerusahaan, mutate: mutateProdusenPerusahaan } = useSWR(
        `/api/dashboard/pelaporan/Produsen/pencarian/perusahaan?page=${page + 1}&limit=${pageSize}&keyword=&startDate=&endDate=`,
        getFetcher,
    );


    // masukkan ke data usestate setiap data baru ter-fetch
    useEffect(() => {
        console.log(produsenB3)
        if (produsenB3) {
            setB3Data(produsenB3.responseData);
        }

        if (produsenPerusahaan) {
            setCompanyData(produsenPerusahaan.responseData);
        }
    }, [produsenB3, produsenPerusahaan]);

    const columnsPerusahaan = useMemo(() => [
        {
            field: 'name',
            headerName: 'Nama Perusahaan',
            flex: 1,
            renderCell: (params) => <span>{params?.row?.name || '-'}</span>,
        },
        {
            field: 'penanggungJawab',
            headerName: 'Penanggung Jawab',
            flex: 1,
            renderCell: (params) => <span>{params?.row?.penanggungJawab || '-'}</span>,
        },
        {
            field: 'alamatKantor',
            headerName: 'Alamat Kantor',
            flex: 1.5,
            renderCell: (params) => <span>{params?.row?.alamatKantor || '-'}</span>,
        },
        {
            field: 'telpKantor',
            headerName: 'Telepon Kantor',
            flex: 1,
            renderCell: (params) => <span>{params?.row?.telpKantor || '-'}</span>,
        },
        {
            field: 'faxKantor',
            headerName: 'Fax Kantor',
            flex: 1,
            renderCell: (params) => <span>{params?.row?.faxKantor || '-'}</span>,
        },
        {
            field: 'emailKantor',
            headerName: 'Email Kantor',
            flex: 1.5,
            renderCell: (params) => <span>{params?.row?.emailKantor || '-'}</span>,
        },
        {
            field: 'npwp',
            headerName: 'NPWP',
            flex: 1,
            renderCell: (params) => <span>{params?.row?.npwp || '-'}</span>,
        },
        {
            field: 'nomorInduk',
            headerName: 'Nomor Induk',
            flex: 1,
            renderCell: (params) => <span>{params?.row?.nomorInduk || '-'}</span>,
        },
        {
            field: 'kodeDBKlh',
            headerName: 'Kode DBKLH',
            flex: 1,
            renderCell: (params) => <span>{params?.row?.kodeDBKlh || '-'}</span>,
        },
        {
            field: 'alamatPool',
            headerName: 'Alamat Pool',
            flex: 2,
            renderCell: (params) => (
                <span>
                {params?.row?.alamatPool?.join(', ') || '-'}
            </span>
            ),
        },
        {
            field: 'bidangUsaha',
            headerName: 'Bidang Usaha',
            flex: 1,
            renderCell: (params) => <span>{params?.row?.bidangUsaha || '-'}</span>,
        },
        {
            field: 'tipePerusahaan',
            headerName: 'Tipe Perusahaan',
            flex: 1.5,
            renderCell: (params) => (
                <span>
                {params?.row?.tipePerusahaan?.join(', ') || '-'}
            </span>
            ),
        },
        {
            field: 'total',
            headerName: 'Total Produksi',
            flex: 1,
            renderCell: (params) => <span>{params?.row?.total || '-'}</span>,
        },
    ], []);

    const columnsB3 = useMemo(() => [
        {
            field: 'namaBahanKimia',
            headerName: 'Nama Bahan Kimia',
            flex: 1,
            renderCell: (params) => <span>{params?.row?.namaBahanKimia || '-'}</span>,
        },
        {
            field: 'casNumber',
            headerName: 'CAS Number',
            flex: 1,
            renderCell: (params) => <span>{params?.row?.casNumber || '-'}</span>,
        },
        {
            field: 'namaDagang',
            headerName: 'Nama Dagang',
            flex: 1,
            renderCell: (params) => <span>{params?.row?.namaDagang || '-'}</span>,
        },
        {
            field: 'tipeBahan',
            headerName: 'Tipe Bahan',
            flex: 1,
            renderCell: (params) => <span>{params?.row?.tipeBahan || '-'}</span>,
        },
        {
            field: 'sum',
            headerName: 'Total Jumlah',
            flex: 1,
            renderCell: (params) => <span>{params?.row?.sum || '-'}</span>,
        },
    ], []);


    // Fungsi untuk refresh data
    const handleRefresh = () => {
        mutateProdusenB3();
        mutateProdusenPerusahaan();
    };

    // Fungsi untuk mendapatkan data pertama kali
    const handleGetData = () => {
        mutateProdusenB3();
        mutateProdusenPerusahaan();
    };

    return (
        <RootAdmin>
            <Card className="w-full" radius="sm">
                <CardHeader className="flex justify-between items-center">
                    <p className="text-md">Dashboard Pencarian Pelaporan Produsen B3</p>
                    <div className="flex gap-2">
                        <Button size="sm" color="primary" onPress={handleGetData}>
                            Get Data
                        </Button>
                        <Button size="sm" color="secondary" startContent={<ArrowPathIcon className="size-4" />} onPress={handleRefresh}>
                            Refresh
                        </Button>
                    </div>
                </CardHeader>
                <Divider />
                <CardBody className="w-full h-[550px] p-5">
                    <Tabs aria-label="Pelaporan Pencarian B3" defaultValue="produsenB3"
                    onSelectionChange={() => {
                        setPage(0)
                        setPageSize(10)
                    }}>
                        <Tab title="Pelaporan Bedasarkan Jenis B3" value="produsenB3">
                            <CustomDataGrid
                                data={b3Data?.data || []}
                                rowCount={b3Data?.total || 0}
                                columns={columnsB3}
                                pageSize={pageSize}
                                setPageSize={setPageSize}
                                page={page}
                                setPage={setPage}
                                getRowId={(row) => `${row?.casNumber}-${row?.namaBahanKimia}`}
                            />
                        </Tab>
                        <Tab title="Pelaporan Bedasarkan Perusahaan" value="produsenPerusahaan">
                            <CustomDataGrid
                                data={companyData?.data || []}
                                rowCount={companyData?.total || 0}
                                columns={columnsPerusahaan}
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
