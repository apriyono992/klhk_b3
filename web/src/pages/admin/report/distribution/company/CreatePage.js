import { Button, Card, CardBody, Select, SelectItem, Spinner } from '@nextui-org/react'
import React,  {useEffect, useState} from 'react'
import ControlledReactSelect from '../../../../../components/elements/ControlledReactSelect'
import ControlledInput from '../../../../../components/elements/ControlledInput'
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import { getFetcher, getSelectFetcher, postFetcher } from '../../../../../services/api';
import { month } from '../../../../../services/enum';
import { useNavigate } from 'react-router-dom';
import RootAdmin from '../../../../../components/layouts/RootAdmin';
import InlineEditTransporter from '../../../../../components/fragments/admin/report/distribution/InlineEditTransporter';
import InlineEditCustomer from '../../../../../components/fragments/admin/report/distribution/InlineEditCustomer';
import useAuth from "../../../../../hooks/useAuth";
import RoleAccess from "../../../../../enums/roles";
import { monthNames } from "../../../../../services/helpers";
import toast from 'react-hot-toast';
import { dirtyInput, isResponseErrorObject } from '../../../../../services/helpers';

export default function CreatePage() {
    const { user, roles } = useAuth();
    const navigate = useNavigate();
    const [availableMonths, setAvailableMonths] = useState([]);
    const [availableYears, setAvailableYears] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null); // Perusahaan yang dipilih
    const [selectedPeriod, setSelectedPeriod] = useState(null); // Periode yang dipilih
    const { data: dataMaterial, isLoading: isLoadingMaterial } = useSWR(`/api/data-master/bahan-b3`, getFetcher);
    const { data: dataPeriod } = useSWR(`/api/period/report-actives`, getFetcher);
    const { reset, register, control, watch, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm();
    const companyId = watch('companyId');

    const isSuperAdmin = roles.includes(RoleAccess.SUPER_ADMIN); // Cek apakah user adalah Super Admin
    const { data: dataCompany, isLoading: isLoadingCompany } = useSWR(
        isSuperAdmin
            ? `/api/company/search-company` // Jika Super Admin, fetch semua perusahaan
            : `/api/company/search-company?companyIds=${user.companies?.map((company) => company.id).join(",")}`, // Jika bukan Super Admin, fetch perusahaan sesuai IDs
        getSelectFetcher
    );
    const periodId = watch('periodId'); // Pantau perubahan nilai periodId

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
            const payload = {
                companyId: data.companyId,
                periodId: data.periodId,
                bulan: data.bulan,
                tahun: data.tahun,
                dataBahanB3Id: data.dataBahanB3Id,
                jumlahB3Distribusi: data.jumlahB3Distribusi,
                dataTransporters: data.dataTransporters,
                dataCustomers: data.dataCustomers
            }
            const response =  await postFetcher('/api/pelaporan-bahan-b3-distribusi', payload);
            
            toast.success('Data berhasil ditambahkan!');
            // Reset form ke nilai awal
            reset({
                companyId: '',
                periodId: '',
                bulan: '',
                tahun: '',
                dataBahanB3Id: '',
                jumlahB3Distribusi: '',
                dataTransporters: [],
                dataCustomers: [],
            });

            // Opsional: Set ulang state lain jika diperlukan
            setAvailableMonths([]);
            setAvailableYears([]);
            setSelectedCompany(null);
            setSelectedPeriod(null);
            
        } catch (error) {
            isResponseErrorObject(error.response.data.message)
                ? Object.entries(error.response.data.message).forEach(([key, value]) => {
                    toast.error(value);
                })
                : toast.error(error.response.data.message)
        }
    }
    if (isLoadingCompany || isLoadingMaterial) {
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
            <Card radius='sm' className='mt-3'>
                <CardBody>
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
                            <ControlledInput control={control} label="Jumlah Distribusi" name="jumlahB3Distribusi" type="number" isRequired={true} />
                            <div className='col-span-2'>
                                <InlineEditTransporter control={control} setValue={setValue} companyId={companyId} />
                            </div>
                            <div className='col-span-2'>
                                <InlineEditCustomer control={control} setValue={setValue} companyId={companyId} />
                            </div>
                        </div>
                        <div className='flex items-center gap-1'>
                            <Button isLoading={isSubmitting} isDisabled={isSubmitting} type='submit' color='primary'>Tambah</Button>
                            <Button isDisabled={isSubmitting} color='warning' variant='faded' onPress={() => navigate(-1)}>Kembali</Button>
                        </div>
                    </form>
                </CardBody>
            </Card>
        </RootAdmin>
    )
}
