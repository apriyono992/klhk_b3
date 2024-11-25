import React, { useState } from "react";
import { Card, CardBody, CardHeader, Divider, Button, Tabs, Tab, Chip } from "@nextui-org/react";
import CustomDataGrid from "../../../../components/elements/CustomDataGrid";
import { getFetcher, postFetcher, patchFetcher, getSelectFetcher } from "../../../../services/api";
import useSWR from "swr";
import ControlledInput from "../../../../components/elements/ControlledInput";  // Import ControlledInput component
import { useForm, Controller } from "react-hook-form";
import ControlledReactSelect from "../../../../components/elements/ControlledReactSelect";
import { BarChart } from "@mui/x-charts/BarChart";
import RootAdmin from "../../../../components/layouts/RootAdmin";
import toast from "react-hot-toast";
import useAuth from "../../../../hooks/useAuth";
import ReactSelect from "../../../../components/elements/ReactSelect";
import { set } from "lodash";
import RoleAccess from "../../../../enums/roles";

export default function IndexAdminStokB3() {
    const {user, roles} = useAuth();
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [selectedTab, setSelectedTab] = useState("request");
    const [selectedChildTab, setSelectedChildTab] = useState("stokperCompany");
    const [loadingIds, setLoadingIds] = useState([]); // Track loading states for multiple rows
    const [selectedCompanyIdStok, setselectedCompanyIdStok] = useState(null); // Menyimpan perusahaan yang dipilih
    // State untuk pilihan dropdown
    const [selectedB3IdStok, setSelectedB3IdStok] = useState(null);

    const { control, watch } = useForm({
        defaultValues: {
            startDate: "",
            endDate: "",
            bahanB3Id: null,
            companyId: [], // Default ke array kosong
        },
    });
    
    const filters = watch();

    // Fetch data
    const { data: requestData, isLoading: isLoadingRequest, mutate: mutateRequestData } = useSWR(
        selectedTab === "request" ? `/api/data-bahan-b3-company/search-pending-requests?statusApproval=false` : null,
        getFetcher
    );

    const { data: stokCurrentData, isLoading: isLoadingCurrentStok, mutate: mutateStokCurrentData } = useSWR(
        selectedTab === "current" ? `/api/data-bahan-b3-company/search` : null,
        getFetcher
    );
  
    const { data: stokByPeriodData, isLoading: isLoadingStokByPeriod, mutate: mutateStokByPeriodData } = useSWR(
        selectedTab === "period" && filters.startDate && filters.endDate
            ? `/api/data-bahan-b3-company/search-period?startDate=${filters.startDate}&endDate=${filters.endDate}&companyId=${filters.companyId?.join(",") || ""}&dataBahanB3Id=${filters.bahanB3Id || ""}`
            : null,
        getFetcher
    );

    const isSuperAdmin = roles.includes(RoleAccess.SUPER_ADMIN); // Cek apakah user adalah Super Admin
    const { data: allCompanies } = useSWR(
        isSuperAdmin
            ? `/api/company/search-company` // Jika Super Admin, fetch semua perusahaan
            : `/api/company/search-company?ids=${user.companies.map((company) => company.id).join(",")}`, // Jika bukan Super Admin, fetch perusahaan sesuai IDs
        getSelectFetcher
    );

    // Grafik Data untuk Tab "Stok Per Periode"
    const barChartData = stokByPeriodData?.data?.map((item) => ({
        x: item.date,
        y: item.totalStok,
    })) || [];

    const columnsStokByType = [
    { field: "casNumber", headerName: "CAS Number Bahan Kimia", flex: 1 },
    { field: "namaBahanKimia", headerName: "Nama Bahan Kimia", flex: 1 },
    { field: "tipeBahan", headerName: "Tipe Bahan", flex: 1 },
    { field: "totalStok", headerName: "Total Stok (kg)", flex: 1 },
    ];

    // Kolom DataGrid
    const columnsRequest = [
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
            {
                field: "action",
                headerName: "Aksi",
                renderCell: (params) =>{
                const isLoading = loadingIds.includes(params.row.id); // Check if this row is loading
                    return (
                    <Button
                        size="sm"
                        color={isLoading ? "secondary" : "primary"} // Change color if loading
                        disabled={isLoading} // Disable button if loading
                        onPress={() => handleApproveRequest(params.row.id)}
                    >
                        {isLoading ? "Loading..." : "Approve"} {/* Show loading text */}
                    </Button>
                    );
                },
                sortable: false,
                filterable: false,
            },
    ];

    const columnsStok = [
        { field: "casNumber", headerName: "CAS Number Bahan Kimia", flex: 1 ,
            valueGetter: (row, value) =>  value.dataBahanB3.casNumber || 'N/A'},
        { field: "bahanB3Name", headerName: "Nama Bahan Kimia", flex: 1 ,
            valueGetter: (row, value) =>  value.dataBahanB3.namaBahanKimia || 'N/A'},
        { field: "companyName", headerName: "Perusahaan", flex: 1,
            valueGetter: (row, value) =>  value.company.name || 'N/A' },
        { field: "stok", headerName: "Stok Saat Ini (kg)", flex: 1, 
            
            valueGetter: (row, value) =>  value.stokB3 || 'N/A'
        },
    ];

    const handleApproveRequest = async (id) => {
        try {
            setLoadingIds((prev) => [...prev, id]); // Add the current row ID to the loading state
            const payload = {
                requestId: id,
                approvedById: user.id,
            };
            await patchFetcher(`/api/data-bahan-b3-company/approve`,id, payload);
        } catch (error) {
            toast.error("Gagal mengapprove request:", error);
        }finally {
            setLoadingIds((prev) => prev.filter((loadingId) => loadingId !== id)); // Remove ID from loading state
            mutateRequestData(); // Refresh data
        }
    };

    const refreshData = async () => {
        try {
            toast.loading("Refreshing data...");
            await mutateRequestData(); // Refresh pending requests
            await mutateStokCurrentData(); // Refresh current stock data
            await mutateStokByPeriodData(); // Refresh stock by period data
            toast.dismiss(); // Remove loading toast
            toast.success("Data refreshed successfully!");
        } catch (error) {
            toast.dismiss();
            toast.error("Failed to refresh data.");
        }
    };

    // Mengelompokkan stok berdasarkan jenis B3
    const stokByType = stokCurrentData?.data?.reduce((acc, item) => {
        const bahanId = item.dataBahanB3Id;
        if (!acc[bahanId]) {
        acc[bahanId] = {
            bahanB3Id: bahanId,
            namaBahanKimia: item.dataBahanB3.namaBahanKimia,
            tipeBahan: item.dataBahanB3.tipeBahan,
            casNumber: item.dataBahanB3.casNumber,
            totalStok: 0,
        };
        }
        acc[bahanId].totalStok += item.stokB3;
        return acc;
    }, {});
    
    // Konversi hasil objek menjadi array dan tambahkan id unik
    const stokByTypeData = stokByType
        ? Object.values(stokByType).map((item, index) => ({
            ...item,
            id: item.bahanB3Id || `stok-${index}`, // Gunakan bahanB3Id atau fallback ke index
        }))
    : [];

    const companyOptions = stokCurrentData?.data?.reduce((uniqueCompanies, item) => {
        if (!uniqueCompanies.some((company) => company.value === item.company.id)) {
            uniqueCompanies.push({
                value: item.company.id,
                label: item.company.name,
            });
        }
        return uniqueCompanies;
    }, []);

    // Filter data berdasarkan perusahaan yang dipilih
    const filteredData = selectedCompanyIdStok
        ? stokCurrentData?.data?.filter((item) => item.company.id === selectedCompanyIdStok.value)
        : [];

    // Data untuk grafik
    const chartData = filteredData.map((item) => ({
        name: item.dataBahanB3.namaBahanKimia,
        stok: item.stokB3,
    }));

    // Opsi jenis B3 berdasarkan data yang ada
    const b3Options = stokCurrentData?.data.reduce((uniqueB3, item) => {
        if (!uniqueB3.some((b3) => b3.value === item.dataBahanB3.id)) {
            uniqueB3.push({
                value: item.dataBahanB3.id,
                label: item.dataBahanB3.namaBahanKimia,
            });
        }
        return uniqueB3;
    }, []);

    console.log('b3Options', b3Options);
    console.log('comapny', companyOptions);

    // Filter data berdasarkan jenis B3 yang dipilih
    const filteredB3Data = selectedB3IdStok
        ? stokCurrentData?.data.filter((item) => item.dataBahanB3.id === selectedB3IdStok.value)
        : [];

    // Data untuk grafik stok per perusahaan
    const chartDataB3 = filteredB3Data?.reduce((result, item) => {
        const existingCompany = result?.find((data) => data.name === item.company.name);
        if (existingCompany) {
            existingCompany.stok += item.stokB3; // Mengakumulasikan stok
        } else {
            result.push({
                name: item.company.name,
                stok: item.stokB3,
            });
        }
        return result;
    }, []);
    
    return (
        <RootAdmin>
                    <div>
            <Card className="w-full mt-5">
                <CardHeader className="flex items-center gap-3">
                    <p className="text-md">Admin Stok B3</p>
                    <Button
                        size="sm"
                        color="primary"
                        onPress={refreshData} // Call refreshData function
                    >
                        Refresh Data
                    </Button>
                </CardHeader>
                <Divider />
                <CardBody>
                    <Tabs aria-label="Admin Tabs" onSelectionChange={(key) => setSelectedTab(key)}>
                        <Tab title="Request Stok" key="request">
                            <CustomDataGrid
                                data={requestData || []}
                                columns={columnsRequest}
                                rowCount={requestData?.total || 0}
                                isLoading={isLoadingRequest}
                                pageSize={pageSize}
                                setPageSize={setPageSize}
                                page={page}
                                setPage={setPage}
                            />
                        </Tab>
                        <Tab title="Stok Saat Ini" key="current">
                            <Tabs aria-label="Admin Tabs" onSelectionChange={(key) => setSelectedChildTab(key)}>
                                <Tab title="Stok per Perusahaan" key="stokperCompany">
                                    {/* Grafik Stok per Perusahaan */}
                                    <div>
                                        {/* Dropdown Pilihan Perusahaan */}
                                        <ReactSelect
                                            data={companyOptions}
                                            isLoading={false}
                                            error={null}
                                            value={selectedCompanyIdStok}
                                            onChange={setselectedCompanyIdStok}
                                            defaultValue={null}
                                            label="Pilih Perusahaan"
                                            isMulti={false}
                                        />
                                        <div className="mb-4"></div>
                                        {/* Grafik Stok B3 */}
                                        <div
                                            style={{
                                                marginBottom: "24px",
                                                padding: "12px",
                                                border: "1px solid #e0e0e0",
                                                borderRadius: "8px",
                                                backgroundColor: "#f9f9f9",
                                            }}
                                        >
                                            <h4
                                                style={{
                                                    fontSize: "1.125rem",
                                                    marginBottom: "12px",
                                                    borderBottom: "1px solid #ddd",
                                                    paddingBottom: "6px",
                                                }}
                                            >
                                                {selectedCompanyIdStok
                                                    ? `Grafik Stok B3 untuk ${selectedCompanyIdStok.label}`
                                                    : "Pilih perusahaan untuk melihat grafik"}
                                            </h4>
                                            {chartData.length > 0 ? (
                                                <div style={{ width: "100%", maxWidth: "500px", height: "300px", margin: "0 auto" }}>
                                                    <BarChart
                                                        xAxis={[
                                                            {
                                                                scaleType: "band",
                                                                data: chartData.map((item) => item.name),
                                                            },
                                                        ]}
                                                        series={[
                                                            {
                                                                data: chartData.map((item) => item.stok),
                                                                label: "Stok (kg)",
                                                            },
                                                        ]}
                                                        width={500}
                                                        height={300}
                                                    />
                                                </div>
                                            ) : (
                                                <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#888" }}>
                                                    Tidak ada data untuk ditampilkan.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {/* Stok per Perusahaan */}
                                    <h4 className="mb-2">Stok per Perusahaan</h4>
                                    {/* Stok Berdasarkan Jenis B3 */}
                                    <Divider className="my-4" />
                                    <CustomDataGrid
                                        data={stokCurrentData?.data || []}
                                        columns={columnsStok}
                                        rowCount={stokCurrentData?.totalCount || 0}
                                        isLoading={isLoadingCurrentStok}
                                        pageSize={pageSize}
                                        setPageSize={setPageSize}
                                        page={page}
                                        setPage={setPage}
                                    />
                                </Tab>
                                <Tab title="Stok per Jenis B3" key="stokPerB3">
                                <div>
                                {/* Dropdown Pilihan Jenis B3 */}
                                <ReactSelect
                                    data={b3Options}
                                    isLoading={false}
                                    error={null}
                                    value={selectedB3IdStok}
                                    onChange={setSelectedB3IdStok}
                                    defaultValue={null}
                                    label="Pilih Jenis B3"
                                    isMulti={false}
                                />
                                <div className="mb-4"></div>
                                {/* Grafik Stok B3 di Setiap Perusahaan */}
                                <div
                                    style={{
                                        marginBottom: "24px",
                                        padding: "12px",
                                        border: "1px solid #e0e0e0",
                                        borderRadius: "8px",
                                        backgroundColor: "#f9f9f9",
                                    }}
                                >
                                    <h4
                                        style={{
                                            fontSize: "1.125rem",
                                            marginBottom: "12px",
                                            borderBottom: "1px solid #ddd",
                                            paddingBottom: "6px",
                                        }}
                                    >
                                        {selectedB3IdStok
                                            ? `Grafik Stok untuk Jenis B3 "${selectedB3IdStok.label}"`
                                            : "Pilih jenis B3 untuk melihat grafik"}
                                    </h4>
                                    {chartDataB3.length > 0 ? (
                                        <div
                                            style={{
                                                width: "100%",
                                                maxWidth: "500px",
                                                height: "300px",
                                                margin: "0 auto",
                                            }}
                                        >
                                            <BarChart
                                                xAxis={[
                                                    {
                                                        scaleType: "band",
                                                        data: chartDataB3.map((item) => item.name),
                                                    },
                                                ]}
                                                series={[
                                                    {
                                                        data: chartDataB3.map((item) => item.stok),
                                                        label: "Stok (kg)",
                                                    },
                                                ]}
                                                width={500}
                                                height={300}
                                            />
                                        </div>
                                    ) : (
                                        <p
                                            style={{
                                                textAlign: "center",
                                                fontSize: "0.875rem",
                                                color: "#888",
                                            }}
                                        >
                                            Tidak ada data untuk ditampilkan.
                                        </p>
                                    )}
                                </div>
                            </div>
                            <CustomDataGrid
                                data={stokByTypeData || []}
                                columns={columnsStokByType}
                                getRowId={(row) => row.bahanB3Id} // Gunakan bahanB3Id sebagai id unik
                                rowCount={stokByTypeData?.length || 0}
                                isLoading={isLoadingCurrentStok}
                                pageSize={pageSize}
                                setPageSize={setPageSize}
                                page={page}
                                setPage={setPage}
                            />
                                </Tab>
                            </Tabs> 
                        </Tab>
                        <Tab title="Stok Per Periode" key="period" >
                        <form className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <ControlledInput
                                name="startDate"
                                label="Tanggal Mulai"
                                type="date"
                                control={control}
                                isRequired
                                rules={{
                                    required: "Tanggal Mulai harus diisi.",
                                }}
                            />
                            <ControlledInput
                                name="endDate"
                                label="Tanggal Selesai"
                                type="date"
                                control={control}
                                isRequired
                                rules={{
                                    required: "Tanggal Selesai harus diisi.",
                                }}
                            />
                            <ControlledReactSelect
                                name="companyId"
                                label="Perusahaan"
                                control={control}
                                options={allCompanies}
                                isMulti
                                rules={{
                                    required: "Perusahaan harus dipilih.",
                                }}
                            />
                            {/* <ControlledReactSelect
                                name="bahanB3Id"
                                label="Bahan B3"
                                control={control}
                                options={[
                                    { value: "b3-1", label: "B3 1" },
                                    { value: "b3-2", label: "B3 2" },
                                ]}
                                rules={{
                                    required: "Bahan B3 harus dipilih.",
                                }}
                            /> */}
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
