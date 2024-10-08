import { Input, Textarea } from '@nextui-org/react';
import React from 'react'
import { useFormContext } from 'react-hook-form';
import * as yup from 'yup';

export const stepTwoSchema =  yup.object().shape({
    company_name: yup.string().required('harus diisi'),
    company_contact: yup.string().required('harus diisi').matches(/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/, 'nomor tidak valid'),
    company_address: yup.string().required('harus diisi'),
    company_pool_address: yup.string().required('harus diisi'),
    company_pool_contact: yup.string().required('harus diisi').matches(/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/, 'nomor tidak valid'),
    company_bussiness_field: yup.string().required('harus diisi'),
}).required()

export default function StepTwoForm() {
    const { register, formState: { errors } } = useFormContext();
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            <Input 
                {...register('company_name')}
                isRequired
                variant="faded" 
                type="text" 
                label="Nama Perusahaan" 
                color={errors.company_name ? 'danger' : 'default'}
                isInvalid={errors.company_name} 
                errorMessage={errors.company_name && errors.company_name.message}
            />
            <Input 
                {...register('company_contact')}
                isRequired
                variant="faded" 
                type="text" 
                label="Nomot Telepon/Fax" 
                color={errors.company_contact ? 'danger' : 'default'}
                isInvalid={errors.company_contact} 
                errorMessage={errors.company_contact && errors.company_contact.message}
            />
            <Textarea 
                {...register('company_address')}
                isRequired
                variant="faded" 
                type="text" 
                label="Alamat Perusahaan" 
                color={errors.company_address ? 'danger' : 'default'}
                isInvalid={errors.company_address} 
                errorMessage={errors.company_address && errors.company_address.message}
            />
            <Textarea 
                {...register('company_pool_address')}
                isRequired
                variant="faded" 
                type="text" 
                label="Alamat Pool Kendaraan" 
                color={errors.company_pool_address ? 'danger' : 'default'}
                isInvalid={errors.company_pool_address} 
                errorMessage={errors.company_pool_address && errors.company_pool_address.message}
            />
            <Input 
                {...register('company_pool_contact')}
                isRequired
                variant="faded" 
                type="text" 
                label="Nomor Telepon/Fax Pool Kendaraan" 
                color={errors.company_pool_contact ? 'danger' : 'default'}
                isInvalid={errors.company_pool_contact} 
                errorMessage={errors.company_pool_contact && errors.company_pool_contact.message}
            />
            <Input 
                {...register('company_bussiness_field')}
                isRequired
                variant="faded" 
                type="text" 
                label="Bidang Usaha" 
                color={errors.company_bussiness_field ? 'danger' : 'default'}
                isInvalid={errors.company_bussiness_field} 
                errorMessage={errors.company_bussiness_field && errors.company_bussiness_field.message}
            />
        </div>
    )
}
