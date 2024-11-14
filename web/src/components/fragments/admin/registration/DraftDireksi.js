import { Button, Card, CardBody, CardHeader, Divider, Input, Select, SelectItem, Textarea } from '@nextui-org/react'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import MultiSelectSort from '../../../elements/MultiSelectSort'
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import {simpanSK, submitSK} from '../../../../services/api';
import { useNavigate } from 'react-router-dom';
import { REGISTRATION_INDEX_PATH } from '../../../../services/routes';
import useAuth from "../../../../hooks/useAuth";

export default function DraftDireksi(id) {
    const { data } = useAuth()
    const navigate = useNavigate();
    const formSchema =  yup.object().shape({
        nomor_surat: yup.string().required('harus diisi'),
        tanggal_surat: yup.date()
            .typeError('Tanggal harus valid')
            .required('harus diisi'),

    }).required()

    const { register, handleSubmit, control, formState: { errors, isSubmitting }, } = useForm({resolver: yupResolver(formSchema)})

    async function onSubmit(dataSK) {
        const dataTanggalSurat = new Date(dataSK?.tanggal_surat)
        const newData = {
            ...dataSK,
            tanggal_surat: format(dataTanggalSurat, 'yyyy-MM-dd'),
            status: "approved by direksi",
            approved_by: data.fullName
        }

        try {
            const response = await submitSK(id.id, newData);
            console.log(response, 'success');
            toast.success('Draft sk berhasil dibuat!');
            navigate(REGISTRATION_INDEX_PATH, { replace: true })
        } catch (error) {
            toast.error('Gagal buat draft sk!');
        }
    }

    return (
        <div className=''>
            <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-1 gap-3 py-3'>
                <Card radius='sm'>
                    <CardHeader>
                        <p className="text-md">Draft Sk</p>
                    </CardHeader>
                    <Divider/>
                    <CardBody>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3 mb-5'>
                            <Input
                                {...register('nomor_surat')}
                                isRequired
                                variant="faded"
                                type="text"
                                label="Nomor Surat"
                                color={errors.nomor_surat ? 'danger' : 'default'}
                                isInvalid={errors.nomor_surat}
                                errorMessage={errors.nomor_surat && errors.nomor_surat.message}
                                className="col-span-2"
                            />
                            <Input
                                {...register('tanggal_surat')}
                                variant="faded"
                                label="Tanggal Surat"
                                type="date"
                                isRequired
                                color={errors.tanggal_surat ? 'danger' : 'default'}
                                isInvalid={errors.tanggal_surat}
                                errorMessage={errors.tanggal_surat && errors.tanggal_surat.message}
                                className='col-span-2'
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
