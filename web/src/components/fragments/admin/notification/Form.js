import { Button, Card, CardBody, Input, Select, SelectItem, Textarea } from '@nextui-org/react'
import React, { useState } from 'react'
import { patchFetcher } from '../../../../services/api';
import { isResponseErrorObject } from '../../../../services/helpers';
import toast from 'react-hot-toast';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { notificationStatus } from '../../../../services/enum';
import { XCircleIcon } from '@heroicons/react/24/outline';
import useAuth from '../../../../hooks/useAuth';
import { notificationStatusChangeValidation } from '../../../../services/validation';

export default function Form({ data, mutate, className }) {
    const [selectedStatus, setSelectedStatus] = useState('');
    const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm({resolver: yupResolver(notificationStatusChangeValidation)});
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
            const objectErrorMessage = Object.entries(error.response.data.message)
                                        .map(([key, value]) => value)
                                        .join(', ');
            isResponseErrorObject(error.response.data.message)
                ? toast.error(objectErrorMessage)
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
                                    <Controller
                                        name="status"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Select 
                                                {...field}
                                                isRequired
                                                variant="faded" 
                                                label="Status"
                                                color={fieldState.error ? 'danger' : 'default'}
                                                isInvalid={fieldState.error} 
                                                errorMessage={fieldState.error && fieldState.error.message}
                                                onChange={(e) => {
                                                    field.onChange(e.target.value)
                                                    setSelectedStatus(e.target.value)
                                                }}
                                            >
                                                {notificationStatus.map((item) => (
                                                    <SelectItem key={item}>{item}</SelectItem>
                                                ))}
                                            </Select>   
                                        )}
                                    />
                                    { 
                                        selectedStatus === 'Ada Rencana Import' && 
                                            <Select 
                                                {...register('tipeSurat')}
                                                isRequired
                                                variant="faded" 
                                                label="Tipe Surat"
                                                color={errors.tipeSurat ? 'danger' : 'default'}
                                                isInvalid={errors.tipeSurat} 
                                                errorMessage={errors.tipeSurat && errors.tipeSurat.message}
                                            >
                                                <SelectItem key="Explicit Consent and Persetujuan ECHA">Explicit Consent and Persetujuan ECHA</SelectItem>
                                                <SelectItem key="Explicit Consent and Persetujuan Non ECHA">Explicit Consent and Persetujuan Non ECHA</SelectItem>
                                            </Select> }
                                    
                                </div>
                                <Button isLoading={isSubmitting} isDisabled={isSubmitting} type='submit' color='primary'>Submit</Button>
                            </form>
                }
            </CardBody>
        </Card>
    )
}