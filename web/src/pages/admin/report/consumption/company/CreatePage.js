import React, {useEffect, useState} from 'react'
import RootAdmin from '../../../../../components/layouts/RootAdmin'
import { Button, Card, CardBody, Select, SelectItem, Spinner } from '@nextui-org/react'
import ControlledReactSelect from '../../../../../components/elements/ControlledReactSelect'
import { month } from '../../../../../services/enum'
import ControlledInput from '../../../../../components/elements/ControlledInput'
import { useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import { getFetcher, postFetcher,getSelectFetcher } from '../../../../../services/api'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import InlineEditSupplier from '../../../../../components/fragments/admin/report/consumption/InlineEditSupplier'
import { yupResolver } from '@hookform/resolvers/yup'
import { createReportConsumptionValidation } from '../../../../../services/validation'
import useAuth from "../../../../../hooks/useAuth";
import RoleAccess from "../../../../../enums/roles";
import { monthNames } from "../../../../../services/helpers";
import { dirtyInput, isResponseErrorObject } from '../../../../../services/helpers';

export default function CreatePage() {
    const { user, roles } = useAuth();
    const navigate = useNavigate()
    const [purchaseType, setPurchaseType] = useState('');
    const [availableMonths, setAvailableMonths] = useState([]);
    const [availableYears, setAvailableYears] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null); // Perusahaan yang dipilih
    const [selectedPeriod, setSelectedPeriod] = useState(null); // Periode yang dipilih
    const [dataRegistrasi, setDataRegistrasi] = useState([]); // Registrasi yang akan diperbarui setiap perusahaan berubah
    const [isLoadingRegistrasi, setIsLoadingRegistrasi] = useState(false);

    const { data: dataMaterial, isLoading: isLoadingMaterial } = useSWR(`/api/data-master/bahan-b3`, getFetcher);

    const { data: dataPeriod } = useSWR(`/api/period/report-actives`, getFetcher);
    const { register, control, watch, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(createReportConsumptionValidation) });
    const companyId = watch('companyId');
    const periodId = watch('periodId');
    const isSuperAdmin = roles.includes(RoleAccess.SUPER_ADMIN); // Cek apakah user adalah Super Admin
    const { data: dataCompany, isLoading: isLoadingCompany } = useSWR(
        isSuperAdmin
            ? `/api/company/search-company` // Jika Super Admin, fetch semua perusahaan
            : `/api/company/search-company?companyIds=${user.companies?.map((company) => company.companyId).join(",")}`, // Jika bukan Super Admin, fetch perusahaan sesuai IDs
        getSelectFetcher
    );
    
 // Fetch data registrasi setiap kali companyId berubah
    useEffect(() => {
        if (companyId) {
            setIsLoadingRegistrasi(true);
            getFetcher(`/api/registrasi/search?companyId=${companyId}&status=selesai`)
                .then((response) => {
                    setDataRegistrasi(response?.data || []);
                })
                .finally(() => {
                    setIsLoadingRegistrasi(false);
                });
        } else {
            setDataRegistrasi([]);
        }
    }, [companyId]);

    useEffect(() => {
        if (periodId) {
            const selectedPeriod =dataPeriod && Array.isArray(dataPeriod?.data) 
            ? dataPeriod?.data?.find(period => period.id === periodId)
            : null ;
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

    
    const periodOptions = dataPeriod?.data?.map((item) => ({ value: item.id, label: item.name }));

    async function onSubmitForm(data) {
        try {
            console.log(data);
            data.bulan = parseInt(data.bulan);
            data.tahun = parseInt(data.tahun);
            data.jumlahB3Digunakan = parseInt(data.jumlahB3Digunakan);
            data.jumlahPembelianB3 = parseInt(data.jumlahPembelianB3);
            await postFetcher(`/api/pelaporan-penggunaan-bahan-b3`, data);
            toast.success('Laporan konsumsi bahan b3 berhasil ditambah!');
            navigate(-1)
        } catch (error) {
            
        }
        console.log(data);
    }

    if (isLoadingCompany) {
        return (
            <RootAdmin>
                <div className="flex justify-center items-center h-screen">
                    <Spinner size="lg" />
                </div>
            </RootAdmin>
        );
    }

    return (
        <RootAdmin>
            <Card radius='sm'>
                <CardBody>  
                    <form onSubmit={handleSubmit(onSubmitForm)}>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-3 mb-6'>
                            <div className='col-span-3'>
                                <ControlledReactSelect
                                    control={control} 
                                    label="Perusahaan" 
                                    name="companyId" 
                                    isLoading={isLoadingCompany} 
                                    options={dataCompany} 
                                    isRequired={true} 
                                />
                            </div>
                             <ControlledReactSelect
                                            control={control} 
                                            label="Periode" 
                                            name="periodId" 
                                            options={periodOptions} 

                                            isRequired={true} 
                            />
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
                            <ControlledReactSelect 
                                control={control} 
                                label="Jenis B3" 
                                name="dataBahanB3Id" 
                                isLoading={isLoadingMaterial} 
                                options={dataMaterial?.data.map(item => ({ value: item.id, label: `${item.casNumber} - ${item.namaBahanKimia}` }))} 
                                isRequired={true} 
                            />
                            <ControlledInput control={control} label="Jumlah Pembelian" name="jumlahPembelianB3" type="number" isRequired={true} />
                            <ControlledInput control={control} label="Jumlah Konsumsi" name="jumlahB3Digunakan" type="number" isRequired={true} />
                            <Controller
                                name="tipePembelian"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Select
                                        {...field}
                                        isRequired
                                        variant="faded" 
                                        label="Tipe Pembelian"
                                        labelPlacement="outside"
                                        placeholder="Pilih..." 
                                        onChange={(e) => {
                                            field.onChange(e.target.value);
                                            setPurchaseType(e.target.value)
                                        }}
                                        color={fieldState.error ? 'danger' : 'default'}
                                        isInvalid={fieldState.error} 
                                        errorMessage={fieldState.error && fieldState.error.message}
                                    >
                                        <SelectItem key="Lokal">Lokal</SelectItem>
                                        <SelectItem key="Impor">Impor</SelectItem>
                                    </Select>             
                                )}
                            />
                            {purchaseType === 'Impor' && (
                                <ControlledReactSelect 
                                    control={control} 
                                    label="Nomor Registrasi" 
                                    name="noRegistrasi" 
                                    isLoading={isLoadingRegistrasi} 
                                    options={dataRegistrasi?.data?.map(item => ({ value: item.id, label: item.noRegistrasi }))} 
                                    isRequired={true} 
                                />
                            )}
                            {purchaseType === 'Lokal' && (
                                <div className='col-span-3'>
                                    <InlineEditSupplier control={control} setValue={setValue} companyId={companyId} />
                                </div>
                            )}
                        </div>
                        <div className='flex items-center gap-2'>
                            <Button color='primary' type='submit' isDisabled={isSubmitting} isLoading={isSubmitting}>Simpan</Button>
                            <Button color='warning' variant='faded' isDisabled={isSubmitting} isLoading={isSubmitting} onPress={() => navigate(-1)}>Kembali</Button>
                        </div>
                    </form>
                </CardBody>
            </Card>
        </RootAdmin>
    )
}
