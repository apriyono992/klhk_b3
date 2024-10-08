import { Input, Textarea } from '@nextui-org/react';
import React from 'react'
import { useFormContext } from 'react-hook-form';
import * as yup from 'yup';

export const stepOneSchema =  yup.object().shape({
    personal_name: yup.string().required('harus diisi'),
    personal_position: yup.string().required('harus diisi'),
    personal_address: yup.string().required('harus diisi'),
    personal_contact: yup.string().required('harus diisi').matches(/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/, 'nomor tidak valid'),
    personal_email: yup.string().email('format email salah').required('harus diisi'),
}).required()

export default function StepOneForm() {
    const { register, formState: { errors } } = useFormContext();
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            <Input 
                {...register('personal_name')}
                isRequired
                variant="faded" 
                type="text" 
                label="Nama Pemohon" 
                color={errors.personal_name ? 'danger' : 'default'}
                isInvalid={errors.personal_name} 
                errorMessage={errors.personal_name && errors.personal_name.message}
            />
            <Input 
                {...register('personal_position')}
                isRequired
                variant="faded" 
                type="text" 
                label="Jabatan" 
                color={errors.personal_position ? 'danger' : 'default'}
                isInvalid={errors.personal_position} 
                errorMessage={errors.personal_position && errors.personal_position.message}
            />
            <Textarea 
                {...register('personal_address')}
                isRequired
                className="col-span-2" 
                variant="faded" 
                type="text" 
                label="Alamat" 
                color={errors.personal_address ? 'danger' : 'default'}
                isInvalid={errors.personal_address} 
                errorMessage={errors.personal_address && errors.personal_address.message}
            />
            <Input 
                {...register('personal_contact')}
                isRequired 
                variant="faded" 
                type="text" 
                label="Nomor Telepon/HP" 
                color={errors.personal_contact ? 'danger' : 'default'}
                isInvalid={errors.personal_contact} 
                errorMessage={errors.personal_contact && errors.personal_contact.message}
            />
            <Input 
                {...register('personal_email')}
                isRequired 
                variant="faded" 
                type="email" 
                label="Email" 
                color={errors.personal_email ? 'danger' : 'default'}
                isInvalid={errors.personal_email} 
                errorMessage={errors.personal_email && errors.personal_email.message}
            />
        </div>
    )
}
