import React, { useState } from "react";
import { Card, CardBody, CardHeader, Divider, Button, Tabs, Tab } from "@nextui-org/react";
import CustomDataGrid from "../../../../components/elements/CustomDataGrid";
import { getFetcher } from "../../../../services/api";
import useSWR from "swr";
import { useForm, Controller } from "react-hook-form";
import ControlledReactSelect from "../../../../components/elements/ControlledReactSelect";
import { BarChart } from "@mui/x-charts/BarChart";
import RootAdmin from "../../../../components/layouts/RootAdmin";

export default function IndexAdminStokB3() {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [selectedTab, setSelectedTab] = useState("request");

    const { control, watch } = useForm({
        defaultValues: {
            startDate: "",
            endDate: "",
            bahanB3Id: null,
            companyId: null,
        },
    });

    const filters = watch();

    // Fetch data
    const { data: requestData, isLoading: isLoadingRequest } = useSWR(
        selectedTab === "request" ? `/api/data-bahan-b3-company/pending-requests` : null,
        getFetcher
    );

    const { data: stokCurrentData, isLoading: isLoadingCurrentStok } = useSWR(
        selectedTab === "current" ? `/api/data-bahan-b3-company/search` : null,
        getFetcher
    );

    const { data: stokByPeriodData, isLoading: isLoadingStokByPeriod } = useSWR(
        selectedTab === "period" && filters.startDate && filters.endDate
            ? `/api/data-bahan-b3-company/search-period?startDate=${filters.startDate}&endDate=${filters.endDate}&companyId=${filters.companyId || ""}&bahanB3Id=${filters.bahanB3Id || ""}`
            : null,
        getFetcher
    );

    // Grafik Data untuk Tab "Stok Per Periode"
    const barChartData = stokByPeriodData?.data?.map((item) => ({
        x: item.date,
        y: item.totalStok,
    })) || [];

    // Kolom DataGrid
    const columnsRequest = [
        { field: "bahanB3Name", headerName: "Nama B3", flex: 1 },
        { field: "companyName", headerName: "Perusahaan", flex: 1 },
        { field: "requestedStok", headerName: "Jumlah Request (kg)", flex: 1 },
        { field: "status", headerName: "Status", flex: 1 },
        {
            field: "action",
            headerName: "Aksi",
            renderCell: (params) => (
                <Button size="sm" color="primary" onPress={() => handleApproveRequest(params.row.id)}>
                    Approve
                </Button>
            ),
            sortable: false,
            filterable: false,
        },
    ];

    const columnsStok = [
        { field: "bahanB3Name", headerName: "Nama B3", flex: 1 },
        { field: "companyName", headerName: "Perusahaan", flex: 1 },
        { field: "stok", headerName: "Stok Saat Ini (kg)", flex: 1 },
    ];

    const handleApproveRequest = async (id) => {
        try {
            await fetch(`/api/admin/stok-b3/requests/${id}/approve`, { method: "POST" });
        } catch (error) {
            console.error("Gagal mengapprove request:", error);
        }
    };

    return (
        <RootAdmin>
                    <div>
            <Card className="w-full mt-5">
                <CardHeader>
                    <p className="text-md">Admin Stok B3</p>
                </CardHeader>
                <Divider />
                <CardBody>
                    <Tabs aria-label="Admin Tabs" value={selectedTab} onValueChange={setSelectedTab}>
                        <Tab title="Request Stok" value="request">
                            <CustomDataGrid
                                data={requestData?.data || []}
                                columns={columnsRequest}
                                rowCount={requestData?.total || 0}
                                isLoading={isLoadingRequest}
                                pageSize={pageSize}
                                setPageSize={setPageSize}
                                page={page}
                                setPage={setPage}
                            />
                        </Tab>
                        <Tab title="Stok Saat Ini" value="current">
                            <CustomDataGrid
                                data={stokCurrentData?.data || []}
                                columns={columnsStok}
                                rowCount={stokCurrentData?.total || 0}
                                isLoading={isLoadingCurrentStok}
                                pageSize={pageSize}
                                setPageSize={setPageSize}
                                page={page}
                                setPage={setPage}
                            />
                        </Tab>
                        <Tab title="Stok Per Periode" value="period">
                            <form className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Controller
                                    name="startDate"
                                    control={control}
                                    render={({ field }) => (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Tanggal Mulai</label>
                                            <input
                                                type="date"
                                                {...field}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                    )}
                                />
                                <Controller
                                    name="endDate"
                                    control={control}
                                    render={({ field }) => (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Tanggal Selesai</label>
                                            <input
                                                type="date"
                                                {...field}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                    )}
                                />
                                <ControlledReactSelect
                                    control={control}
                                    name="companyId"
                                    label="Perusahaan"
                                    options={[
                                        { value: "company1", label: "Perusahaan 1" },
                                        { value: "company2", label: "Perusahaan 2" },
                                    ]}
                                />
                                <ControlledReactSelect
                                    control={control}
                                    name="bahanB3Id"
                                    label="Bahan B3"
                                    options={[
                                        { value: "b3-1", label: "B3 1" },
                                        { value: "b3-2", label: "B3 2" },
                                    ]}
                                />
                            </form>
                            <BarChart
                                xAxis={[{ scaleType: "band", data: barChartData.map((item) => item.x) }]}
                                series={[{ data: barChartData.map((item) => item.y), label: "Stok B3 (kg)" }]}
                            />
                            <CustomDataGrid
                                data={stokByPeriodData?.data || []}
                                columns={columnsStok}
                                rowCount={stokByPeriodData?.total || 0}
                                isLoading={isLoadingStokByPeriod}
                                pageSize={pageSize}
                                setPageSize={setPageSize}
                                page={page}
                                setPage={setPage}
                            />
                        </Tab>
                    </Tabs>
                </CardBody>
            </Card>
        </div>
        </RootAdmin>

    );
}
