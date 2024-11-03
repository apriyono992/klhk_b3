import { Button, Card, CardBody, Input, Select, SelectItem, Textarea } from '@nextui-org/react'
import React from 'react'
import { patchFetcher } from '../../../../services/api';
import { isResponseErrorObject } from '../../../../services/helpers';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { notificationStatus } from '../../../../services/enum';
import { XCircleIcon } from '@heroicons/react/24/outline';
import useAuth from '../../../../hooks/useAuth';

export default function Form({ data, mutate, className }) {
    const formSchema =  yup.object().shape({
        tanggalPerubahan: yup.date().typeError('Tanggal harus valid').required('harus diisi'),
        notes: yup.string().required('Harus diisi'),
        status: yup.string().required('Harus diisi'),
    }).required()
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({resolver: yupResolver(formSchema)});
    const { data: user } = useAuth();
    async function onSubmitForm(formData) {
        try {
            formData.companyId = data?.company?.id
            formData.changeBy = user.userId
            await patchFetcher('/api/notifikasi', data?.id, formData);
            mutate()
            reset();
            toast.success('Riwayat notifikasi berhasil ditambah!');
        } catch (error) {
            isResponseErrorObject(error.response.data.message)
                ? Object.entries(error.response.data.message).forEach(([key, value]) => {
                    toast.error(value);
                })
                : toast.error(error.response.data.message)
        }
    }

    return (
        <Card radius='sm' className={className}>
            <CardBody>
                {
                    data?.status === 'Dibatalkan' || data?.status === 'Selesai'
                        ? 
                            <div className='h-full flex flex-col items-center justify-center text-center'>
                                <XCircleIcon className='size-14 text-red-500' />
                                <span className='text-neutral-400'>Tidak ada perbaruan yang dapat dilakukan</span>
                            </div>
                        :
                            <form onSubmit={handleSubmit(onSubmitForm)}>
                                <div className='flex flex-col gap-3 mb-6'>
                                    <Input
                                        {...register('tanggalPerubahan')}
                                        isRequired
                                        variant="faded" 
                                        type="date"
                                        label="Tanggal Input" 
                                        color={errors.tanggalPerubahan ? 'danger' : 'default'}
                                        isInvalid={errors.tanggalPerubahan} 
                                        errorMessage={errors.tanggalPerubahan && errors.tanggalPerubahan.message}
                                    />  
                                    <Textarea
                                        {...register('notes')}
                                        isRequired
                                        variant="faded" 
                                        type="text" 
                                        label="Catatan" 
                                        color={errors.notes ? 'danger' : 'default'}
                                        isInvalid={errors.notes} 
                                        errorMessage={errors.notes && errors.notes.message}
                                    />
                                    <Select 
                                        {...register('status')}
                                        isRequired
                                        variant="faded" 
                                        label="Status"
                                        color={errors.status ? 'danger' : 'default'}
                                        isInvalid={errors.status} 
                                        errorMessage={errors.status && errors.status.message}
                                    >
                                        {notificationStatus.map((item) => (
                                            <SelectItem key={item}>{item}</SelectItem>
                                        ))}
                                    </Select>     
                                </div>
                                <Button isLoading={isSubmitting} isDisabled={isSubmitting} type='submit' color='primary'>Submit</Button>
                            </form>
                }
            </CardBody>
        </Card>
    )
}
