import { Button, Card, CardBody, CardHeader, Divider, Input, Select, SelectItem, Textarea } from '@nextui-org/react'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import MultiSelectSort from '../../../elements/MultiSelectSort'
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import { draftPermit, month } from '../../../../services/enum';
import useSWR from 'swr';
import { getFetcher, getSelectFetcher } from '../../../../services/api';

export default function Draft() {
    const formSchema =  yup.object().shape({
        tembusan: yup.array()
                        .min(1, 'Minimal 1 tembusan')
                        .required('Harus diisi'),
        nomorSurat: yup.string().required('harus diisi'),
        // letter_month: yup.number()
        //                 .typeError('Harus diisi')
        //                 .integer('Harus angka')
        //                 .positive('Harus angka'),
        // letter_year: yup.number()
        //                 .typeError('Tahun harus valid')
        //                 .integer('Harus angka').min(1900, 'Tahun tidak valid')
        //                 .max(2099, `Tahun tidak valid`)
        //                 .required('harus diisi'),
        // letter_permit: yup.number()
        //                 .typeError('Harus diisi')
        //                 .integer('Harus angka')
        //                 .positive('Harus angka'),
        // letter_note: yup.string().required('harus diisi'),
        pejabatId: yup.string().required('harus diisi'),
        // letter_publication_date: yup.date()
        //                             .typeError('Tanggal harus valid')
        //                             .required('harus diisi'),
        // letter_from_date: yup.date()
        //                     .typeError('Tanggal harus valid')
        //                     .required('harus diisi'),
        // letter_to_date: yup.date()
        //                     .typeError('Tanggal harus valid')
        //                     .required('harus diisi'),
        // letter_notification: yup.string().required('harus diisi'),
        
    }).required()

    const { register, handleSubmit, control, formState: { errors, isSubmitting }, } = useForm({resolver: yupResolver(formSchema)})
    const { data, isLoading } = useSWR('/api/data-master/pejabat?limit=100', getFetcher);
    console.log(data?.data);
    

    async function onSubmit(data) {
        try {
            await new Promise((r) => setTimeout(r, 1000));
            console.log(data);
            toast.success('Draft sk berhasil dibuat!');
        } catch (error) {
            toast.error('Gagal buat draft sk!');
        }
    }

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
                                {...register('nomorSurat')}
                                isRequired
                                variant="faded" 
                                type="text" 
                                label="Nomor Surat" 
                                color={errors.nomorSurat ? 'danger' : 'default'}
                                isInvalid={errors.nomorSurat} 
                                errorMessage={errors.nomorSurat && errors.nomorSurat.message}
                                className="col-span-2"
                            />
                            {/* <Select
                                {...register('letter_month')} 
                                variant="faded" 
                                label="Bulan" 
                                placeholder="Pilih"
                                isRequired
                                color={errors.letter_month ? 'danger' : 'default'}
                                isInvalid={errors.letter_month} 
                                errorMessage={errors.letter_month && errors.letter_month.message}
                            >
                                {month.map((item) => (
                                    <SelectItem key={item}>{item}</SelectItem>
                                ))}
                            </Select> */}
                            {/* <Input
                                {...register('letter_year')}
                                isRequired
                                variant="faded" 
                                type="text" 
                                label="Tahun" 
                                color={errors.letter_year ? 'danger' : 'default'}
                                isInvalid={errors.letter_year} 
                                errorMessage={errors.letter_year && errors.letter_year.message}
                            /> */}
                            {/* <Select
                                {...register('letter_permit')} 
                                variant="faded" 
                                label="Status Izin" 
                                placeholder="Pilih"
                                isRequired
                                color={errors.letter_permit ? 'danger' : 'default'}
                                isInvalid={errors.letter_permit} 
                                errorMessage={errors.letter_permit && errors.letter_permit.message}
                                className='col-span-2'
                            >
                                {draftPermit.map((item) => (
                                    <SelectItem key={item}>{item}</SelectItem>
                                ))}
                            </Select> */}
                            {/* <Textarea
                                {...register('letter_note')} 
                                variant="faded" 
                                label="Keterangan SK" 
                                isRequired
                                color={errors.letter_note ? 'danger' : 'default'}
                                isInvalid={errors.letter_note} 
                                errorMessage={errors.letter_note && errors.letter_note.message}
                                className="col-span-2"
                            /> */}
                            <Select
                                {...register('pejabatId')} 
                                variant="faded" 
                                label="Pejabat" 
                                placeholder="Pilih"
                                isRequired
                                color={errors.pejabatId ? 'danger' : 'default'}
                                isInvalid={errors.pejabatId} 
                                errorMessage={errors.pejabatId && errors.pejabatId.message}
                            >
                                {data?.data.map((item) => (
                                    <SelectItem key={item.id}>{item.nama}</SelectItem>
                                ))}
                            </Select>
                            {/* <Input
                                {...register('letter_publication_date')} 
                                variant="faded" 
                                label="Tanggal Terbit"
                                type="date" 
                                isRequired
                                color={errors.letter_publication_date ? 'danger' : 'default'}
                                isInvalid={errors.letter_publication_date} 
                                errorMessage={errors.letter_publication_date && errors.letter_publication_date.message}
                            /> */}
                            {/* <Input
                                {...register('letter_from_date')} 
                                variant="faded" 
                                label="Berlaku Dari"
                                type="date" 
                                isRequired
                                color={errors.letter_from_date ? 'danger' : 'default'}
                                isInvalid={errors.letter_from_date} 
                                errorMessage={errors.letter_from_date && errors.letter_from_date.message}
                            /> */}
                            {/* <Input
                                {...register('letter_to_date')} 
                                variant="faded" 
                                label="Sampai"
                                type="date" 
                                isRequired
                                color={errors.letter_to_date ? 'danger' : 'default'}
                                isInvalid={errors.letter_to_date} 
                                errorMessage={errors.letter_to_date && errors.letter_to_date.message}
                            /> */}
                            {/* <Input
                                {...register('letter_notification')}
                                variant="faded" 
                                isRequired
                                type="text" 
                                label="Nomor Notifikasi Impor" 
                                color={errors.letter_notification ? 'danger' : 'default'}
                                isInvalid={errors.letter_notification} 
                                errorMessage={errors.letter_notification && errors.letter_notification.message}
                                className="col-span-2"
                            /> */}
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
