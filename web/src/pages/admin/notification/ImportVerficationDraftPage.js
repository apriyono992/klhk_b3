import { getFetcher, getPdfUrl, getSelectFetcher, putFetcher } from '../../../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
import RootAdmin from '../../../components/layouts/RootAdmin';
import { Button, Card, CardBody, CardHeader, Divider, Input, Select, SelectItem, Spinner } from '@nextui-org/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { isResponseErrorObject } from '../../../services/helpers';
import toast from 'react-hot-toast';
import { draftImportVerficationLetter } from '../../../services/validation';
import { ArrowLeftIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import ControlledInput from '../../../components/elements/ControlledInput';
import { useEffect, useState } from 'react';
import ControlledReactSelect from '../../../components/elements/ControlledReactSelect';
import Error from '../../../components/fragments/Error';

export default function ImportVerficationDraftPage() {
    const { notificationId } = useParams();
    const navigate = useNavigate();
    const [importVerficationData, setImportVerficationData] = useState([]);
    const { data, isLoading, error, mutate } = useSWR(`/api/notifikasi/${notificationId}`, getFetcher);
    const { data: dataTembusan, isLoading: isLoadingTembusan } = useSWR('/api/data-master/tembusan?limit=100', getSelectFetcher);
    const { data: dataPejabat, isLoading: isLoadingPejabat } = useSWR('/api/data-master/pejabat?limit=100', getSelectFetcher);
    const { register, handleSubmit, reset, control, formState: { errors, isSubmitting, dirtyFields } } = useForm({resolver: yupResolver(draftImportVerficationLetter)});

    useEffect(() => {
        if (!isLoading && !error && data?.draftSuratNotifikasiId?.length > 0) {
            setImportVerficationData(data.draftSuratNotifikasiId.filter(item => item.KebenaranImport?.length > 0))
            const filteredData = data.draftSuratNotifikasiId.filter(item => item.KebenaranImport?.length > 0);
            if (filteredData.length > 0) {
                reset({
                    nomorSurat: filteredData[0]?.nomorSurat ?? undefined,
                    sifatSurat: filteredData[0]?.sifatSurat ?? undefined,
                    tipeSurat: filteredData[0]?.tipeSurat ?? undefined,
                    tanggalSurat: filteredData[0]?.tanggalSurat ? format(filteredData[0]?.tanggalSurat, 'yyyy-MM-dd') : undefined,
                    perusaahaanAsal: filteredData[0]?.perusaahaanAsal ?? undefined,
                    namaPengirimNotifikasi: filteredData[0]?.namaPengirimNotifikasi ?? undefined,
                    emailPenerima: filteredData[0]?.emailPenerima ?? '',
                    tanggalMaksimalSurat: filteredData[0]?.KebenaranImport?.[0]?.tanggalMaksimalPengiriman ? format(filteredData[0]?.KebenaranImport[0]?.tanggalMaksimalPengiriman, 'yyyy-MM-dd') : undefined,
                    pejabatId: filteredData[0]?.pejabat?.id ?? undefined,
                    tembusanIds: filteredData[0]?.NotifikasiTembusan?.map((item) => item.DataTembusan?.id) ?? undefined,
                    tanggalPengiriman: filteredData[0]?.tanggalPengiriman ? format(filteredData[0]?.tanggalPengiriman, 'yyyy-MM-dd') : undefined,
                });
            }
        }
    }, [data, isLoading, error, reset]);
    

    async function onSubmitForm(formData) {
        try {
            formData.negaraAsal = data?.negaraAsal
            formData.referenceNumber = data?.referenceNumber
            formData.draftNotifikasiId = importVerficationData[0]?.id
            console.log(formData);
            await putFetcher('/api/draft-surat-notifikasi/kebenaran-import', importVerficationData[0]?.id, formData);
            mutate();
            toast.success('Draft surat kebenaran import berhasil diubah!');
        } catch (error) {
            isResponseErrorObject(error.response.data.message)
                ? Object.entries(error.response.data.message).forEach(([key, value]) => {
                    toast.error(value);
                })
                : toast.error(error.response.data.message)
        }
    }

    async function openPdfDirectly(endpoint) {
        try {
            await getPdfUrl(endpoint)
        } catch (error) {            
            toast.error('Failed to open PDF');
        }
    };

    if (error?.status === 404 || data?.status === 'Diterima dari Otoritas Asal B3' || data?.status === 'Verifikasi Administrasi dan Teknis') return (<Error code={error?.status} header="Tidak ditemukan" message="Pastikan URL draft surat kebenaran impor sudah sesuai"/>)

        return (
            <RootAdmin>
                <Card radius='sm' className='mt-3'>
                    <CardHeader className='flex items-center justify-between'>
                        <span>Draft Surat Kebenaran Import</span>
                        <div className='flex items-center gap-1'>
                            <Button color='primary' size='sm' startContent={<ArrowLeftIcon className='size-4' />} variant='faded' onPress={() => navigate(-1, { replace: true })}>Kembali</Button>
                            <Button startContent={<DocumentIcon className="size-4" />} size="sm" color="primary" onPress={() => openPdfDirectly(`/api/pdf/generateKebenaranImpor/${data?.referenceNumber}`)}>
                                Lihat Draft
                            </Button>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <form onSubmit={handleSubmit(onSubmitForm)}>
                            {
                                !isLoading && importVerficationData?.length > 0 
                                ?
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-3 mb-6'>
                                    <Card className='col-span-2'>
                                        <CardHeader>
                                            <span>Kop Surat</span>
                                        </CardHeader>
                                        <Divider/>
                                        <CardBody className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                                            <ControlledInput label={'Nomor Surat'} name="nomorSurat" type="text" control={control} />
                                            <Select 
                                                {...register('sifatSurat')}
                                                isRequired
                                                variant="faded" 
                                                label="Sifat Surat"
                                                labelPlacement='outside'
                                                placeholder="Pilih..." 
                                                color={errors.sifatSurat ? 'danger' : 'default'}
                                                isInvalid={errors.sifatSurat} 
                                                errorMessage={errors.sifatSurat && errors.sifatSurat.message}
                                            >
                                                <SelectItem key="Biasa">Biasa</SelectItem>
                                            </Select>
                                            <Select 
                                                {...register('tipeSurat')}
                                                isRequired
                                                variant="faded" 
                                                label="Tipe Surat"
                                                labelPlacement='outside'
                                                placeholder="Pilih..."
                                                color={errors.tipeSurat ? 'danger' : 'default'}
                                                isInvalid={errors.tipeSurat} 
                                                errorMessage={errors.tipeSurat && errors.tipeSurat.message}
                                            >
                                                <SelectItem key="Kebenaran Import Pestisida" value="Kebenaran Import Pestisida">Kebenaran Import Pestisida</SelectItem>
                                                <SelectItem key="Kebenaran Import Biasa" value="Kebenaran Import Biasa">Kebenaran Import Biasa</SelectItem>
                                            </Select>
                                            <ControlledInput label="Tanggal Surat Diterbitkan" name="tanggalSurat" type="date" control={control} />
                                            <ControlledInput label={'Perusahaan Asal'} name="perusaahaanAsal" isRequired={true} control={control} />
                                        </CardBody>
                                    </Card>
                                    <Card>
                                        <CardHeader>
                                            <span>Poin Pertama</span>    
                                        </CardHeader>
                                        <Divider/>
                                        <CardBody className='flex flex-col gap-3'>
                                            <ControlledInput label="Nama Pengirim Notifikasi" name="namaPengirimNotifikasi" type="text" isRequired={true} control={control} />
                                        </CardBody>
                                    </Card>
                                    <Card>
                                        <CardHeader>
                                            <span>Poin Kedua</span>    
                                        </CardHeader>
                                        <Divider/>
                                        <CardBody className='flex flex-col gap-3'>
                                            <Input isDisabled isRequired label="Negara Asal" labelPlacement='outside' value={data?.negaraAsal} variant='faded' />
                                        </CardBody>
                                    </Card>
                                    <div className='flex flex-col gap-3'>
                                        <Card className='flex-1'>
                                            <CardHeader>
                                                <span>Poin Ketiga</span>    
                                            </CardHeader>
                                            <Divider/>
                                            <CardBody className='flex flex-col gap-3'>
                                                <ControlledInput label="Email Penerima" name="emailPenerima" type="email" isRequired={true} control={control} />
                                                <ControlledInput label="Tanggal Maksimal Konfirmasi Surat" name="tanggalMaksimalSurat" type="date" control={control} />
                                            </CardBody>
                                        </Card>
                                        <Card>
                                            <CardHeader>
                                                <span>Tambahan</span>    
                                            </CardHeader>
                                            <Divider/>
                                            <CardBody className='flex flex-col gap-3'>
                                                <ControlledInput label="Tanggal Email Konfirmasi Masuk" name="tanggalPengiriman" type="date" control={control} />
                                            </CardBody>
                                        </Card>
                                    </div>
                                    <Card className='min-h-[500px]'>
                                        <CardHeader>
                                            <span>Pejabat dan Tembusan</span>    
                                        </CardHeader>
                                        <Divider/>
                                        <CardBody className='flex flex-col gap-3'>
                                            <ControlledReactSelect
                                                label="Pejabat"
                                                name="pejabatId"
                                                control={control}
                                                options={dataPejabat}
                                                isLoading={isLoadingPejabat}
                                            />
                                            <ControlledReactSelect
                                                label="Tembusan"
                                                name="tembusanIds"
                                                control={control}
                                                options={dataTembusan}
                                                isLoading={isLoadingTembusan}
                                                isMulti={true}
                                            />
                                        </CardBody>
                                    </Card>  
                                </div>
                                :
                                <div className='flex flex-col gap-3'>
                                    <Spinner/>
                                </div>
                            }
                            
                            <Button isDisabled={isSubmitting || Object.keys(dirtyFields).length === 0} isLoading={isSubmitting} color='primary' type='submit'>Simpan</Button>
                        </form>
                    </CardBody>
                </Card>
            </RootAdmin>
        )
    }
