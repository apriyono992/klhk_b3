import React from 'react'
import { getFetcher, getSelectB3SubstanceFetcher, postFetcher } from '../../../../../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
import { useForm } from 'react-hook-form';
import { isResponseErrorObject } from '../../../../../services/helpers';
import toast from 'react-hot-toast';
import ControlledReactSelect from '../../../../../components/elements/ControlledReactSelect';
import ControlledInput from '../../../../../components/elements/ControlledInput';
import InlineEditAsalMuat from '../../../../../components/fragments/admin/report/transport/InlineEditAsalMuat';
import { Button, Card, CardBody, CardHeader, Input } from '@nextui-org/react';
import RootAdmin from '../../../../../components/layouts/RootAdmin';
import HeaderPage from '../../../../../components/elements/HeaderPage';
import { month } from '../../../../../services/enum';
import InlineEditTujuanBongkar from '../../../../../components/fragments/admin/report/transport/InlineEditTujuanBongkar';
import { yupResolver } from '@hookform/resolvers/yup';
import { createReportVehicleValidation } from '../../../../../services/validation';

export default function VehicleEditPage() {
    const {id} = useParams();
    const navigate = useNavigate();
    const {data, isLoading} = useSWR(`/api/pelaporan-pengangkutan/find/${id}`, getFetcher)
    const { data: dataMaterial, isLoading: isLoadingMaterial } = useSWR(!isLoading ? `/api/b3-substance/search?applicationId=${data?.applicationId}` : null, getSelectB3SubstanceFetcher)
    const { register, handleSubmit, setValue, control, formState: { errors, isSubmitting, dirtyFields } } = useForm({ resolver: yupResolver(createReportVehicleValidation) });
    
    async function onSubmitForm(formData) {
        try {
            const d = {
                b3SubstanceId: formData.b3SubstanceId,
                jumlahB3: parseInt(formData.jumlahB3),
                perusahaanAsalMuatDanTujuanBongkar: [{
                    perusahaanAsalMuatId: formData.perusahaanAsalMuat.perusahaanAsalMuatId,
                    locationType: formData.perusahaanAsalMuat.locationType,
                    longitudeAsalMuat: formData.perusahaanAsalMuat.longitudeAsalMuat,
                    latitudeAsalMuat: formData.perusahaanAsalMuat.latitudeAsalMuat,
                    perusahaanTujuanBongkar: formData.perusahaanTujuanBongkar
                }]
            }
            console.log(data?.id);
            
            await postFetcher(`/api/pelaporan-pengangkutan/add/${data?.id}`, d);
            toast.success('Laporan pengangkutan berhasil dibuat')
            navigate(-1)
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
            <HeaderPage title={`${data?.vehicle?.modelKendaraan} / ${data?.vehicle?.noPolisi}`} subtitle={"Ubah Riwayat Pengangkutan"}  />
            <Card radius='sm' className='mt-3'>
                <CardHeader>
                    Ubah Bahan B3 Awal
                </CardHeader>
                <CardBody>
                    <form onSubmit={handleSubmit(onSubmitForm)} className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                        <Card radius='sm' className='col-span-3 '>
                            <CardBody className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                                <Input label="Periode" labelPlacement='outside' isRequired isDisabled value={data?.period.name} />
                                <Input label="Bulan" labelPlacement='outside' isRequired isDisabled value={month[data?.bulan - 1]} />
                                <Input label="Tahun" labelPlacement='outside' isRequired isDisabled value={data?.tahun} />
                                <div className='col-span-2'>
                                    <ControlledReactSelect
                                        options={dataMaterial}
                                        control={control}
                                        isLoading={isLoadingMaterial}
                                        label="Bahan B3"
                                        name="b3SubstanceId"
                                    />
                                </div>
                                <ControlledInput
                                    name="jumlahB3"
                                    label="Jumlah B3"
                                    type="number"
                                    isRequired={true}
                                    control={control}
                                />
                            </CardBody>
                        </Card>
                        <Card radius='sm' className='col-span-1'>
                            <CardBody>
                                <InlineEditAsalMuat companyId={data?.companyId} control={control} setValue={setValue} />
                            </CardBody>
                        </Card>
                        <Card radius='sm' className='col-span-2'>
                            <CardBody>
                                <InlineEditTujuanBongkar companyId={data?.companyId} control={control} setValue={setValue} />
                            </CardBody>
                        </Card>
                        <div className='mt-3 space-x-2'>
                            <Button color='primary' type='submit'>Simpan</Button>
                            <Button onPress={() => navigate(-1)} color='warning' variant='flat'>Kembali</Button>
                        </div>
                    </form>
                </CardBody>
            </Card>
        </RootAdmin>
    )
}