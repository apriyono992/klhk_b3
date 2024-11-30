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
import TransportComponent from '../../../../../components/fragments/admin/report/transport/TransportComponent';

export default function VehicleCreatePage() {
    const {periodeId} = useParams();
    const navigate = useNavigate();
    const {data, isLoading} = useSWR(`/api/pelaporan-pengangkutan/find/${periodeId}`, getFetcher)
    const { data: dataMaterial, isLoading: isLoadingMaterial } = useSWR(!isLoading ? `/api/b3-substance/search?applicationId=${data?.applicationId}` : null, getSelectB3SubstanceFetcher)
    const { register, handleSubmit, setValue, control, formState: { errors, isSubmitting, dirtyFields } } = useForm({ resolver: yupResolver(createReportVehicleValidation)});
    
    async function onSubmitForm(formData) {
        try {
            const payload = {
                b3SubstanceId: formData.b3SubstanceId,
                jumlahB3: formData.jumlahB3,
                perusahaanAsalMuatDanTujuanBongkar: formData?.perusahaanAsalMuatDanTujuanBongkar?.map(item => ({
                    perusahaanAsalMuatId: item.perusahaanAsalMuat.perusahaanAsalMuatId,
                    locationType: item.perusahaanAsalMuat.locationType,
                    longitudeAsalMuat: item.perusahaanAsalMuat.longitudeAsalMuat,
                    latitudeAsalMuat: item.perusahaanAsalMuat.latitudeAsalMuat,
                    perusahaanTujuanBongkar: item.perusahaanTujuanBongkar?.map(item => ({
                        perusahaanTujuanBongkarId: item.perusahaanTujuanBongkarId,
                        locationType: item.locationType, 
                        longitudeTujuanBongkar: item.longitudeTujuanBongkar,
                        latitudeTujuanBokar: item.latitudeTujuanBokar,
                    })),
                })),
            };

            await postFetcher(`/api/pelaporan-pengangkutan/add/${data?.id}`, payload);
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
            <HeaderPage title={`${data?.vehicle?.modelKendaraan} / ${data?.vehicle?.noPolisi}`} subtitle={"Buat Riwayat Pengangkutan"}  />
            <Card radius='sm' className='mt-3'>
                <CardHeader>
                    Tambah Bahan B3 Awal
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
                        <div className='col-span-3'>
                            <TransportComponent companyId={data?.companyId} control={control} setValue={setValue}/>
                        </div>
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