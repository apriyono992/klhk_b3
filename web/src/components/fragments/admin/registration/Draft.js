import { Button, Card, CardBody, CardHeader, Divider, Input, Select, SelectItem, Textarea } from '@nextui-org/react'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import MultiSelectSort from '../../../elements/MultiSelectSort'
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';

export default function Draft() {
    const formSchema =  yup.object().shape({
        letter_copy: yup.array()
            .min(1, 'Minimal 1 tembusan')
            .required('Harus diisi'),
        letter_number: yup.string().required('harus diisi'),
        letter_month: yup.number()
                        .typeError('Harus diisi')
                        .integer('Harus angka')
                        .positive('Harus angka'),
        letter_year: yup.number()
                        .typeError('Tahun harus valid')
                        .integer('Harus angka').min(1900, 'Tahun tidak valid')
                        .max(2099, `Tahun tidak valid`)
                        .required('harus diisi'),
        letter_permit: yup.number()
                        .typeError('Harus diisi')
                        .integer('Harus angka')
                        .positive('Harus angka'),
        letter_note: yup.string().required('harus diisi'),
        letter_publication_date: yup.date()
                                    .typeError('Tanggal harus valid')
                                    .required('harus diisi'),
        letter_from_date: yup.date()
                            .typeError('Tanggal harus valid')
                            .required('harus diisi'),
        letter_to_date: yup.date()
                            .typeError('Tanggal harus valid')
                            .required('harus diisi'),
        letter_notification: yup.string().required('harus diisi'),
        
    }).required()

    const { register, handleSubmit, control, formState: { errors, isSubmitting }, } = useForm({resolver: yupResolver(formSchema)})

    async function onSubmit(data) {
        try {
            await new Promise((r) => setTimeout(r, 1000));
            console.log(data);
            toast.success('Draft sk berhasil dibuat!');
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
                            name='letter_copy'
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
                            <Input
                                {...register('letter_number')}
                                isRequired
                                variant="faded" 
                                type="text" 
                                label="Nomor Surat" 
                                color={errors.letter_number ? 'danger' : 'default'}
                                isInvalid={errors.letter_number} 
                                errorMessage={errors.letter_number && errors.letter_number.message}
                                className="col-span-2"
                            />
                            <Select
                                {...register('letter_month')} 
                                variant="faded" 
                                label="Bulan" 
                                placeholder="Pilih"
                                isRequired
                                color={errors.letter_month ? 'danger' : 'default'}
                                isInvalid={errors.letter_month} 
                                errorMessage={errors.letter_month && errors.letter_month.message}
                            >
                                {month.map((item, index) => (
                                    <SelectItem key={index + 1} value={index + 1}>{item}</SelectItem>
                                ))}
                            </Select>
                            <Input
                                {...register('letter_year')}
                                isRequired
                                variant="faded" 
                                type="text" 
                                label="Tahun" 
                                color={errors.letter_year ? 'danger' : 'default'}
                                isInvalid={errors.letter_year} 
                                errorMessage={errors.letter_year && errors.letter_year.message}
                            />
                            <Select
                                {...register('letter_permit')} 
                                variant="faded" 
                                label="Status Izin" 
                                placeholder="Pilih"
                                isRequired
                                color={errors.letter_permit ? 'danger' : 'default'}
                                isInvalid={errors.letter_permit} 
                                errorMessage={errors.letter_permit && errors.letter_permit.message}
                            >
                                {permit.map((item, index) => (
                                    <SelectItem key={index + 1} value={index + 1}>{item}</SelectItem>
                                ))}
                            </Select>
                            <Textarea
                                {...register('letter_note')} 
                                variant="faded" 
                                label="Keterangan SK" 
                                isRequired
                                color={errors.letter_note ? 'danger' : 'default'}
                                isInvalid={errors.letter_note} 
                                errorMessage={errors.letter_note && errors.letter_note.message}
                                className="col-span-2"
                            />
                            <Input
                                {...register('letter_publication_date')} 
                                variant="faded" 
                                label="Tanggal Terbit"
                                type="date" 
                                isRequired
                                color={errors.letter_publication_date ? 'danger' : 'default'}
                                isInvalid={errors.letter_publication_date} 
                                errorMessage={errors.letter_publication_date && errors.letter_publication_date.message}
                                className='col-span-2'
                            />
                            <Input
                                {...register('letter_from_date')} 
                                variant="faded" 
                                label="Berlaku Dari"
                                type="date" 
                                isRequired
                                color={errors.letter_from_date ? 'danger' : 'default'}
                                isInvalid={errors.letter_from_date} 
                                errorMessage={errors.letter_from_date && errors.letter_from_date.message}
                            />
                            <Input
                                {...register('letter_to_date')} 
                                variant="faded" 
                                label="Sampai"
                                type="date" 
                                isRequired
                                color={errors.letter_to_date ? 'danger' : 'default'}
                                isInvalid={errors.letter_to_date} 
                                errorMessage={errors.letter_to_date && errors.letter_to_date.message}
                            />
                            <Input
                                {...register('letter_notification')}
                                variant="faded" 
                                isRequired
                                type="text" 
                                label="Nomor Notifikasi Impor" 
                                color={errors.letter_notification ? 'danger' : 'default'}
                                isInvalid={errors.letter_notification} 
                                errorMessage={errors.letter_notification && errors.letter_notification.message}
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
