import React from 'react';
import { Button, Card, CardBody, CardHeader, Divider, Input, Select, SelectItem, Textarea } from '@nextui-org/react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import {getSelectFetcher, simpanSK} from '../../../../services/api';
import ReactSelect from "../../../elements/ReactSelect";
import useSWR from "swr";
import TembusanRegistrasi from "./information/TembusanRegistrasi";
import {dirtyInput} from "../../../../services/helpers";

export default function Draft({ id, dataTembusan, mutate, data }) {
    const formSchema = yup.object().shape({
        berlaku_dari: yup.date()
            .typeError('Tanggal harus valid')
            .required('harus diisi'),
        berlaku_sampai: yup.date()
            .typeError('Tanggal harus valid')
            .required('harus diisi'),
        nomor_notifikasi_impor: yup.string().required('harus diisi'),

    }).required();

    const dataBerlakuDari = data?.berlaku_dari && new Date(data?.berlaku_dari)
    const dataBerlakuSampai = data?.berlaku_sampai && new Date(data?.berlaku_sampai)
    const dataTanggalTerbit = data?.tanggal_terbit && new Date(data?.tanggal_terbit)

    const month = [
        'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember'
    ]

    const permit = [
        'Berjangka',
        'Trasaksional',
        'Seumur Hidup',
        'Perkecualian - Transaksional',
    ]

    const { register, handleSubmit, control, formState: { errors, isSubmitting, dirtyFields } } = useForm({
        resolver: yupResolver(formSchema),
        defaultValues: {
            bulan: data?.bulan,
            tahun: data?.tahun,
            status_izin: permit.find(word => word.toLowerCase() === data?.status_izin),
            keterangan_sk: data?.keterangan_sk || '',
            tanggal_terbit: format(dataTanggalTerbit, 'yyyy-MM-dd') || null,
            berlaku_dari: format(dataBerlakuDari, 'yyyy-MM-dd') || null,
            berlaku_sampai: format(dataBerlakuSampai, 'yyyy-MM-dd') || null,
            nomor_notifikasi_impor: data?.nomor_notifikasi_impor || '',
            pejabat_id: { value: data?.pejabat?.id, label: data?.pejabat?.nama },
        }
    });
    const { data: dataPejabat, isLoading: isLoadingPejabat } = useSWR('/api/data-master/pejabat?limit=100', getSelectFetcher);

    const onSubmit = async (data) => {
        try {
            const filteredData = dirtyInput(dirtyFields, data);
            const dataBerlakuDari = data?.berlaku_dari && new Date(data?.berlaku_dari)
            const dataBerlakuSampai = data?.berlaku_sampai && new Date(data?.berlaku_sampai)
            const dataTanggalTerbit = data?.tanggal_terbit && new Date(data?.tanggal_terbit)
            if (filteredData.berlaku_dari) {
                filteredData.berlaku_dari = format(dataBerlakuDari, 'yyyy-MM-dd')
            }
            if (filteredData.berlaku_sampai) {
                filteredData.berlaku_sampai = format(dataBerlakuSampai, 'yyyy-MM-dd')
            }
            if (filteredData.tanggal_terbit) {
                filteredData.tanggal_terbit = format(dataTanggalTerbit, 'yyyy-MM-dd')
            }

            await simpanSK(id, filteredData);
            mutate();
            toast.success('Draft sk berhasil dibuat!');
        } catch (error) {
            console.log(error, 'isis eror draft')
            toast.error('Gagal buat draft sk!');
        }
    }

    const hasUnsavedChanges = Object.keys(dirtyFields).length > 0;

    return (
        <div className='flex flex-row gap-4 py-3'>
            <div className={'w-1/2'}>
                <TembusanRegistrasi registrasiId={id} existingTembusan={dataTembusan}/>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className='w-1/2'>
                <Card radius='sm' className='h-full'>
                    <CardHeader>
                        <p className="text-md">Draft Sk</p>
                        {hasUnsavedChanges && (
                            <span className="text-red-500 text-sm ml-2">Perubahan belum disimpan</span>
                        )}
                    </CardHeader>
                    <Divider/>
                    <CardBody>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3 mb-5'>
                            <Select
                                {...register('bulan')}
                                variant="faded"
                                label="Bulan"
                                placeholder="Pilih"
                                labelPlacement="outside"
                                color={errors.bulan ? 'danger' : 'default'}
                                isInvalid={errors.bulan}
                                errorMessage={errors.bulan && errors.bulan.message}
                            >
                                {month.map(item => (
                                    <SelectItem key={item} value={item}>{item}</SelectItem>
                                ))}
                            </Select>
                            <Input
                                {...register('tahun')}
                                variant="faded"
                                labelPlacement="outside"
                                placeholder={'...'}
                                type="text"
                                label="Tahun"
                                color={errors.tahun ? 'danger' : 'default'}
                                isInvalid={errors.tahun}
                                errorMessage={errors.tahun && errors.tahun.message}
                            />
                            <Select
                                {...register('status_izin')}
                                variant="faded"
                                label="Status Izin"
                                placeholder="Pilih"
                                labelPlacement="outside"
                                color={errors.status_izin ? 'danger' : 'default'}
                                isInvalid={errors.status_izin}
                                errorMessage={errors.status_izin && errors.status_izin.message}
                            >
                                {permit.map((item, index) => (
                                    <SelectItem key={item} value={item}>{item}</SelectItem>
                                ))}
                            </Select>
                            <Textarea
                                {...register('keterangan_sk')}
                                variant="faded"
                                label="Keterangan SK"
                                color={errors.keterangan_sk ? 'danger' : 'default'}
                                isInvalid={errors.keterangan_sk}
                                errorMessage={errors.keterangan_sk && errors.keterangan_sk.message}
                                className="col-span-2"
                                labelPlacement="outside"
                            />
                            <Input
                                {...register('tanggal_terbit')}
                                variant="faded"
                                label="Tanggal Terbit"
                                type="date"
                                labelPlacement="outside"
                                color={errors.tanggal_terbit ? 'danger' : 'default'}
                                isInvalid={errors.tanggal_terbit}
                                errorMessage={errors.tanggal_terbit && errors.tanggal_terbit.message}
                                className='col-span-2'
                            />
                            <Input
                                {...register('berlaku_dari')}
                                variant="faded"
                                label="Berlaku Dari"
                                type="date"
                                labelPlacement="outside"
                                isRequired
                                color={errors.berlaku_dari ? 'danger' : 'default'}
                                isInvalid={errors.berlaku_dari}
                                errorMessage={errors.berlaku_dari && errors.berlaku_dari.message}
                            />
                            <Input
                                {...register('berlaku_sampai')}
                                variant="faded"
                                labelPlacement="outside"
                                label="Sampai"
                                type="date"
                                isRequired
                                color={errors.berlaku_sampai ? 'danger' : 'default'}
                                isInvalid={errors.berlaku_sampai}
                                errorMessage={errors.berlaku_sampai && errors.berlaku_sampai.message}
                            />
                            <Input
                                {...register('nomor_notifikasi_impor')}
                                variant="faded"
                                isRequired
                                labelPlacement="outside"
                                type="text"
                                label="Nomor Notifikasi Impor"
                                placeholder={'...'}
                                color={errors.nomor_notifikasi_impor ? 'danger' : 'default'}
                                isInvalid={errors.nomor_notifikasi_impor}
                                errorMessage={errors.nomor_notifikasi_impor && errors.nomor_notifikasi_impor.message}
                                className="col-span-2"
                            />
                            <div className={'col-span-2'}>
                                <Controller
                                    name="pejabat_id"
                                    control={control}
                                    rules={{ required: 'Pejabat wajib diisi' }}
                                    render={({ field, fieldState }) => (
                                        <ReactSelect
                                            label="Pejabat"
                                            data={dataPejabat}
                                            isLoading={isLoadingPejabat}
                                            value={field.value}
                                            defaultValue={field.value}
                                            onChange={(selectedOption) => field.onChange(selectedOption.value)}
                                            error={fieldState.error && fieldState.error.message}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <div>
                            <Button
                                type={"submit"}
                                color='primary'
                                isDisabled={isSubmitting || Object.keys(dirtyFields).length === 0}
                                isLoading={isSubmitting}
                            >
                                Simpan
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            </form>
        </div>
    )
}
