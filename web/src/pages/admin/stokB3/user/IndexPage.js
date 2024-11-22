import React, { useState } from "react";
import { Card, CardBody, CardHeader, Divider, Button, Modal, ModalContent, ModalBody, ModalFooter, ModalHeader } from "@nextui-org/react";
import CustomDataGrid from "../../../../components/elements/CustomDataGrid";
import { getFetcher, getSelectFetcher } from "../../../../services/api";
import { useForm } from "react-hook-form";
import { Tabs, Tab } from "@nextui-org/react";
import useSWR from "swr";
import ControlledReactSelect from "../../../../components/elements/ControlledReactSelect";
import RootAdmin from "../../../../components/layouts/RootAdmin";
import ControlledInput from "../../../../components/elements/ControlledInput";
import toast from 'react-hot-toast';

export default function IndexUserStokB3() {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [selectedTab, setSelectedTab] = useState("current");
    const [isOpenModal, setIsOpenModal] = useState(false);

    const { control, register, handleSubmit, reset } = useForm();
    const { data: currentStokData, isLoading: isLoadingCurrentStok } = useSWR(`/api/user/stok-b3/all`, getFetcher); // Fetch stok B3
    const { data: historyRequestData, isLoading: isLoadingHistoryRequest } = useSWR(`/api/user/stok-b3/history`, getFetcher); // Fetch riwayat request
    const { data: stokPerPeriodData, isLoading: isLoadingStokPerPeriod } = useSWR(`/api/user/stok-b3/periode`, getFetcher); // Fetch stok per periode
    const { data: companyOptions, isLoading: isLoadingCompanyOptions } = useSWR(`/api/company/search-company`, getSelectFetcher); // Fetch company options
    const { data: bahanB3Options, isLoading: isLoadingBahanB3Options } = useSWR(`/api/data-master/bahan-b3`, getSelectFetcher); // Fetch Bahan B3 options

    console.log(companyOptions)
    console.log(bahanB3Options)

    const handleOpenModal = () => {
        setIsOpenModal(true);
    };

    const handleCloseModal = () => {
        reset();
        setIsOpenModal(false);
    };

        const onSubmitRequest = async (data) => {
            try {
                console.log(data)
                await fetch(`/api/data-bahan-b3-company/add-request`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });
                toast.success("Request stok berhasil diajukan!");
                handleCloseModal();
            } catch (error) {
                toast.error("Gagal mengajukan request stok");
            }
        };

    const columnsCurrent = [
        { field: "bahanB3Name", headerName: "Nama B3", flex: 1 },
        { field: "stok", headerName: "Stok (kg)", flex: 1 },
        { field: "companyName", headerName: "Perusahaan", flex: 1 },
        {
            field: "action",
            headerName: "Aksi",
            renderCell: (params) => (
                <Button size="sm" color="primary" onPress={() => console.log("Detail:", params.row.id)}>
                    Detail
                </Button>
            ),
        },
    ];

    const columnsHistoryRequest = [
        { field: "bahanB3Name", headerName: "Nama B3", flex: 1 },
        { field: "companyName", headerName: "Perusahaan", flex: 1 },
        { field: "requestedStok", headerName: "Jumlah Request (kg)", flex: 1 },
        { field: "status", headerName: "Status", flex: 1 },
    ];

    const columnsStokPerPeriod = [
        { field: "bahanB3Name", headerName: "Nama B3", flex: 1 },
        { field: "stok", headerName: "Stok (kg)", flex: 1 },
        { field: "companyName", headerName: "Perusahaan", flex: 1 },
        { field: "periode", headerName: "Periode", flex: 1 },
    ];

    return (
        <RootAdmin>
                    <div>
            <Card className="w-full mt-5">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <p className="text-md">Stok B3</p>
                        <Button size="sm" color="primary" onPress={handleOpenModal}>
                            Request Stok
                        </Button>
                    </div>
                </CardHeader>
                <Divider />
                <CardBody>
                    <Tabs aria-label="User Stok B3 Tabs" value={selectedTab} onValueChange={setSelectedTab}>
                        <Tab title="Stok Saat Ini" value="current">
                            <CustomDataGrid
                                data={currentStokData?.data || []}
                                columns={columnsCurrent}
                                rowCount={currentStokData?.total || 0}
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
                                data={historyRequestData?.data || []}
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
                                    options={companyOptions || []}
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
        </div>
        </RootAdmin>

    );
}
