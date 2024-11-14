import { Button, Card, CardBody, CardHeader, Divider, Input, Select, SelectItem, Textarea } from '@nextui-org/react'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import MultiSelectSort from '../../../elements/MultiSelectSort'
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { simpanSK } from '../../../../services/api';
import { useNavigate } from 'react-router-dom';
import { REGISTRATION_INDEX_PATH } from '../../../../services/routes';

export default function Draft(id) {
    const navigate = useNavigate();
    const formSchema =  yup.object().shape({
        tembusanIds: yup.array()
            .min(1, 'Minimal 1 tembusan')
            .required('Harus diisi'),
        bulan: yup.string().typeError('Harus diisi'),
        tahun: yup.number()
                        .typeError('Tahun harus valid')
                        .integer('Harus angka').min(1900, 'Tahun tidak valid')
                        .max(2099, `Tahun tidak valid`)
                        .required('harus diisi'),
        status_izin: yup.string().typeError('Harus diisi'),
        keterangan_sk: yup.string().required('harus diisi'),
        tanggal_terbit: yup.date()
                                    .typeError('Tanggal harus valid')
                                    .required('harus diisi'),
        berlaku_dari: yup.date()
                            .typeError('Tanggal harus valid')
                            .required('harus diisi'),
        berlaku_sampai: yup.date()
                            .typeError('Tanggal harus valid')
                            .required('harus diisi'),
        nomor_notifikasi_impor: yup.string().required('harus diisi'),

    }).required()

    const { register, handleSubmit, control, formState: { errors, isSubmitting }, } = useForm({resolver: yupResolver(formSchema)})

    async function onSubmit(data) {
        const dataBerlakuDari = new Date(data?.berlaku_dari)
        const dataBerlakuSampai = new Date(data?.berlaku_sampai)
        const dataTanggalTerbit = new Date(data?.tanggal_terbit)
        const dataSK = {
            ...data,
            berlaku_dari: format(dataBerlakuDari, 'yyyy-MM-dd'),
            berlaku_sampai: format(dataBerlakuSampai, 'yyyy-MM-dd'),
            tanggal_terbit: format(dataTanggalTerbit, 'yyyy-MM-dd'),
            tembusanIds: data?.tembusanIds.map(it => it.value),
        }

        try {
            const response = await simpanSK(dataSK, id.id);
            console.log(response, 'success');
            toast.success('Draft sk berhasil dibuat!');
            navigate(REGISTRATION_INDEX_PATH, { replace: true })
        } catch (error) {
            toast.error('Gagal buat draft sk!');
        }
    }

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

    const options = [
        { value: '1', label: 'Orang 1' },
        { value: '2', label: 'Orang 2' },
        { value: '3', label: 'Orang 3' },
        { value: '4', label: 'Orang 4' },
        { value: '5', label: 'Orang 5' },
        { value: '6', label: 'Orang 6' },
        { value: '7', label: 'Orang 7' },
        { value: '8', label: 'Orang 8' },
        { value: '9', label: 'Orang 9' },
    ]

    return (
        <div className=''>
            <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-1 md:grid-cols-2 gap-3 py-3'>
                <Card radius='sm'>
                    <CardHeader>
                        <p className="text-md">Tembusan</p>
                    </CardHeader>
                    <Divider/>
                    <CardBody>
                        <Controller
                            name='tembusanIds'
                            control={control}
                            rules={{ required: true }}
                            render={({ field, fieldState }) => (
                                <div className='flex flex-col'>
                                    {fieldState.error && <div className="text-red-500 text-xs">{fieldState.error.message}</div>}
                                    <MultiSelectSort
                                        value={field.value}
                                        onChange={field.onChange}
                                        options={options}
                                    />
                                </div>
                            )}
                        />
                    </CardBody>
                </Card>
                <Card radius='sm'>
                    <CardHeader>
                        <p className="text-md">Draft Sk</p>
                    </CardHeader>
                    <Divider/>
                    <CardBody>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3 mb-5'>
                            <Select
                                {...register('bulan')}
                                variant="faded"
                                label="Bulan"
                                placeholder="Pilih"
                                isRequired
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
                                isRequired
                                variant="faded"
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
                                isRequired
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
                                isRequired
                                color={errors.keterangan_sk ? 'danger' : 'default'}
                                isInvalid={errors.keterangan_sk}
                                errorMessage={errors.keterangan_sk && errors.keterangan_sk.message}
                                className="col-span-2"
                            />
                            <Input
                                {...register('tanggal_terbit')}
                                variant="faded"
                                label="Tanggal Terbit"
                                type="date"
                                isRequired
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
                                isRequired
                                color={errors.berlaku_dari ? 'danger' : 'default'}
                                isInvalid={errors.berlaku_dari}
                                errorMessage={errors.berlaku_dari && errors.berlaku_dari.message}
                            />
                            <Input
                                {...register('berlaku_sampai')}
                                variant="faded"
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
                                type="text"
                                label="Nomor Notifikasi Impor"
                                color={errors.nomor_notifikasi_impor ? 'danger' : 'default'}
                                isInvalid={errors.nomor_notifikasi_impor}
                                errorMessage={errors.nomor_notifikasi_impor && errors.nomor_notifikasi_impor.message}
                                className="col-span-2"
                            />
                        </div>
                        <div>
                            <Button isDisabled={isSubmitting} isLoading={isSubmitting} type="submit" color='primary'>Simpan</Button>
                        </div>
                    </CardBody>
                </Card>
            </form>
        </div>
    )
}
