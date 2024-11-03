import React from 'react'
import { getFetcher, getSelectFetcher } from '../../../services/api';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import RootAdmin from '../../../components/layouts/RootAdmin';
import { Button, Card, CardBody, CardHeader, Input, Select, SelectItem } from '@nextui-org/react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { isResponseErrorObject } from '../../../services/helpers';
import toast from 'react-hot-toast';
import { draftImportVerficationLetter } from '../../../services/validation';
import ReactSelect from '../../../components/elements/ReactSelect';

export default function ExplicitConcentDraftPage() {
    const { id } = useParams();
    const { data, isLoading, mutate } = useSWR(`/api/notifikasi/${id}`, getFetcher);
    const { data: dataTembusan, isLoading: isLoadingTembusan } = useSWR('/api/data-master/tembusan?limit=100', getSelectFetcher);
    const { data: dataPejabat, isLoading: isLoadingPejabat } = useSWR('/api/data-master/pejabat?limit=100', getSelectFetcher);
    const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(draftImportVerficationLetter),
        defaultValues: {
            nomorSurat: data?.draftSuratNotifikasiId[0]?.nomorSurat,
            tipeSurat: data?.draftSuratNotifikasiId[0]?.tipeSurat,
        }
    });
    console.log(data);

    async function onSubmitForm(formData) {
        try {
            await new Promise(r => setTimeout(r, 1000));
            console.log(formData);
            toast.success('Draft surat kebenaran import berhasil diubah!');
        } catch (error) {
            isResponseErrorObject(error.response.data.message)
                ? Object.entries(error.response.data.message).forEach(([key, value]) => {
                    toast.error(value);
                })
                : toast.error(error.response.data.message)
        }
    }

    return (
        <RootAdmin>
            <Card radius='sm' className='mt-3'>
                <CardHeader>
                    Draft Surat Kebenaran Import
                </CardHeader>
                <CardBody>
                    <form onSubmit={handleSubmit(onSubmitForm)}>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3 mb-6'>
                            <Input
                                {...register('nomorSurat')}
                                isRequired
                                variant="faded" 
                                type="text"
                                label="Nomor Surat" 
                                labelPlacement='outside'
                                placeholder="..."
                                color={errors.nomorSurat ? 'danger' : 'default'}
                                isInvalid={errors.nomorSurat} 
                                errorMessage={errors.nomorSurat && errors.nomorSurat.message}
                                className='col-span-2'
                            />
                            <Input
                                {...register('tanggalSurat')}
                                isRequired
                                variant="faded" 
                                type="date"
                                label="Tanggal Berlaku" 
                                labelPlacement='outside'
                                placeholder="..."
                                color={errors.tanggalSurat ? 'danger' : 'default'}
                                isInvalid={errors.tanggalSurat} 
                                errorMessage={errors.tanggalSurat && errors.tanggalSurat.message}
                            />
                            <Input
                                {...register('tanggalMaksimalSurat')}
                                isRequired
                                variant="faded" 
                                type="date"
                                label="Sampai" 
                                labelPlacement='outside'
                                placeholder="..."
                                color={errors.tanggalMaksimalSurat ? 'danger' : 'default'}
                                isInvalid={errors.tanggalMaksimalSurat} 
                                errorMessage={errors.tanggalMaksimalSurat && errors.tanggalMaksimalSurat.message}
                            />
                            <Select 
                                {...register('tipeSurat')}
                                isRequired
                                variant="faded" 
                                type="text"
                                label="Tipe Surat"
                                labelPlacement='outside'
                                placeholder="..." 
                                color={errors.tipeSurat ? 'danger' : 'default'}
                                isInvalid={errors.tipeSurat} 
                                errorMessage={errors.tipeSurat && errors.tipeSurat.message}
                                selectedKeys={[data?.draftSuratNotifikasiId[0]?.tipeSurat]}
                            >
                                <SelectItem key="Kebenaran Import Pestisida">Kebenaran Import Pestisida</SelectItem>
                                <SelectItem key="Kebenaran Import Biasa">Kebenaran Import Biasa</SelectItem>
                            </Select>
                            <Input
                                {...register('sifatSurat')}
                                isRequired
                                variant="faded" 
                                type="text"
                                label="Sifat Surat" 
                                labelPlacement='outside'
                                placeholder="..."
                                color={errors.sifatSurat ? 'danger' : 'default'}
                                isInvalid={errors.sifatSurat} 
                                errorMessage={errors.sifatSurat && errors.sifatSurat.message}
                            />
                            <Input
                                {...register('referenceNumber')}
                                isRequired
                                variant="faded" 
                                type="text"
                                label="Nomor Referensi" 
                                labelPlacement='outside'
                                placeholder="..."
                                color={errors.referenceNumber ? 'danger' : 'default'}
                                isInvalid={errors.referenceNumber} 
                                errorMessage={errors.referenceNumber && errors.referenceNumber.message}
                            />
                            <Input
                                {...register('negaraAsal')}
                                isRequired
                                variant="faded" 
                                type="text"
                                label="Negara Asal" 
                                labelPlacement='outside'
                                placeholder="..."
                                color={errors.negaraAsal ? 'danger' : 'default'}
                                isInvalid={errors.negaraAsal} 
                                errorMessage={errors.negaraAsal && errors.negaraAsal.message}
                            />
                            <Input
                                {...register('emailPenerima')}
                                isRequired
                                variant="faded" 
                                type="text"
                                label="Email Penerima"
                                labelPlacement='outside'
                                placeholder="..." 
                                color={errors.emailPenerima ? 'danger' : 'default'}
                                isInvalid={errors.emailPenerima} 
                                errorMessage={errors.emailPenerima && errors.emailPenerima.message}
                            />
                            <Input
                                {...register('tanggalPengiriman')}
                                isRequired
                                variant="faded" 
                                type="date"
                                label="Tanggal Pengiriman"
                                labelPlacement='outside'
                                placeholder="..." 
                                color={errors.tanggalPengiriman ? 'danger' : 'default'}
                                isInvalid={errors.tanggalPengiriman} 
                                errorMessage={errors.tanggalPengiriman && errors.tanggalPengiriman.message}
                            />
                            {/* <Input
                                {...register('dataBahanB3Id')}
                                isRequired
                                variant="faded" 
                                type="text"
                                label="Data Bahan B3" 
                                color={errors.dataBahanB3Id ? 'danger' : 'default'}
                                isInvalid={errors.dataBahanB3Id} 
                                errorMessage={errors.dataBahanB3Id && errors.dataBahanB3Id.message}
                            /> */}
                            <Controller
                                name="pejabatId"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <ReactSelect
                                        label="Pejabat"
                                        data={dataPejabat}
                                        isLoading={isLoadingPejabat}
                                        value={field.value}
                                        onChange={(selectedOptions) => field.onChange(selectedOptions.value)}
                                        error={fieldState.error && fieldState.error.message}
                                    /> 
                                )}
                            />
                            {/* <Input
                                {...register('notifikasiId')}
                                isRequired
                                variant="faded" 
                                type="date"
                                label="Notifikasi ID" 
                                color={errors.notifikasiId ? 'danger' : 'default'}
                                isInvalid={errors.notifikasiId} 
                                errorMessage={errors.notifikasiId && errors.notifikasiId.message}
                            /> */}
                            <div className='col-span-2'>
                                <Controller
                                    name="tembusanIds"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <ReactSelect
                                            label="Tembusan"
                                            isMulti={true}
                                            data={dataTembusan}
                                            isLoading={isLoadingTembusan}
                                            value={field.value}
                                            onChange={(selectedOptions) => field.onChange(selectedOptions.map(option => option.value))}
                                            error={fieldState.error && fieldState.error.message}
                                        /> 
                                    )}
                                /> 
                            </div>
                        </div>
                        <Button isDisabled={isSubmitting} loading={isSubmitting} color='primary' type='submit'>Submit</Button>
                    </form>
                </CardBody>
            </Card>
        </RootAdmin>
    )
}
