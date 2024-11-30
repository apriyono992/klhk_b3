import React, { useState } from "react";
import { Card, CardBody, CardHeader, Divider, Button, Modal, ModalContent, ModalBody, ModalFooter, ModalHeader, Chip } from "@nextui-org/react";
import CustomDataGrid from "../../../../components/elements/CustomDataGrid";
import { getFetcher, getSelectFetcher, postFetcher } from "../../../../services/api";
import { useForm } from "react-hook-form";
import { Tabs, Tab } from "@nextui-org/react";
import useSWR from "swr";
import ControlledReactSelect from "../../../../components/elements/ControlledReactSelect";
import RootAdmin from "../../../../components/layouts/RootAdmin";
import ControlledInput from "../../../../components/elements/ControlledInput";
import toast from 'react-hot-toast';
import useAuth from "../../../../hooks/useAuth";
import RoleAccess from "../../../../enums/roles";

export default function IndexUserStokB3() {
    const { user, roles } = useAuth();
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [selectedTab, setSelectedTab] = useState("current");
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
    const [selectedB3, setSelectedB3] = useState(null); // Data B3 yang dipilih untuk update



    const { control, register, handleSubmit, reset, watch } = useForm({
        defaultValues: {
            startDate: "",
            endDate: "",
            bahanB3Id: null,
            companyId: [], // Default ke array kosong
        },
    });
    const { data: currentStokData, isLoading: isLoadingCurrentStok } = useSWR(`/api/data-bahan-b3-company/search`, getFetcher); // Fetch stok B3
    // const { data: historyRequestData, isLoading: isLoadingHistoryRequest } = useSWR(`/api/data-bahan-b3-company/search-pending-requests`, getFetcher); // Fetch riwayat request
    const { data: bahanB3Options, isLoading: isLoadingBahanB3Options } = useSWR(`/api/data-master/bahan-b3`, getSelectFetcher); // Fetch Bahan B3 options
    const isSuperAdmin = roles.includes(RoleAccess.SUPER_ADMIN); // Cek apakah user adalah Super Admin
    const { data: allCompanies } = useSWR(
        isSuperAdmin
            ? `/api/company/search-company` // Jika Super Admin, fetch semua perusahaan
            : `/api/company/search-company?companyIds=${user.companies.map((company) => company.id).join(",")}`, // Jika bukan Super Admin, fetch perusahaan sesuai IDs
        getSelectFetcher
    );

    const { data: historyRequestData, isLoading: isLoadingHistoryRequest } = useSWR(
        isSuperAdmin
            ? `/api/data-bahan-b3-company/search-pending-requests` // Jika Super Admin, fetch semua perusahaan
            : `/api/data-bahan-b3-company/search-pending-requests?companyId=${user.companies.map((company) => company.id).join(",")}`, // Jika bukan Super Admin, fetch perusahaan sesuai IDs
        getFetcher
    );

    const { data: stokPerPeriodData, isLoading: isLoadingStokPerPeriod, mutate: mutateStokByPeriodData } = useSWR(
        selectedTab === "period" && filters.startDate && filters.endDate
            ? `/api/data-bahan-b3-company/search-period?startDate=${filters.startDate}&endDate=${filters.endDate}&companyId=${filters.companyId?.join(",") || ""}&dataBahanB3Id=${filters.bahanB3Id || ""}`
            : null,
        getFetcher
    );
    
    const filters = watch();

    const handleOpenModal = () => {
        setIsOpenModal(true);
    };

    const handleCloseModal = () => {
        reset();
        setIsOpenModal(false);
    };

    const onSubmitRequest = async (data) => {
        try {
            const payload = {
                companyId: data.companyId,
                dataBahanB3Id: data.bahanB3Id,
                stokB3: data.stokRequest,
            };
            await postFetcher('/api/data-bahan-b3-company/add-request', payload);
            toast.success("Request stok berhasil diajukan!");
            handleCloseModal();
        } catch (error) {
            toast.error("Gagal mengajukan request stok");
        }
    };

    const columnsCurrent = [
        { field: "casNumber", headerName: "CAS Number Bahan Kimia", flex: 1,
            valueGetter: (row, value) =>  value.dataBahanB3.casNumber || 'N/A'
        },
        { field: "bahanB3Name", headerName: "Nama Bahan Kimia", flex: 1,
            valueGetter: (row, value) =>  value.dataBahanB3.namaBahanKimia || 'N/A'
        },
        { field: "companyName", headerName: "Perusahaan", flex: 1,
            valueGetter: (row, value) =>  value.company.name || 'N/A'
        },
        { field: "stok", headerName: "Stok (kg)", flex: 1,
            valueGetter: (row, value) =>  value.stokB3 || 'N/A'
         },
        {
            field: "action",
            headerName: "Aksi",
            renderCell: (params) => (
            <Button
                size="sm"
                color="primary"
                onPress={() => handleOpenUpdateModal(params.row)}
            >
                Update Stok
            </Button>
            ),
        },
    ];

    const columnsHistoryRequest = [
        { field: "casNumber", headerName: "CAS Number Bahan Kimia", flex: 1,
            valueGetter: (row, value) =>  value.dataBahanB3.casNumber || 'N/A'
        },
        { field: "bahanB3Name", headerName: "Nama Bahan Kimia", flex: 1,
            valueGetter: (row, value) =>  value.dataBahanB3.namaBahanKimia || 'N/A'
        },
        { field: "type", headerName: "Tipe Pengajuan", flex: 1,
            valueGetter: (row, value) =>  value.type == 'create' ? 'Request Stok' : 'Request Update Stok'
        },
        { field: "companyName", headerName: "Perusahaan", flex: 1,
            valueGetter: (row, value) =>  value.company.name || 'N/A'
        },
        { field: "requestedStok", headerName: "Jumlah Request (kg)", flex: 1,
            valueGetter: (row, value) =>  value.requestedStokB3 || 'N/A'
        },
        { field: "tanggalPengajuan", headerName: "Tanggal Pengajuan", flex: 1,
            renderCell: (params) => {
                const date = params?.row?.requestDate;
                if (!date) return '-';
    
                const formattedDate = new Intl.DateTimeFormat('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                }).format(new Date(date));
    
                return formattedDate;
            },
        },
        { field: "status", headerName: "Status", flex: 1,
            renderCell: (params) => {
                const status = params?.row?.approved || false; // Mengambil nilai dari params.value
                return (
                    <Chip
                    color={status === true ? 'success' : 'warning'}
                    variant="flat"
                    size="sm"
                >
                    {status === true ? 'Disetujui' : 'Menunggu Persetujuan'}
                </Chip>
                );
            }   
         },
    ];

    const columnsStokPerPeriod = [
        { field: "bahanB3Name", headerName: "Nama B3", flex: 1 },
        { field: "stok", headerName: "Stok (kg)", flex: 1 },
        { field: "companyName", headerName: "Perusahaan", flex: 1 },
        { field: "periode", headerName: "Periode", flex: 1 },
    ];

    const handleOpenUpdateModal = async (data) => {
        try {
            // Panggil API untuk mendapatkan detail stok berdasarkan ID
            const response = await getFetcher(`/api/data-bahan-b3-company/detail/${data.id}`);
            // Atur state untuk referensi
            setSelectedB3({
                casNumber: response.dataBahanB3?.casNumber || "N/A",
                bahanB3Name: response.dataBahanB3?.namaBahanKimia || "N/A",
                companyName: response.company?.name || "N/A",
                existingStok: response.stokB3 || 0,
                hasPendingRequest: response.updateRequests.length > 0, // Cek apakah ada request yang belum selesai
                stokHistory: response.stokHistory || [], // Riwayat stok
            });

            // Reset form dengan data baru
            reset({
                companyId: response.companyId,
                id : response.id,
                casNumber: response.dataBahanB3?.casNumber || "",
                bahanB3Name: response.dataBahanB3?.namaBahanKimia || "",
                companyName: response.company?.name || "",
                existingStok: response.stokB3 || 0,
                stokRequest: "",
                notes: "",
            });

            // Buka modal
            setIsOpenUpdateModal(true);
        } catch (error) {
            toast.error("Gagal mengambil data stok.");
        }
    };

    const handleCloseUpdateModal = () => {
        // Reset state modal dan data yang terkait
        setIsOpenUpdateModal(false);
        setSelectedB3(null); // Menghapus data yang dipilih
    };

    const onSubmitUpdateRequest = async (data) => {
        try {
            // Siapkan payload untuk API
            const payload = {
                dataBahanB3CompanyId: data.id,
                companyId: data?.companyId, // ID perusahaan
                newStokB3: data.stokRequest, // Stok baru yang diminta
                notes: data.notes || null, // Catatan tambahan (opsional)
            };

            console.log(payload);
    
            // Kirim data ke endpoint API
            await postFetcher('/api/data-bahan-b3-company/update-request', payload);
    
            // Tampilkan notifikasi sukses
            toast.success("Permintaan pembaruan stok berhasil diajukan!");
    
            // Tutup modal
            handleCloseUpdateModal();
        } catch (error) {
            // Tampilkan notifikasi error
            toast.error("Gagal mengajukan permintaan pembaruan stok.");
        }
    };
    

    return (
        <RootAdmin>
            <div>
            <Card className="w-full mt-5">
                <CardHeader className="flex items-center gap-3">
                        {/* Elemen teks di sebelah kiri */}
                        <p className="text-md">Stok B3</p>
                        {/* Tombol di sebelah kanan */}
                        <Button size="sm" color="primary" className="ml-right" onPress={handleOpenModal}>
                            Request Stok
                        </Button>
                </CardHeader>
                <Divider />
                <CardBody>
                    <Tabs aria-label="User Stok B3 Tabs" value={selectedTab} onValueChange={setSelectedTab}>
                        <Tab title="Stok Saat Ini" value="current">
                            <CustomDataGrid
                                data={currentStokData?.data || []}
                                columns={columnsCurrent}
                                rowCount={currentStokData?.totalCount || 0}
                                isLoading={isLoadingCurrentStok}
                                pageSize={pageSize}
                                setPageSize={setPageSize}
                                page={page}
                                setPage={setPage}
                                clientPagination
                            />
                        </Tab>
                        <Tab title="Riwayat Request B3" value="history">
                            <CustomDataGrid
                                data={historyRequestData || []}
                                columns={columnsHistoryRequest}
                                rowCount={historyRequestData?.total || 0}
                                isLoading={isLoadingHistoryRequest}
                                pageSize={pageSize}
                                setPageSize={setPageSize}
                                page={page}
                                setPage={setPage}
                                clientPagination
                            />
                        </Tab>
                        <Tab title="Stok B3 per Periode" value="period">
                            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <ControlledReactSelect
                                    control={control}
                                    name="companyId"
                                    label="Filter Perusahaan"
                                    options={[
                                        { value: "company1", label: "Perusahaan 1" },
                                        { value: "company2", label: "Perusahaan 2" },
                                    ]}
                                />
                                <ControlledReactSelect
                                    control={control}
                                    name="bahanB3Id"
                                    label="Filter Bahan B3"
                                    options={[
                                        { value: "b3-1", label: "B3 1" },
                                        { value: "b3-2", label: "B3 2" },
                                    ]}
                                />
                            </div>
                            <CustomDataGrid
                                data={stokPerPeriodData?.data || []}
                                columns={columnsStokPerPeriod}
                                rowCount={stokPerPeriodData?.total || 0}
                                isLoading={isLoadingStokPerPeriod}
                                pageSize={pageSize}
                                setPageSize={setPageSize}
                                page={page}
                                setPage={setPage}
                                clientPagination
                            />
                        </Tab>
                    </Tabs>
                </CardBody>
            </Card>

            <Modal isOpen={isOpenModal} onClose={handleCloseModal}>
                <ModalContent>
                    <ModalHeader>Request Stok</ModalHeader>
                    <ModalBody>
                        <form onSubmit={handleSubmit(onSubmitRequest)}>
                            <ControlledReactSelect
                                    control={control}
                                    name="bahanB3Id"
                                    label="Pilih Bahan B3"
                                    options={bahanB3Options || []}
                                />
                            <ControlledReactSelect
                                control={control}
                                name="companyId"
                                label="Pilih Perusahaan"
                                options={allCompanies || []}
                            />
                            <ControlledInput
                                {...register("stokRequest")}
                                control={control}
                                type="number"
                                placeholder="Jumlah Stok (kg)"
                                label="Jumlah Stok (kg)" name="stokRequest"
                                required
                                className="input"
                            />
                            <div className="flex justify-end gap-3 mt-4">
                                <Button type="submit" color="primary">
                                    Submit
                                </Button>
                                <Button onPress={handleCloseModal} variant="faded" color="danger">
                                    Batal
                                </Button>
                            </div>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>

            <Modal isOpen={isOpenUpdateModal} onClose={handleCloseUpdateModal}>
                <ModalContent>
                    <ModalHeader>Request Update Stok</ModalHeader>
                    <ModalBody>
                        <form onSubmit={handleSubmit(onSubmitUpdateRequest)}>
                            {/* CAS Number */}
                            <ControlledInput
                                {...register("casNumber")}
                                control={control}
                                type="text"
                                placeholder="CAS Number"
                                label="CAS Number"
                                name="casNumber"
                                readOnly
                                className="input"
                                disabled= {true}
                            />
                            {/* Nama Bahan B3 */}
                            <ControlledInput
                                {...register("bahanB3Name")}
                                control={control}
                                type="text"
                                placeholder="Nama Bahan B3"
                                label="Nama Bahan B3"
                                name="bahanB3Name"
                                readOnly
                                className="input"
                                disabled= {true}
                            />
                            {/* Nama Perusahaan */}
                            <ControlledInput
                                {...register("companyName")}
                                control={control}
                                type="text"
                                placeholder="Nama Perusahaan"
                                label="Nama Perusahaan"
                                name="companyName"
                                readOnly
                                className="input"
                                disabled= {true}
                            />
                            {/* Stok Saat Ini */}
                            <ControlledInput
                                {...register("existingStok")}
                                control={control}
                                type="number"
                                placeholder="Stok Saat Ini (kg)"
                                label="Stok Saat Ini (kg)"
                                name="existingStok"
                                readOnly
                                className="input"
                                disabled= {true}
                            />
                            {/* Stok yang Diminta */}
                            <ControlledInput
                                {...register("stokRequest")}
                                rules={{
                                    required: "Jumlah stok yang diminta harus diisi.",
                                    validate: (value) =>
                                        value !== 0 || "Jumlah stok tidak boleh 0.",
                                }}
                                control={control}
                                type="number"
                                placeholder="Jumlah Stok yang Diminta (kg)"
                                label="Request Update Stok (kg)"
                                name="stokRequest"
                                required
                                className="input"
                            />
                            {/* Notes */}
                            <ControlledInput
                                {...register("notes")}
                                rules={{
                                    required: "Notes harus diisi.",
                                }}
                                control={control}
                                type="text"
                                placeholder="Catatan Tambahan"
                                label="Notes"
                                name="notes"
                                className="input"
                            />
                            {/* Pending Request Flag */}
                            {selectedB3?.hasPendingRequest && (
                                <p className="text-red-500 text-sm">
                                    Ada permintaan pembaruan stok yang masih menunggu persetujuan untuk bahan B3 ini.
                                </p>
                            )}
                            {/* Buttons */}
                            <div className="flex justify-end gap-3 mt-4">
                                <Button type="submit" color="primary">
                                    Submit
                                </Button>
                                <Button onPress={handleCloseUpdateModal} variant="faded" color="danger">
                                    Batal
                                </Button>
                            </div>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>


        </div>
        </RootAdmin>

    );
}
