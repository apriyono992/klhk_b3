import { useDisclosure, Chip, Button } from "@nextui-org/react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { adminReportValidation } from "../../../services/validation";
import IsValidIcon from "../../../components/elements/isValidIcon";
import { month } from "../../../services/enum";
import ModalConsumptionDetail from "../../../components/fragments/admin/report/consumption/ModalConsumptionDetail";
import { PencilSquareIcon } from '@heroicons/react/20/solid';
import { patchFetcher, postFetcher } from "../../../services/api";

export default function useValidateConsumption({ mutate }) {
    const {isOpen: isOpenModalForm, onOpen: onOpenModalForm, onOpenChange: onOpenChangeModalForm, onClose: onCloseModalForm} = useDisclosure();
    const [editId, setEditId] = useState(null);
    const [isChecked, setIsChecked] = useState(false);
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(adminReportValidation) });
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
            field: 'jumlahPembelianB3',
            headerName: 'Jumlah Pembelian',
            valueGetter: (value, row) => `${row.jumlahPembelianB3} KG`,
        },
        {
            field: 'jumlahKonsumsiB3',
            headerName: 'Jumlah Konsumsi',
            valueGetter: (value, row) => `${row.jumlahB3Digunakan} KG`,
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
            field: 'isApproved',
            headerName: 'Status',
            renderCell: (params) => {
                switch (params.row.status) {
                    case 'Menunggu Persetujuan':
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
            headerName: 'Status',
            renderCell: (params) => (                
            <div className="mt-1">
                <IsValidIcon value={params.row.isFinalized} validMessage="Sudah Finalisasi" invalidMessage="Belum Finalisasi" />
            </div>),
        },
        {
            field: 'action',
            headerName: 'Aksi',
            renderCell: (params) => (
                <div className="flex items-center gap-1">
                    <Button isIconOnly size="sm" color="warning" onPress={() => onClickEdit(params.row.id)}><PencilSquareIcon className='size-4'/></Button>
                    <ModalConsumptionDetail data={params.row} />
                </div>
            ),
            sortable: false,
            filterable: false
        },
    ], []);
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
            field: 'jumlahPembelianB3',
            headerName: 'Jumlah Pembelian',
            valueGetter: (value, row) => `${row.jumlahPembelianB3} KG`,
        },
        {
            field: 'jumlahKonsumsiB3',
            headerName: 'Jumlah Konsumsi',
            valueGetter: (value, row) => `${row.jumlahB3Digunakan} KG`,
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
            field: 'isApproved',
            headerName: 'Status',
            renderCell: (params) => (<IsValidIcon value={params.row.isApproved} />),
        },
        {
            field: 'isFinalized',
            headerName: 'Status',
            renderCell: (params) => (<IsValidIcon value={params.row.isFinalized} />),
        },
        {
            field: 'action',
            headerName: 'Aksi',
            renderCell: (params) => (
                <div className="flex items-center gap-1">
                    <ModalConsumptionDetail data={params.row} />
                </div>
            ),
            sortable: false,
            filterable: false
        },
    ], []);

    async function onSubmitForm(data) {
        try {
            data.id = editId;
            const payload = isChecked ? {status: 'Disetujui', adminNote: data.adminNote} : {status: 'Ditolak', adminNote: data.adminNote};
            await postFetcher(`/api/pelaporan-penggunaan-bahan-b3/review/${editId}`, payload);
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
        isChecked,
        setIsChecked,
        columnsTableActivePeriod,
        columnsTableHistory
    }
}