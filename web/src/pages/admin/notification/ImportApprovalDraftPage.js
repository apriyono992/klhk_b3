import { useEffect, useState } from 'react'
import RootAdmin from '../../../components/layouts/RootAdmin'
import { Button, Card, CardBody, CardHeader, Divider, Input, Select, SelectItem, Spinner } from '@nextui-org/react'
import { ArrowLeftIcon, DocumentIcon } from '@heroicons/react/24/outline'
import { getFetcher, getPdfUrl, getSelectFetcher, putFetcher } from '../../../services/api'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { isResponseErrorObject } from '../../../services/helpers'
import { yupResolver } from '@hookform/resolvers/yup'
import { draftImportApprovalLetter } from '../../../services/validation'
import { format } from 'date-fns'
import ControlledInput from '../../../components/elements/ControlledInput'
import ControlledReactSelect from '../../../components/elements/ControlledReactSelect'
import Error from '../../../components/fragments/Error'

export default function ImportApprovalDraftPage() {
    const { notificationId } = useParams();
    const navigate = useNavigate();
    const [importApprovalData, setImportApprovalData] = useState([]);
    const [importVerficationData, setImportVerficationData] = useState([]);
    const { data, isLoading, error, mutate } = useSWR(`/api/notifikasi/${notificationId}`, getFetcher);
    const { data: dataTembusan, isLoading: isLoadingTembusan } = useSWR('/api/data-master/tembusan?limit=100', getSelectFetcher);
    const { data: dataPejabat, isLoading: isLoadingPejabat } = useSWR('/api/data-master/pejabat?limit=100', getSelectFetcher);
    const { register, handleSubmit, reset, control, formState: { errors, isSubmitting, dirtyFields } } = useForm({ resolver: yupResolver(draftImportApprovalLetter)});
    

    useEffect(() => {
        if (!isLoading && !error && data?.draftSuratNotifikasiId?.length > 0) {
            setImportApprovalData(data.draftSuratNotifikasiId.filter(item => item.PersetujuanImport?.length > 0))
            setImportVerficationData(data.draftSuratNotifikasiId.filter(item => item.KebenaranImport?.length > 0))
            const filteredData = data.draftSuratNotifikasiId.filter(item => item.PersetujuanImport?.length > 0);
            
            if (filteredData.length > 0) {
                reset({
                    nomorSurat: filteredData[0]?.nomorSurat ?? undefined,
                    sifatSurat: filteredData[0]?.sifatSurat ?? undefined,
                    tipeSurat: filteredData[0]?.tipeSurat ?? undefined,
                    tanggalSurat: filteredData[0]?.tanggalSurat ? format(filteredData[0]?.tanggalSurat, 'yyyy-MM-dd') : undefined,
                    regulation: filteredData[0]?.PersetujuanImport[0]?.regulation ?? undefined,
                    nomorSuratKebenaranImport: filteredData[0]?.PersetujuanImport[0]?.nomorSuratKebenaranImport ?? '',
                    nomorSuratPerusahaanPengimpor: filteredData[0]?.PersetujuanImport[0]?.nomorSuratPerusahaanPengimpor ?? undefined,
                    tanggalDiterimaKebenaranImport: filteredData[0]?.PersetujuanImport[0]?.tanggalDiterimaKebenaranImport ? format(filteredData[0]?.PersetujuanImport[0]?.tanggalDiterimaKebenaranImport, 'yyyy-MM-dd') : undefined,
                    nomorSuratExplicitConsent: filteredData[0]?.PersetujuanImport[0]?.nomorSuratExplicitConsent ?? undefined,
                    tanggalSuratExplicitConsent: filteredData[0]?.PersetujuanImport[0]?.tanggalSuratExplicitConsent ? format(filteredData[0]?.PersetujuanImport[0]?.tanggalSuratExplicitConsent, 'yyyy-MM-dd') : undefined,
                    validitasSurat: filteredData[0]?.PersetujuanImport[0]?.validitasSurat ? format(filteredData[0]?.PersetujuanImport[0]?.validitasSurat, 'yyyy-MM-dd') : undefined,
                    pejabatId: filteredData[0]?.pejabatId ?? undefined,
                    tembusanIds: filteredData[0]?.NotifikasiTembusan?.map((item) => item.DataTembusan?.id) ?? undefined,
                });
            }
        }
    }, [data, isLoading, error, reset]);
    
    async function onSubmitForm(formData) {
        try {   
            formData.referenceNumber = data?.referenceNumber
            formData.negaraAsal = data?.negaraAsal       
            await putFetcher('/api/draft-surat-notifikasi/persetujuan-import', importApprovalData[0]?.id, formData);
            mutate();
            toast.success('Draft surat persetujuan import berhasil diubah!');
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


    if (error?.status === 404 || data?.status === 'Diterima dari Otoritas Asal B3' || data?.status === 'Verifikasi Administrasi dan Teknis' || data?.status === 'Kirim Surat Kebenaran Impor ke Importir' || data?.status === 'Tunggu Respon') return (<Error code={error?.status} header="Tidak ditemukan" message="Pastikan URL draft surat persetujuan impor sudah sesuai"/>)  

    return (
        <RootAdmin>
            <Card radius='sm' className='mt-3'>
                <CardHeader className='flex items-center justify-between'>
                    <span>Draft Surat Persetujuan Import</span>
                    <div className='flex items-center gap-1'>
                        <Button color='primary' size='sm' startContent={<ArrowLeftIcon className='size-4' />} variant='faded' onPress={() => navigate(-1, { replace: true })}>Kembali</Button>
                        <Button startContent={<DocumentIcon className="size-4" />} size="sm" color="primary" onPress={() => openPdfDirectly(`/api/pdf/generatePersetujuanImport/${data?.referenceNumber}`)}>
                            Lihat Draft
                        </Button>
                    </div>
                </CardHeader>
                <CardBody>
                    <form onSubmit={handleSubmit(onSubmitForm)}>
                        {
                            !isLoading && importApprovalData?.length > 0
                            ?
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-3 mb-6'>
                                <Card className='col-span-2'>
                                    <CardHeader>
                                        <span>Kop Surat</span>
                                    </CardHeader>
                                    <Divider/>
                                    <CardBody className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                                        <ControlledInput label="Nomor Surat" name="nomorSurat" type="text" control={control} />
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
                                            isDisabled
                                            isRequired
                                            variant="faded" 
                                            label="Tipe Surat"
                                            labelPlacement='outside'
                                            placeholder="Pilih..." 
                                            color={errors.sifatSurat ? 'danger' : 'default'}
                                            isInvalid={errors.sifatSurat} 
                                            errorMessage={errors.sifatSurat && errors.sifatSurat.message}
                                        >
                                            <SelectItem key="Explicit Consent and Persetujuan ECHA">Explicit Consent and Persetujuan ECHA</SelectItem>
                                            <SelectItem key="Explicit Consent and Persetujuan Non ECHA">Explicit Consent and Persetujuan Non ECHA</SelectItem>
                                        </Select>
                                        <Input isDisabled isRequired label="Nama Pengirim Notifikasi" labelPlacement='outside' value={importVerficationData[0]?.namaPengirimNotifikasi} variant='faded' />
                                        <ControlledInput label="Tanggal Surat Diterbitkan" name="tanggalSurat" type="date" control={control} />
                                    </CardBody>
                                </Card>
                                <Card className='col-span-2'>
                                    <CardHeader>
                                        <span>Poin Pertama</span>
                                    </CardHeader>
                                    <Divider/>
                                    <CardBody className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                                        <ControlledInput 
                                            label="Kebijakan" 
                                            name="regulation" 
                                            type="text" 
                                            isRequired={true} 
                                            className={"col-span-2"} 
                                            control={control} 
                                        />
                                        <ControlledInput label={"Nomor Surat Kebenaran Impor"} name="nomorSuratKebenaranImport" type="text" isRequired={true} control={control} />
                                        <Input type="date" isDisabled isRequired label="Tanggal Surat Kebenaran Impor" labelPlacement='outside' value={importVerficationData[0]?.tanggalSurat ? format(importVerficationData[0]?.tanggalSurat, 'yyyy-MM-dd') : ''} variant='faded' />
                                        <ControlledInput label={"Nomor Surat Perusahaan Pengimpor"} name="nomorSuratPerusahaanPengimpor" type="text" isRequired={true} control={control} />
                                        <ControlledInput 
                                            label="Tanggal Diterima Surat Perusahaan Pengimpor" 
                                            name="tanggalDiterimaKebenaranImport"
                                            type="date"
                                            control={control}
                                        />
                                    </CardBody>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <span>Poin Kedua</span>
                                    </CardHeader>
                                    <Divider/>
                                    <CardBody className='flex flex-col gap-3'>
                                        <ControlledInput label="Nomor Surat Explicit Consent" name="nomorSuratExplicitConsent" type="text" isRequired={true} control={control} />
                                        <ControlledInput label="Tanggal Surat Explicit Consent" name="tanggalSuratExplicitConsent" type="date" control={control} />
                                    </CardBody>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <span>Poin Ketiga</span>
                                    </CardHeader>
                                    <Divider/>
                                    <CardBody className='flex flex-col gap-3'>
                                        <ControlledInput label="Validitas Surat" name="validitasSurat" type="date" control={control} />
                                    </CardBody>
                                </Card>
                                <Card className='min-h-[500px] col-span-2'>
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