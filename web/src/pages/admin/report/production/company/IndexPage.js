import {Button, Card, CardBody, Tab, Tabs, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from "@nextui-org/react";
import RootAdmin from "../../../../../components/layouts/RootAdmin";
import { Controller } from 'react-hook-form';
import TableHistory from "../../../../../components/fragments/admin/report/TableHistory";
import { useState, useEffect } from "react";
import CustomDataGrid from "../../../../../components/elements/CustomDataGrid";
import useSWR from "swr";
import { getFetcher, getSelectFetcherPeriod, getSelectFetcher } from "../../../../../services/api";
import ButtonModalAlert from "../../../../../components/elements/ButtonModalAlert";
import { ArrowPathIcon, PlusIcon } from "@heroicons/react/24/outline";
import useProduction from "../../../../../hooks/report/production/useProduction";
import ControlledReactSelect from "../../../../../components/elements/ControlledReactSelect";
import ReactSelect from "../../../../../components/elements/ReactSelect";
import ControlledInput from "../../../../../components/elements/ControlledInput";
import { month, reportProductType } from "../../../../../services/enum";
import { monthNames } from "../../../../../services/helpers";
import ControlledReactQuill from "../../../../../components/elements/ControlledReactQuill";
import toast from 'react-hot-toast';
import useAuth from "../../../../../hooks/useAuth";
import RoleAccess from "../../../../../enums/roles";

export default function IndexPage() {
    const { user, roles } = useAuth();
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const { data: dataPeriod } = useSWR(`/api/period/report-actives`, getFetcher);
    const [availableMonths, setAvailableMonths] = useState([]);
    const [availableYears, setAvailableYears] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null); // Perusahaan yang dipilih
    const [selectedPeriod, setSelectedPeriod] = useState(null); // Periode yang dipilih
    const isSuperAdmin = roles.includes(RoleAccess.SUPER_ADMIN); // Cek apakah user adalah Super Admin
    const { data, isLoading, mutate } = useSWR(
        `/api/pelaporan-b3-dihasilkan/search?returnAll=true${
            selectedCompany ? `&companyId=${selectedCompany}` : ''
        }${selectedPeriod ? `&periodId=${selectedPeriod}` : ''}`,
        getFetcher
    );
    const { data: dataCompany, isLoading: isLoadingCompany } = useSWR(
        isSuperAdmin
            ? `/api/company/search-company` // Jika Super Admin, fetch semua perusahaan
            : `/api/company/search-company?ids=${user.companies?.map((company) => company.id).join(",")}`, // Jika bukan Super Admin, fetch perusahaan sesuai IDs
        getSelectFetcher
    );
    const periodOptions = dataPeriod?.data?.map((item) => ({ value: item.id, label: item.name }));
    // const { data: historyRequestData, isLoading: isLoadingHistoryRequest } = useSWR(
    //     isSuperAdmin
    //         ? `/api/data-bahan-b3-company/search-pending-requests` // Jika Super Admin, fetch semua perusahaan
    //         : `/api/data-bahan-b3-company/search-pending-requests?companyId=${user.companies.map((company) => company.id).join(",")}`, // Jika bukan Super Admin, fetch perusahaan sesuai IDs
    //     getFetcher
    // );

    const { data: dataMaterial, isLoading: isLoadingMaterial } = useSWR(`/api/data-master/bahan-b3`, getFetcher);
    const { 
        isEdit,
        onCloseForm,
        onSubmitFinalize,
        onSubmitForm, 
        columnsTableActivePeriod,
        columnsTableHistory,
        materialType,
        setMaterialType,
        modalForm: { onOpenModalForm, isOpenModalForm, onOpenChangeModalForm },
        hookForm: { register, control, handleSubmit, formState: { errors, isSubmitting, dirtyFields } },  watch
    } = useProduction({ mutate });
    const periodId = watch('periodId'); // Pantau perubahan nilai periodId

    useEffect(() => {
        if (periodId) {
            const selectedPeriod =dataPeriod && Array.isArray(dataPeriod?.data) 
            ? dataPeriod?.data?.find(period => period.id === periodId)
            : null ;
            console.log(selectedPeriod, dataPeriod)
            if (selectedPeriod) {
                const startDate = new Date(selectedPeriod.startPeriodDate);
                const endDate = new Date(selectedPeriod.endPeriodDate);
    
                // Hitung tahun dalam rentang
                const yearsInRange = [];
                for (let year = startDate.getFullYear(); year <= endDate.getFullYear(); year++) {
                    yearsInRange.push({ value: year, label: String(year) }); // Tambahkan model {value, label}
                }
                setAvailableYears(yearsInRange);
    
                // Hitung bulan dalam rentang
                let monthsInRange = [];
                if (startDate.getFullYear() === endDate.getFullYear()) {
                    // Jika tahun yang sama
                    monthsInRange = monthNames
                        .slice(startDate.getMonth(), endDate.getMonth() + 1)
                        .map((name, index) => ({
                            value: startDate.getMonth() + index + 1,
                            label: name,
                        }));
                } else {
                    // Jika tahun berbeda, ambil semua bulan
                    monthsInRange = monthNames.map((name, index) => ({
                        value: index + 1,
                        label: name,
                    }));
                }
                console.log("Months in Range:", monthsInRange);
                console.log("Years in Range:", yearsInRange);
                setAvailableMonths(monthsInRange);
            } else {
                setAvailableYears([]);
                setAvailableMonths([]);
            }
        } else {
            setAvailableYears([]);
            setAvailableMonths([]);
        }
    }, [periodId]);

    return(
        <RootAdmin>
            <Card radius="sm">
                <CardBody>
                    <Tabs
                        color="primary"
                        variant="underlined"
                        aria-label="tabs"
                        classNames={{
                            tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                            cursor: "w-full",
                            tab: "max-w-fit px-1.5 h-12",
                            tabContent: "group-data-[selected=true]:font-semibold"
                        }}
                    >
                        <Tab key="1" title="Periode Aktif">
                            <div className="flex gap-2 mb-5">
                            <ReactSelect
                                data={isLoadingCompany || !dataCompany ? [] : dataCompany}
                                isLoading={isLoadingCompany} // Status loading
                                value={dataCompany && Array.isArray(dataCompany) 
                                    ? dataCompany.find((item) => item.value === selectedCompany) 
                                    : null} // Cek apakah dataCompany adalah array
                                onChange={(option) => {
                                    setSelectedCompany(option?.value || null); // Perbarui state perusahaan
                                }}
                                label="Perusahaan"
                                isMulti={false} // Single select
                            />
                            <ReactSelect
                                data={periodOptions || []} // Default ke array kosong jika tidak ada data
                                isLoading={!periodOptions?.length} // Status loading
                                value={periodOptions?.find((item) => item.value === selectedPeriod) || null} // Nilai yang dipilih
                                onChange={(option) => {
                                    setSelectedPeriod(option?.value || null); // Perbarui state periode
                                    console.log('Selected Period:', option?.value); // Debug log
                                }}
                                label="Periode"
                                isMulti={false} // Single select
                            />

                            </div>
                            <div className="flex gap-2 mb-5">

                                <Button onPress={onOpenModalForm} size="sm" color="primary" startContent={<PlusIcon className="size-4 stroke-2"/>}>Tambah</Button>
                                <div className="flex gap-2 mb-5">
                                    <ButtonModalAlert
                                        buttonTitle={
                                            <>
                                                <ArrowPathIcon className="size-4" /> Finalisasi Laporan
                                            </>
                                        }
                                        buttonColor="warning"
                                        modalIcon="warning"
                                        modalHeading="Apakah anda yakin?"
                                        modalDescription="Pastikan laporan sudah sesuai dan lengkap"
                                        buttonSubmitText="Submit"
                                        buttonCancelText="Batal"
                                        onSubmit={() => onSubmitFinalize(selectedCompany, selectedPeriod)} // Gunakan fungsi anonim
                                        isDisabled={!selectedCompany || !selectedPeriod} // Disable jika salah satu kosong
                                    />
                                </div>

                            </div>
                            <div className="h-[500px]">
                                <CustomDataGrid
                                    data={data?.data}
                                    rowCount={data?.total || 0}
                                    isLoading={isLoading}
                                    columns={columnsTableActivePeriod}
                                    pageSize={pageSize}
                                    setPageSize={setPageSize}
                                    page={page}
                                    setPage={setPage}
                                    initialState={{
                                        columns: {
                                            columnVisibilityModel: {
                                                prosesProduksi: false,
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </Tab>
                        <Tab key="2" title="Riwayat">
                            <TableHistory columns={columnsTableHistory} api="/api/pelaporan-b3-dihasilkan/search" />
                        </Tab>
                    </Tabs>
                </CardBody>
            </Card>
            
            <Modal size="3xl" scrollBehavior="inside" isOpen={isOpenModalForm} onOpenChange={onOpenChangeModalForm} onClose={onCloseForm} isDismissable={false} isKeyboardDismissDisabled={false}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>{isEdit ? 'Ubah' : 'Tambah'} Produksi Jenis B3</ModalHeader>
                            <ModalBody>
                                <form onSubmit={handleSubmit(onSubmitForm)}>
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3 mb-6'>  
                                        <ControlledReactSelect
                                            control={control} 
                                            label="Perusahaan" 
                                            name="companyId" 
                                            isLoading={isLoadingCompany} 
                                            options={dataCompany} 
                                            isRequired={true} 
                                        />
                                        <ControlledReactSelect
                                            control={control} 
                                            label="Periode" 
                                            name="periodId" 
                                            options={periodOptions} 

                                            isRequired={true} 
                                        />
                                        {/* <Select
                                            {...register('periodId', { required: 'Periode wajib dipilih' })} // Menambahkan validasi dengan pesan kesalahan
                                            variant="faded"
                                            label="Periode"
                                            labelPlacement="outside"
                                            placeholder="Pilih..."
                                            color={errors?.periodId ? 'danger' : 'default'}
                                            onChange={(e) => setSelectedPeriodId(e.target.value)}
                                            isInvalid={!!errors?.periodId} // Memastikan nilai boolean
                                            errorMessage={errors?.periodId?.message} // Menampilkan pesan kesalahan
                                        >
                                            {periodOptions?.map((item) => (
                                                <SelectItem key={item.value} value={item.value}>
                                                    {item.label}
                                                </SelectItem>
                                            ))}
                                        </Select> */}
                                        <ControlledReactSelect
                                            control={control} 
                                            label="Bulan" 
                                            name="bulan" 
                                            options={availableMonths} 
                                            isRequired={true} 
                                            isLoading={!availableMonths.length} // Tampilkan loading jika belum ada opsi
                                        />
                                        <ControlledReactSelect
                                            control={control} 
                                            label="Tahun" 
                                            name="tahun" 
                                            options={availableYears} 
                                            isRequired={true} 
                                            isLoading={!availableMonths.length} // Tampilkan loading jika belum ada opsi
                                        />
                                        <Controller
                                            name="tipeProduk"
                                            control={control}
                                            render={({ field, fieldState }) => (
                                                <Select 
                                                    {...field}
                                                    value={field.value || ''}
                                                    isRequired
                                                    variant="faded" 
                                                    label="Tipe Produk"
                                                    labelPlacement="outside"
                                                    placeholder="Pilih..."
                                                    onChange={(e) => {
                                                        field.onChange(e.target.value)
                                                        setMaterialType(e.target.value)
                                                    }}
                                                    color={fieldState.error ? 'danger' : 'default'}
                                                    isInvalid={fieldState.error} 
                                                    errorMessage={fieldState.error && fieldState.error.message}
                                                >
                                                    {reportProductType.map((item) => (
                                                        <SelectItem key={item}>{item}</SelectItem>
                                                    ))}
                                                </Select> 
                                            )}
                                        />
                                        {materialType === 'Bahan Berbahaya dan Beracun' && (
                                            <ControlledReactSelect 
                                                control={control} 
                                                label="Jenis B3" 
                                                name="dataBahanB3Id" 
                                                isLoading={isLoadingMaterial} 
                                                options={dataMaterial?.data.map(item => ({ value: item.id, label: `${item.casNumber} - ${item.namaBahanKimia}` }))} 
                                                isRequired={true} 
                                            />
                                        )}
                                        
                                        <ControlledInput control={control} label="Jumlah Produksi" name="jumlahB3Dihasilkan" type="number" isRequired={true} />
                                        <div className="col-span-2">
                                            <ControlledReactQuill control={control} label="Proses Produksi" name="prosesProduksi" />
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-1'>
                                        <Button isLoading={isSubmitting} isDisabled={isSubmitting || (isEdit && Object.keys(dirtyFields).length === 0)} type='submit' color='primary'>{isEdit ? 'Simpan' : 'Tambah'}</Button>
                                        <Button isDisabled={isSubmitting} color='danger' variant='faded' onPress={onClose}>Batal</Button>
                                    </div>
                                </form>
                            </ModalBody>
                            <ModalFooter>

                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </RootAdmin>
    )
}
