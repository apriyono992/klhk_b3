import React, { useEffect } from 'react'
import RootAdmin from '../../../../../components/layouts/RootAdmin'
import { Button, Card, CardBody, Select, SelectItem, Spinner } from '@nextui-org/react'
import ControlledReactSelect from '../../../../../components/elements/ControlledReactSelect'
import { month } from '../../../../../services/enum'
import ControlledInput from '../../../../../components/elements/ControlledInput'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import { getFetcher, postFetcher } from '../../../../../services/api'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import InlineEditSupplier from '../../../../../components/fragments/admin/report/consumption/InlineEditSupplier'
import { yupResolver } from '@hookform/resolvers/yup'
import { createReportConsumptionValidation } from '../../../../../services/validation'

export default function CreatePage() {
    const { id } = useParams()
    const { data, isLoading, error } = useSWR(`/api/pelaporan-penggunaan-bahan-b3/find/${id}`, getFetcher);
    const navigate = useNavigate()
    const [purchaseType, setPurchaseType] = React.useState('');
    const { data: dataCompany, isLoading: isLoadingCompany } = useSWR(`/api/company/search-company`, getFetcher);
    const { data: dataMaterial, isLoading: isLoadingMaterial } = useSWR(`/api/data-master/bahan-b3`, getFetcher);
    const { data: dataRegistrasi, isLoading: isLoadingRegistrasi } = useSWR(`/api/registrasi/search`, getFetcher);
    const { data: dataPeriod } = useSWR(`/api/period/active`, getFetcher);
    const { register, control, reset, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(createReportConsumptionValidation) });

    // useEffect(() => {
    //     if (!isLoading && data) {
    //         reset({

    //         })
    //     }
    // }, [])
    

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

    return (
        <RootAdmin>
            <Card radius='sm'>
                <CardBody>  
                    <form onSubmit={handleSubmit(onSubmitForm)}>
                        {
                            !isLoading && data 
                            ?
                            <>
                                <div className='grid grid-cols-1 md:grid-cols-3 gap-3 mb-6'>
                                    <div className='col-span-3'>
                                        <ControlledReactSelect
                                            control={control} 
                                            label="Perusahaan" 
                                            name="companyId" 
                                            isLoading={isLoadingCompany} 
                                            options={dataCompany?.data.map(item => ({ value: item.id, label: item.name }))} 
                                            isRequired={true} 
                                        />
                                    </div>
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
                                            options={dataRegistrasi?.data.map(item => ({ value: item.id, label: item.noRegistrasi }))} 
                                            isRequired={true} 
                                        />
                                    )}
                                    {purchaseType === 'Lokal' && (
                                        <div className='col-span-3'>
                                            <InlineEditSupplier control={control} setValue={setValue} />
                                        </div>
                                    )}
                                </div>
                                <div className='flex items-center gap-2'>
                                    <Button color='primary' type='submit' isDisabled={isSubmitting} isLoading={isSubmitting}>Simpan</Button>
                                    <Button color='warning' variant='faded' isDisabled={isSubmitting} isLoading={isSubmitting} onPress={() => navigate(-1)}>Kembali</Button>
                                </div>
                            </>
                            :
                            <div className='flex flex-col gap-3'>
                                <Spinner/>
                            </div>
                        }
                    </form>
                </CardBody>
            </Card>
        </RootAdmin>
    )
}
