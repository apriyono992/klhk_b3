import React from 'react'
import { getFetcher, getSelectFetcher, putFetcher } from '../../../services/api';
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
import { DocumentIcon } from '@heroicons/react/24/outline';

export default function ImportVerficationDraftPage() {
    const { id } = useParams();
    const { data, isLoading, mutate } = useSWR(`/api/notifikasi/${id}`, getFetcher);
    const { data: dataTembusan, isLoading: isLoadingTembusan } = useSWR('/api/data-master/tembusan?limit=100', getSelectFetcher);
    const { data: dataPejabat, isLoading: isLoadingPejabat } = useSWR('/api/data-master/pejabat?limit=100', getSelectFetcher);
    const { register, handleSubmit, control, formState: { errors, isSubmitting, dirtyFields } } = useForm({
        resolver: yupResolver(draftImportVerficationLetter),
        defaultValues: {
            // nomorSurat: data?.draftSuratNotifikasiId[0]?.nomorSurat,
            // tanggalSurat: data?.draftSuratNotifikasiId[0]?.tanggalSurat,
            // tipeSurat: data?.draftSuratNotifikasiId[0]?.tipeSurat,
        }
    });
    console.log(data);

    async function onSubmitForm(formData) {
        try {
            await new Promise(r => setTimeout(r, 1000));
            formData.notifikasiId = data?.draftSuratNotifikasiId[0]?.notifikasiId
            formData.draftNotifikasiId = data?.draftSuratNotifikasiId[0]?.id
            formData.dataBahanB3Id = data?.dataBahanB3?.id
            console.log(formData);
            await putFetcher('/api/draft-surat-notifikasi/kebenaran-import', data?.draftSuratNotifikasiId[0]?.id, formData);
            mutate();
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
                <CardHeader className='flex items-center justify-between'>
                    <span>Draft Surat Kebenaran Import</span>
                    <Button size='sm' color='primary' startContent={<DocumentIcon className='size-4'/>}>Lihat Draft Surat</Button>
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
                                label="Tanggal Surat Diterbitkan" 
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
                                label="Tanggal Maksimal Surat Dikirim" 
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
                                label="Tipe Surat"
                                labelPlacement='outside'
                                placeholder='Pilih...'
                                color={errors.tipeSurat ? 'danger' : 'default'}
                                isInvalid={errors.tipeSurat} 
                                errorMessage={errors.tipeSurat && errors.tipeSurat.message}
                            >
                                <SelectItem key="Kebenaran Import Pestisida">Kebenaran Import Pestisida</SelectItem>
                                <SelectItem key="Kebenaran Import Biasa">Kebenaran Import Biasa</SelectItem>
                            </Select>
                            <Select 
                                {...register('sifatSurat')}
                                isRequired
                                variant="faded" 
                                label="Sifat Surat"
                                labelPlacement='outside'
                                placeholder="Pilih..." 
                                color={errors.sifatSurat ? 'danger' : 'default'}
                                isInvalid={errors.sifatSurat} 
                                errorMessage={errors.sifatSurat && errors.sifatSurat.message}
                            >
                                <SelectItem key="Biasa">Biasa</SelectItem>
                            </Select>
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
                                {...register('namaPengirimNotifikasi')}
                                isRequired
                                variant="faded" 
                                type="text"
                                label="Nama Pengirim Notifikasi" 
                                labelPlacement='outside'
                                placeholder="..."
                                color={errors.namaPengirimNotifikasi ? 'danger' : 'default'}
                                isInvalid={errors.namaPengirimNotifikasi} 
                                errorMessage={errors.namaPengirimNotifikasi && errors.namaPengirimNotifikasi.message}
                            />
                            <Input
                                {...register('perusaahaanAsal')}
                                isRequired
                                variant="faded" 
                                type="text"
                                label="Perusahaan Asal" 
                                labelPlacement='outside'
                                placeholder="..."
                                color={errors.perusaahaanAsal ? 'danger' : 'default'}
                                isInvalid={errors.perusaahaanAsal} 
                                errorMessage={errors.perusaahaanAsal && errors.perusaahaanAsal.message}
                            />
                            <Input
                                {...register('emailPenerima')}
                                isRequired
                                variant="faded" 
                                type="email"
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
                                label="Tanggal Kirim Email"
                                labelPlacement='outside'
                                placeholder="..." 
                                color={errors.tanggalPengiriman ? 'danger' : 'default'}
                                isInvalid={errors.tanggalPengiriman} 
                                errorMessage={errors.tanggalPengiriman && errors.tanggalPengiriman.message}
                            />
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
                        <Button isDisabled={isSubmitting} isLoading={isSubmitting} color='primary' type='submit'>Submit</Button>
                    </form>
                </CardBody>
            </Card>
        </RootAdmin>
    )
}
