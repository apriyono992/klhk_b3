import { Button, Card, CardBody, CardHeader, Divider, Input, Select, SelectItem } from '@nextui-org/react'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import { getFetcher, getSelectFetcher, patchFetcherWithoutId } from '../../../../services/api';
import ReactSelect from '../../../elements/ReactSelect';
import { draftRecomendationLetter } from '../../../../services/validation';
import { dirtyInput, isResponseErrorObject } from '../../../../services/helpers';

export default function Draft({ data, mutate }) {
    const { register, handleSubmit, control, formState: { errors, isSubmitting, dirtyFields }, } = useForm({
        resolver: yupResolver(draftRecomendationLetter), 
        defaultValues: {
            tembusanIds: data?.draftSurat?.tembusan?.map((item) => ({ value: item.id, label: item.nama })),
            nomorSurat: data?.draftSurat?.nomorSurat,
            tipeSurat: data?.draftSurat?.tipeSurat,
            pejabatId: {value: data.draftSurat?.pejabat?.id, label: data?.draftSurat?.pejabat?.nama},
        }
    })
    const { data: dataPejabat, isLoading: isLoadingPejabat } = useSWR('/api/data-master/pejabat?limit=100', getSelectFetcher);
    const { data: dataTembusan, isLoading: isLoadingTembusan } = useSWR('/api/data-master/tembusan?limit=100', getSelectFetcher);
    
    async function onSubmit(formData) {
        try {
            // await new Promise(r => setTimeout(r, 1000));
            const filteredData = dirtyInput(dirtyFields, formData);
            filteredData.draftId = data?.draftSurat.id
            console.log(filteredData);
            
            await patchFetcherWithoutId('/api/rekom/permohonan/draft-surat', filteredData);
            mutate()
            toast.success('Draft sk berhasil diubah!');
        } catch (error) {
            isResponseErrorObject(error.response.data.message)
                ? Object.entries(error.response.data.message).forEach(([key, value]) => {
                    toast.error(value);
                })
                : toast.error(error.response.data.message)
        }
    }

    return (
        <div className=''>
            <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-1 md:grid-cols-5 gap-3 py-3'>
                <Card radius='sm' className='col-span-3 h-[500px]'>
                    <CardHeader>
                        <p className="text-md">Tembusan</p>
                    </CardHeader>
                    <Divider/>
                    <CardBody>
                        <Controller
                            name="tembusanIds"
                            control={control}
                            render={({ field, fieldState }) => (
                                <ReactSelect
                                    label="Tembusan"
                                    isMulti={true}
                                    data={dataTembusan}
                                    isLoading={isLoadingTembusan}
                                    value={field.value}
                                    onChange={(selectedOptions) => field.onChange(selectedOptions.map(option => option.value))}
                                    error={fieldState.error && fieldState.error.message}
                                /> 
                            )}
                        />  
                    </CardBody>
                </Card>
                <Card radius='sm' className='col-span-2'>
                    <CardHeader>
                        <p className="text-md">Draft Sk</p>
                    </CardHeader>
                    <Divider/>
                    <CardBody>
                        <div className='flex flex-col gap-3 mb-5'>
                            <Input
                                {...register('nomorSurat')}
                                isRequired
                                variant="faded" 
                                type="text" 
                                label="Nomor Surat" 
                                labelPlacement='outside'
                                placeholder="..."
                                color={errors.nomorSurat ? 'danger' : 'default'}
                                isInvalid={errors.nomorSurat} 
                                errorMessage={errors.nomorSurat && errors.nomorSurat.message}
                                className="col-span-2"
                            />
                            <Input
                                {...register('tipeSurat')}
                                isRequired
                                variant="faded" 
                                type="text" 
                                label="Tipe Surat" 
                                labelPlacement='outside'
                                placeholder="..."
                                color={errors.tipeSurat ? 'danger' : 'default'}
                                isInvalid={errors.tipeSurat} 
                                errorMessage={errors.tipeSurat && errors.tipeSurat.message}
                                className="col-span-2"
                            />
                            {/* <Select
                                {...register('pejabatId')} 
                                variant="faded" 
                                label="Pejabat" 
                                isRequired
                                color={errors.pejabatId ? 'danger' : 'default'}
                                isInvalid={errors.pejabatId} 
                                errorMessage={errors.pejabatId && errors.pejabatId.message}
                                defaultSelectedKeys={[`${data.draftSurat.pejabat.id}` ?? '']}
                            >
                                {dataPejabat?.data.map((item) => (
                                    <SelectItem key={item.id}>{item.nama}</SelectItem>
                                ))}
                            </Select> */}
                            <Controller
                                name="pejabatId"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <ReactSelect
                                        label="Pejabat"
                                        data={dataPejabat}
                                        isLoading={isLoadingPejabat}
                                        value={field.value}
                                        onChange={(selectedOptions) => field.onChange(selectedOptions.value)}
                                        error={fieldState.error && fieldState.error.message}
                                    /> 
                                )}
                            />  
                        </div>
                        <div>
                            <Button isDisabled={isSubmitting || Object.keys(dirtyFields).length === 0} isLoading={isSubmitting} type="submit" color='primary'>Simpan</Button>
                        </div>
                    </CardBody>
                </Card>
            </form>
        </div>
    )
}
