import { useEffect, useState } from 'react'
import RootAdmin from '../../../components/layouts/RootAdmin'
import { Button, Card, CardBody, CardHeader, Divider, Select, SelectItem, Spinner } from '@nextui-org/react'
import { ArrowLeftIcon, DocumentIcon } from '@heroicons/react/24/outline'
import {  getFetcher, getPdfUrl, getSelectFetcher, putFetcher } from '../../../services/api'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { isResponseErrorObject } from '../../../services/helpers'
import { yupResolver } from '@hookform/resolvers/yup'
import { draftImportEcLetter } from '../../../services/validation'
import ControlledInput from '../../../components/elements/ControlledInput'
import { format } from 'date-fns'
import NonEchaForm from '../../../components/fragments/admin/notification/NonEchaForm'
import EchaForm from '../../../components/fragments/admin/notification/EchaForm'
import ControlledReactSelect from '../../../components/elements/ControlledReactSelect'
import Error from '../../../components/fragments/Error'

export default function ImportEcDraftPage() {
    const { notificationId } = useParams();
    const navigate = useNavigate();
    const [importEcData, setImportEcData] = useState([]);
    const [selectedTipeSurat, setSelectedTipeSurat] = useState('');
    const [selectedConsentImport, setSelectedConsentImport] = useState("true");
    const { data, isLoading, error, mutate } = useSWR(`/api/notifikasi/${notificationId}`, getFetcher);
    const { data: dataTembusan, isLoading: isLoadingTembusan } = useSWR('/api/data-master/tembusan?limit=100', getSelectFetcher);
    const { data: dataPejabat, isLoading: isLoadingPejabat } = useSWR('/api/data-master/pejabat?limit=100', getSelectFetcher);
    const { register, handleSubmit, reset, control, formState: { errors, isSubmitting, dirtyFields } } = useForm({ 
        resolver: yupResolver(draftImportEcLetter), 
        defaultValues: {
            dnaEmail: [
                { value: "" }, 
            ],
        },
    });

    console.log(importEcData[0]?.ExplicitConsent[0]?.ExplicitConsentDetails[0]);
    

    useEffect(() => {
        if (!isLoading && !error && data?.draftSuratNotifikasiId?.length > 0) {
            setImportEcData(data.draftSuratNotifikasiId.filter(item => item.ExplicitConsent?.length > 0))
        }
    }, [data, isLoading, error, reset]);

    useEffect(() => {
        if (importEcData.length > 0) {
            setSelectedTipeSurat(importEcData[0]?.tipeSurat);
            setSelectedConsentImport(importEcData[0]?.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.consentToImport ? "true" : "false");
            reset({
                nomorSurat: importEcData[0]?.nomorSurat ?? undefined,
                jenisExplicitConsent: importEcData[0]?.tipeSurat === "Explicit Consent and Persetujuan Non ECHA" ? 'Non Echa' : 'Echa',
                tanggalSurat: importEcData[0]?.tanggalSurat ? format(importEcData[0]?.tanggalSurat, 'yyyy-MM-dd') : undefined,
                tujuanSurat: importEcData[0]?.ExplicitConsent[0]?.tujuanSurat ?? undefined,
                namaExporter: importEcData[0]?.ExplicitConsent[0]?.namaExporter ?? undefined,
                namaImpoter: importEcData[0]?.ExplicitConsent[0]?.namaImpoter ?? undefined,
                tujuanImport: importEcData[0]?.ExplicitConsent[0]?.tujuanImport ?? undefined,
                validitasSurat: importEcData[0]?.ExplicitConsent[0]?.validitasSurat ? format(importEcData[0]?.ExplicitConsent[0]?.validitasSurat, 'yyyy-MM-dd') : undefined,
                nameOfChemicalSubstance: importEcData[0]?.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.nameOfChemicalSubstance ?? undefined,
                casNumberSubstance: importEcData[0]?.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.casNumberSubstance ?? undefined,
                nameOfPreparation: importEcData[0]?.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.nameOfPreparation ?? undefined,
                nameOfChemicalInPreparation: importEcData[0]?.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.nameOfChemicalInPreparation ?? undefined,
                concentrationInPreparation: importEcData[0]?.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.concentrationInPreparation ?? undefined,
                casNumberPreparation: importEcData[0]?.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.casNumberPreparation ?? undefined,
                consentToImport: importEcData[0]?.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.consentToImport ? 'true' : 'false',
                useCategoryPesticide: importEcData[0]?.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.useCategoryPesticide ? 'true' : 'false',
                useCategoryIndustrial: importEcData[0]?.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.useCategoryIndustrial ? 'true' : 'false',
                consentForOtherPreparations: importEcData[0]?.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.consentForOtherPreparations ? 'true' : 'false',
                allowedConcentrations: importEcData[0]?.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.allowedConcentrations ?? undefined,
                consentForPureSubstance: importEcData[0]?.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.consentForPureSubstance ? 'true' : 'false',
                hasRestrictions: importEcData[0]?.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.hasRestrictions ? 'true' : 'false',
                restrictionDetails: importEcData[0]?.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.restrictionDetails ?? undefined,
                isTimeLimited: importEcData[0]?.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.isTimeLimited ? 'true' : 'false',
                timeLimitDetails: importEcData[0]?.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.timeLimitDetails ? format(importEcData[0]?.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.timeLimitDetails, 'yyyy-MM-dd') : undefined,
                sameTreatment: importEcData[0]?.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.sameTreatment ? 'true' : 'false',
                differentTreatmentDetails: importEcData[0]?.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.differentTreatmentDetails ?? undefined,
                otherRelevantInformation: importEcData[0]?.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.otherRelevantInformation ?? undefined,
                dnaInstitutionName: importEcData[0]?.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.dnaInstitutionName ?? undefined,
                dnaContactName: importEcData[0]?.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.dnaContactName ?? undefined,
                dnaTelephone: importEcData[0]?.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.dnaTelephone ?? undefined,
                dnaInstitutionAddress: importEcData[0]?.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.dnaInstitutionAddress ?? undefined,
                dnaTelefax: importEcData[0]?.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.dnaTelefax ?? undefined,
                dnaDate: importEcData[0]?.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.dnaDate ? format(importEcData[0]?.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.dnaDate, 'yyyy-MM-dd') : undefined,
                dnaEmail: importEcData[0]?.ExplicitConsent[0]?.ExplicitConsentDetails[0]?.dnaEmail.map((item) => ({ value: item })) ?? [],
                pejabatId: importEcData[0]?.pejabatId ?? undefined,
                tembusanIds: importEcData[0]?.NotifikasiTembusan?.map((item) => item.DataTembusan?.id) ?? undefined,
            })
        }
    }, [importEcData, reset]);
    
    async function onSubmitForm(formData) {
        try {
            formData.negaraAsal = data?.negaraAsal
            formData.referenceNumber = data?.referenceNumber
            formData.consentToImport = formData.consentToImport === 'true' ? true : false
            formData.useCategoryPesticide = formData.useCategoryPesticide === 'true' ? true : false
            formData.useCategoryIndustrial = formData.useCategoryIndustrial === 'true' ? true : false
            formData.consentForOtherPreparations = formData.consentForOtherPreparations === 'true' ? true : false
            formData.consentForPureSubstance = formData.consentForPureSubstance === 'true' ? true : false
            formData.hasRestrictions = formData.hasRestrictions === 'true' ? true : false
            formData.isTimeLimited = formData.isTimeLimited === 'true' ? true : false
            formData.sameTreatment = formData.sameTreatment === 'true' ? true : false
            formData.dnaEmail = formData.dnaEmail.map((item) => item.value)

            console.log(formData);
            await putFetcher('/api/draft-surat-notifikasi/explicit-consent', importEcData[0]?.id, formData);
            mutate();
            toast.success('Draft surat explicit consent berhasil diubah!');
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
                    <span>Draft Surat Explicit Consent</span>
                    <div className='flex items-center gap-1'>
                        <Button color='primary' size='sm' startContent={<ArrowLeftIcon className='size-4' />} variant='faded' onPress={() => navigate(-1, { replace: true })}>Kembali</Button>
                        <Button startContent={<DocumentIcon className="size-4" />} size="sm" color="primary" onPress={() => openPdfDirectly(`/api/pdf/generateExplicitConsent/${data?.referenceNumber}`)}>
                            Lihat Draft
                        </Button>
                    </div>
                </CardHeader>
                <CardBody>
                    <form onSubmit={handleSubmit(onSubmitForm)}>
                        {
                            !isLoading && importEcData?.length > 0
                            ?
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-3 mb-6'>
                                <Card>
                                    <CardHeader>
                                        <span>Kop Surat</span>
                                    </CardHeader>
                                    <Divider/>
                                    <CardBody className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                                        <ControlledInput label="Nomor Surat" name="nomorSurat" type={"text"} control={control} />
                                        <Select 
                                            {...register('jenisExplicitConsent')}
                                            isDisabled
                                            isRequired
                                            variant="faded" 
                                            label="Jenis Explicit Consent"
                                            labelPlacement='outside'
                                            placeholder="Pilih..." 
                                            color={errors.jenisExplicitConsent ? 'danger' : 'default'}
                                            isInvalid={errors.jenisExplicitConsent} 
                                            errorMessage={errors.jenisExplicitConsent && errors.jenisExplicitConsent.message}
                                        >
                                            <SelectItem key="Echa">Echa</SelectItem>
                                            <SelectItem key="Non Echa">Non Echa</SelectItem>
                                        </Select>
                                        <ControlledInput label="Tanggal Surat Diterbitkan" name="tanggalSurat" type={"date"} control={control} />
                                    </CardBody>
                                </Card>
                                <Card >
                                    <CardHeader>
                                        <span>Isi Surat</span>
                                    </CardHeader>
                                    <Divider/>
                                    <CardBody>
                                        <ControlledInput label="Tujuan Surat" name="tujuanSurat" type={"text"} isRequired={true} control={control} />
                                    </CardBody>
                                </Card>
                                {(() => {
                                    if (selectedTipeSurat === "Explicit Consent and Persetujuan Non ECHA") return <NonEchaForm control={control} />;
                                    if (selectedTipeSurat === "Explicit Consent and Persetujuan ECHA") return <EchaForm control={control} selectedConsentImport={selectedConsentImport} setSelectedConsentImport={setSelectedConsentImport} errors={errors} />;
                                })()}
                                <Card className='h-[500px] col-span-2'>
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