import { Button, useDisclosure, Chip } from "@nextui-org/react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import IsValidIcon from "../../../components/elements/isValidIcon";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { month } from "../../../services/enum";
import { patchFetcher } from "../../../services/api";
import { adminReportValidation } from "../../../services/validation";
import { yupResolver } from "@hookform/resolvers/yup";

export default function useValidateProduction({ mutate }) {
    const {isOpen: isOpenModalForm, onOpen: onOpenModalForm, onOpenChange: onOpenChangeModalForm, onClose: onCloseModalForm} = useDisclosure();
    const [editId, setEditId] = useState(null);
    const [isChecked, setIsChecked] = useState(false);
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(adminReportValidation)});
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
                    <Button isIconOnly size="sm" color="warning" onPress={() => onClickEdit(params.row.id)}><PencilSquareIcon className='size-4'/></Button>
                </div>
            ),
            sortable: false,
            filterable: false
        },
    ], [onClickEdit]);

    async function onSubmitForm(data) {
        try {
            const payload = {
                status: isChecked ? 'Disetujui' : 'Ditolak',
                adminNote: data.adminNote
            }
            await patchFetcher('/api/pelaporan-b3-dihasilkan/review', editId, payload);
            mutate()
            toast.success('Status laporan berhasil diubah!');
            onCloseForm();
        } catch (error) {
            console.log(error);
            toast.error('Gagal ubah status laporan!');
        }
    }

    function onCloseForm() {
        setEditId(null);
        setIsChecked(false);
        reset({
            status: '',
            adminNote: '',   
        });
        onCloseModalForm();
    }

    function onClickEdit(id) {         
        setEditId(id);            
        onOpenModalForm();
    }

    return {
        modalForm: {
            isOpenModalForm,
            onOpenChangeModalForm
        },
        hookForm: {
            register,
            handleSubmit,
            formState: {errors,isSubmitting}
        },
        onCloseForm, 
        onSubmitForm,
        onClickEdit,
        columnsTableActivePeriod,
        columnsTableHistory,
        isChecked,
        setIsChecked
    }
}