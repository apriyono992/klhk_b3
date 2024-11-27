import { Button, Card, CardBody, Select, SelectItem } from '@nextui-org/react'
import React from 'react'
import ControlledReactSelect from '../../../../../components/elements/ControlledReactSelect'
import ControlledInput from '../../../../../components/elements/ControlledInput'
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import { getFetcher } from '../../../../../services/api';
import { month } from '../../../../../services/enum';
import { useNavigate, useParams } from 'react-router-dom';
import RootAdmin from '../../../../../components/layouts/RootAdmin';
import InlineEditTransporter from '../../../../../components/fragments/admin/report/distribution/InlineEditTransporter';
import InlineEditCustomer from '../../../../../components/fragments/admin/report/distribution/InlineEditCustomer';
import { yupResolver } from '@hookform/resolvers/yup';
import { createReportVehicleValidation } from '../../../../../services/validation';

export default function CreatePage() {
    const navigate = useNavigate()
    const { id } = useParams()
    const { data, isLoading } = useSWR(`/api/pelaporan-bahan-b3-distribusi/find/${id}`, getFetcher);
    const { data: dataCompany, isLoading: isLoadingCompany } = useSWR(`/api/company/search-company`, getFetcher);
    const { data: dataMaterial, isLoading: isLoadingMaterial } = useSWR(`/api/data-master/bahan-b3`, getFetcher);
    const { data: dataPeriod } = useSWR(`/api/period/active`, getFetcher);
    const { register, control, watch, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({resolver: yupResolver(createReportVehicleValidation)});
    const companyId = watch('companyId');

    function onSubmitForm(data) {
        console.log(data);
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
                                options={dataCompany?.data.map(item => ({ value: item.id, label: item.name }))} 
                                isRequired={true} 
                            />
                            <Select
                                {...register('periodId')}
                                isRequired
                                variant="faded" 
                                label="Periode"
                                labelPlacement="outside"
                                placeholder="Pilih..." 
                                color={errors.periodId ? 'danger' : 'default'}
                                isInvalid={errors.periodId} 
                                errorMessage={errors.periodId && errors.periodId.message}
                            >
                                <SelectItem key={dataPeriod?.id}>{dataPeriod?.name}</SelectItem>
                            </Select>   
                            <Select 
                                {...register('bulan')}
                                isRequired
                                variant="faded" 
                                label="Bulan"
                                labelPlacement="outside"
                                placeholder="Pilih..." 
                                color={errors.bulan ? 'danger' : 'default'}
                                isInvalid={errors.bulan} 
                                errorMessage={errors.bulan && errors.bulan.message}
                            >
                                {month.map((item, index) => (
                                    <SelectItem key={index+1}>{item}</SelectItem>
                                ))}
                            </Select>   
                            <ControlledInput control={control} label="Tahun" name="tahun" type="number" isRequired={true} />
                            <ControlledReactSelect 
                                control={control} 
                                label="Jenis B3" 
                                name="dataBahanB3Id" 
                                isLoading={isLoadingMaterial} 
                                options={dataMaterial?.data.map(item => ({ value: item.id, label: `${item.casNumber} - ${item.namaBahanKimia}` }))} 
                                isRequired={true} 
                            />
                            <ControlledInput control={control} label="Jumlah Distribusi" name="jumlahB3Dihasilkan" type="number" isRequired={true} />
                            <div className='col-span-2'>
                                <InlineEditTransporter control={control} setValue={setValue} companyId={companyId} />
                            </div>
                            <div className='col-span-2'>
                                <InlineEditCustomer control={control} setValue={setValue} companyId={companyId} />
                            </div>
                        </div>
                        <div className='flex items-center gap-1'>
                            <Button isLoading={isSubmitting} isDisabled={isSubmitting} type='submit' color='primary'>Tambah</Button>
                            <Button isDisabled={isSubmitting} color='danger' variant='faded' onPress={() => navigate(-1)}>Kembali</Button>
                        </div>
                    </form>
                </CardBody>
            </Card>
        </RootAdmin>
    )
}
