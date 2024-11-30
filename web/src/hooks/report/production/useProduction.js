import { yupResolver } from "@hookform/resolvers/yup";
import { Button, useDisclosure, Chip } from "@nextui-org/react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { deleteFetcher, patchFetcher, postFetcher } from "../../../services/api";
import { dirtyInput, isResponseErrorObject } from "../../../services/helpers";
import { createReportProductionValidation } from "../../../services/validation";
import IsValidIcon from "../../../components/elements/isValidIcon";
import ButtonModalAlert from "../../../components/elements/ButtonModalAlert";
import { month } from "../../../services/enum";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function useProduction({ mutate }) {
    const {isOpen: isOpenModalForm, onOpen: onOpenModalForm, onOpenChange: onOpenChangeModalForm, onClose: onCloseModalForm} = useDisclosure();
    const [editId, setEditId] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [materialType, setMaterialType] = useState('');
    const { register, control, handleSubmit, reset, watch,formState: { errors, isSubmitting, dirtyFields } } = useForm({resolver: yupResolver(createReportProductionValidation)});
    const columnsTableHistory = useMemo(() =>  [
        {
            field: 'perusahaan',
            headerName: 'Perusahaan',
            valueGetter: (value, row) => row.company.name,
        },
        {
            field: 'jenisb3',
            headerName: 'Jenis B3',
            valueGetter: (value, row) => row.dataBahanB3.namaBahanKimia,
        },
        {
            field: 'jumlahB3Dihasilkan',
            headerName: 'Jumlah Produksi',
            valueGetter: (value, row) => `${row.jumlahB3Dihasilkan} KG`,
        },
        {
            field: 'periode',
            headerName: 'Periode',
            valueGetter: (value, row) => row.period.name,
        },
        {
            field: 'bulan',
            headerName: 'Bulan',
            valueGetter: (value, row) => month[row.bulan-1],
        },
        {
            field: 'tahun',
            headerName: 'Tahun',
            valueGetter: (value, row) => row.tahun,
        },
        {
            field: 'tipeProduk',
            headerName: 'Tipe Produk',
        },
        {
            field: 'prosesProduksi',
            headerName: 'Proses Produksi',
        },
        {
            field: 'isApproved',
            headerName: 'Status',
            renderCell: (params) => (
                <div className="mt-1">
                    <IsValidIcon value={params.row.isApproved} validMessage="Disetujui" invalidMessage="Tidak Disetujui" />
                </div>
            ),
        },
        {
            field: 'isFinalized',
            headerName: 'Finalisasi',
            renderCell: (params) => (
                <div className="mt-1">
                    <IsValidIcon value={params.row.isFinalized} validMessage="Sudah" invalidMessage="Belum" />
                </div>
            ),
        },
    ], []); 
    const columnsTableActivePeriod = useMemo(() =>  [
        {
            field: 'perusahaan',
            headerName: 'Perusahaan',
            valueGetter: (value, row) => row.company.name,
        },
        {
            field: 'jenisb3',
            headerName: 'Jenis B3',
            valueGetter: (value, row) => row.dataBahanB3.namaBahanKimia,
        },
        {
            field: 'jumlahB3Dihasilkan',
            headerName: 'Jumlah Produksi',
            valueGetter: (value, row) => `${row.jumlahB3Dihasilkan} KG`,
        },
        {
            field: 'periode',
            headerName: 'Periode',
            valueGetter: (value, row) => row.period.name,
        },
        {
            field: 'bulan',
            headerName: 'Bulan',
            valueGetter: (value, row) => month[row.bulan-1],
        },
        {
            field: 'tahun',
            headerName: 'Tahun',
            valueGetter: (value, row) => row.tahun,
        },
        {
            field: 'tipeProduk',
            headerName: 'Tipe Produk',
        },
        {
            field: 'prosesProduksi',
            headerName: 'Proses Produksi',
        },
        {
            field: 'status',
            headerName: 'Status',
            renderCell: (params) => {
                switch (params.row.status) {
                    case 'Menunggu Persetujuan ':
                        return (
                            <Chip color="warning" variant="flat" size="sm">
                                {params.row.status}
                            </Chip>
                        )
                    case 'Disetujui':
                        return (
                            <Chip color="success" variant="flat" size="sm">
                                {params.row.status}
                            </Chip>
                        )
                    case 'Ditolak':
                        return (
                            <Chip color="danger" variant="flat" size="sm">
                                {params.row.status}
                            </Chip>
                        )
                    default:
                        return (
                            <Chip color="secondary" variant="flat" size="sm">
                                Draft
                            </Chip>
                        )
                }
            },
            sortable: false,
            filterable: false,
        },
        {
            field: 'isFinalized',
            headerName: 'Finalisasi',
            renderCell: (params) => (
                <div className="flex mt-1">
                    <IsValidIcon value={params.row.isFinalized} validMessage="Sudah" invalidMessage="Belum" />
                </div>
            ),
        },
        {
            field: 'action',
            headerName: 'Aksi',
            renderCell: (params) => (
                <div className="flex items-center gap-1">
                    <Button size='sm' onPress={() => onClickEdit(params.row)} color='warning' isIconOnly><PencilSquareIcon className='size-4'/></Button>
                    <ButtonModalAlert
                        buttonIsIconOnly={true}
                        buttonTitle={<TrashIcon className='size-4' />}
                        buttonColor="danger"
                        modalIcon="danger"
                        modalHeading="Apakah anda yakin?"
                        modalDescription="Laporan tidak bisa dikembalikan"
                        buttonSubmitText="Hapus"
                        buttonCancelText="Batal"
                        onSubmit={() => onSubmitDelete(params.row.id)}
                    />
                </div>
            ),
            sortable: false,
            filterable: false
        },
    ], [onClickEdit, onSubmitDelete]);

    function onClickEdit(item) { 
        setEditId(item.id);
        setIsEdit(true);
        setMaterialType(item.tipeProduk)
        reset({
            companyId: item.companyId,
            periodId: item.periodId,
            bulan: item.bulan,
            tahun: item.tahun,
            tipeProduk: item.tipeProduk, 
            dataBahanB3Id: item.dataBahanB3Id,
            prosesProduksi: item.prosesProduksi,
            jumlahB3Dihasilkan: item.jumlahB3Dihasilkan
        });           
        onOpenChangeModalForm();
    }

    async function onSubmitFinalize(companyId, periodId) {
        if (!companyId || !periodId) {
            toast.error("Perusahaan dan Periode harus dipilih sebelum finalisasi.");
            return;
        }
    
        try {
            await postFetcher(`/api/pelaporan-b3-dihasilkan/finalize/${companyId}/${periodId}`);
            toast.success("Laporan berhasil difinalisasi.");
            mutate(); // Refresh data setelah finalisasi
        } catch (error) {
            toast.error( "Terjadi kesalahan saat finalisasi. " + error?.response?.data?.message || "Terjadi kessalahan saat finalisasi.");
        }
    }

    function onCloseForm() {
        setEditId(null);
        setIsEdit(false);
        reset({
            companyId: '',
            periodId: '',
            bulan: '',
            tahun: '',
            tipeProduk: '', 
            dataBahanB3Id: '',
            prosesProduksi: '',
            jumlahB3Dihasilkan: ''
        });
        onCloseModalForm()
    }
    
    async function onSubmitDelete(id) {
        try {
            await deleteFetcher('/api/pelaporan-b3-dihasilkan/delete', id);
            mutate()
            toast.success('Laporan produksi b3 dihapus!');
        } catch (error) {
            toast.error('Gagal hapus laporan!');
        }
    }

    async function onSubmitForm(data) {
        try {
            if (isEdit) {
                const filteredData = dirtyInput(dirtyFields, data);
                
                await patchFetcher('/api/pelaporan-b3-dihasilkan/update', editId, filteredData);
                mutate()
                toast.success('Laporan Produksi B3 berhasil diubah!');
            } else {
                console.log(data); 
                await postFetcher('/api/pelaporan-b3-dihasilkan', data);
                mutate()
                toast.success('Laporan Produksi B3 berhasil ditambah!');
            }
            onCloseForm();
        } catch (error) {
            isResponseErrorObject(error.response.data.message)
                ? Object.entries(error.response.data.message).forEach(([key, value]) => {
                    toast.error(value);
                })
                : toast.error(error.response.data.message)
        }
    }

    return {
        modalForm: {
            isOpenModalForm,
            onOpenModalForm,
            onOpenChangeModalForm,
        },
        hookForm: {
            register, 
            control,
            handleSubmit, 
            reset, 
            formState: { errors, isSubmitting, dirtyFields }
        },
        isEdit,
        onClickEdit,
        onCloseForm,
        onSubmitDelete,
        onSubmitFinalize,
        onSubmitForm,
        columnsTableActivePeriod,
        columnsTableHistory,
        materialType,
        setMaterialType,
        watch
    }
}