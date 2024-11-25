import { Button, Card, CardBody, CardHeader, Divider, Input, Select, SelectItem, Modal, } from '@nextui-org/react';
import React, {useState} from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import { getFetcher, getSelectFetcher, patchFetcherWithoutId } from '../../../../services/api';
import ReactSelect from '../../../elements/ReactSelect';
import { draftRecomendationLetter } from '../../../../services/validation';
import { dirtyInput, isResponseErrorObject } from '../../../../services/helpers';
import TembusanComponent from '../../../../components/fragments/admin/Tembusan';
import useAuth from '../../../../hooks/useAuth';
import RolesAccess from '../../../../enums/roles';
import StatusRekomendasi from '../../../../enums/statusRekomendasi';
import ModalAlert from '../../../elements/ModalAlert';

export default function Draft({ data, mutate }) {
    const {user, roles} = useAuth();
    const existingTembusan = data?.draftSurat?.tembusan?.map((item) => ({ value: item.id, label: item.nama }));

    const { register, handleSubmit, control, formState: { errors, isSubmitting, dirtyFields } } = useForm({
        resolver: yupResolver(draftRecomendationLetter),
        defaultValues: {
            nomorSurat: data?.draftSurat?.nomorSurat,
            tipeSurat: data?.draftSurat?.tipeSurat,
            tanggalSurat: data?.draftSurat?.tanggalSurat || '',
            pejabatId: { value: data.draftSurat?.pejabat?.id, label: data?.draftSurat?.pejabat?.nama },
        }
    });
    // Modal control state
    const [isOpenModalAlert, setIsOpenModalAlert] = useState(false);
        // Modal control state
    const [isOpenModalSelesaiAlert, setIsOpenModalSelesaiAlert] = useState(false);

    const { data: dataPejabat, isLoading: isLoadingPejabat } = useSWR('/api/data-master/pejabat?limit=100', getSelectFetcher);
    
    // Function to confirm and submit the SK
    async function onValidate(applicationId) {
        try {
            const data = {
                applicationId: applicationId,
                status: StatusRekomendasi.DRAFT_SK_TANDA_TANGAN_DIREKTUR,
                userId: user.userId
            }
            await patchFetcherWithoutId('/api/rekom/permohonan/status', data);
            mutate()
            toast.success('Draf SK Rekomendasi selesai!');
        } catch (error) {
            isResponseErrorObject(error.response.data.message)
                ? Object.entries(error.response.data.message).forEach(([key, value]) => {
                    toast.error(value);
                })
                : toast.error(error.response.data.message);
        }
    }

    // Function to confirm and submit the SK
    async function onValidateSelesai(applicationId) {
        try {
            const data = {
                applicationId: applicationId,
                status: StatusRekomendasi.SELESAI,
                userId: user.userId
            }
            await patchFetcherWithoutId('/api/rekom/permohonan/status', data);
            mutate()
            toast.success('Draf SK Rekomendasi selesai!');
        } catch (error) {
            isResponseErrorObject(error.response.data.message)
                ? Object.entries(error.response.data.message).forEach(([key, value]) => {
                    toast.error(value);
                })
                : toast.error(error.response.data.message);
        }
    }

    

    async function onSubmit(formData) {
        try {
            const filteredData = dirtyInput(dirtyFields, formData);
            filteredData.draftId = data?.draftSurat?.id;
            await patchFetcherWithoutId('/api/rekom/permohonan/draft-surat', filteredData);
            mutate();
            toast.success('Draft SK berhasil diubah!');
        } catch (error) {
            isResponseErrorObject(error.response.data.message)
                ? Object.entries(error.response.data.message).forEach(([key, value]) => {
                    toast.error(value);
                })
                : toast.error(error.response.data.message);
        }
    }

    const hasUnsavedChanges = Object.keys(dirtyFields).length > 0;
    return (
        <div className='flex flex-row gap-4 py-3'>
            <div className='w-1/2'>
            {roles.includes(RolesAccess.SUPER_ADMIN, RolesAccess.PIC_REKOMENDASI) && (
                <TembusanComponent
                existingTembusan= {data}
                />
            )}

            </div>
            <form onSubmit={handleSubmit(onSubmit)} className='w-1/2'>
                <Card radius='sm' className='h-full'>
                    <CardHeader>
                        <p className="text-md">Draft SK</p>
                        {hasUnsavedChanges && (
                            <span className="text-red-500 text-sm ml-2">Perubahan belum disimpan</span>
                        )}
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        <div className='flex flex-col gap-3 mb-5'>
                            {roles.includes(RolesAccess.SUPER_ADMIN, RolesAccess.DIREKTUR) && (<Input
                                {...register('nomorSurat')}
                                variant="faded"
                                type="text"
                                label="Nomor Surat"
                                labelPlacement='outside'
                                placeholder="..."
                                color={errors.nomorSurat ? 'danger' : 'default'}
                                isInvalid={errors.nomorSurat}
                                errorMessage={errors.nomorSurat && errors.nomorSurat.message}
                            />)}
                            
                            <Input
                                {...register('tipeSurat')}
                                variant="faded"
                                type="text"
                                label="Tipe Surat"
                                labelPlacement='outside'
                                placeholder="..."
                                color={errors.tipeSurat ? 'danger' : 'default'}
                                isInvalid={errors.tipeSurat}
                                errorMessage={errors.tipeSurat && errors.tipeSurat.message}
                            />

                            {roles.includes(RolesAccess.SUPER_ADMIN, RolesAccess.DIREKTUR) && (
                                <Input
                                {...register('tanggalSurat')}
                                type="date"
                                label="Tanggal Surat"
                                labelPlacement='outside'
                                color={errors.tanggalSurat ? 'danger' : 'default'}
                                isInvalid={errors.tanggalSurat}
                                errorMessage={errors.tanggalSurat && errors.tanggalSurat.message}
                            />
                            )}
                            {roles.includes(RolesAccess.SUPER_ADMIN, RolesAccess.PIC_REKOMENDASI) && (
                                <Controller
                                name="pejabatId"
                                control={control}
                                rules={{ required: 'Pejabat wajib diisi' }}
                                render={({ field, fieldState }) => (
                                    <ReactSelect
                                        label="Pejabat"
                                        data={dataPejabat}
                                        isLoading={isLoadingPejabat}
                                        value={field.value}
                                        onChange={(selectedOption) => field.onChange(selectedOption.value)}
                                        error={fieldState.error && fieldState.error.message}
                                    />
                                )}
                            />
                            )}
                        </div>
                        <div>
                            <Button
                                isDisabled={isSubmitting || Object.keys(dirtyFields).length === 0}
                                isLoading={isSubmitting}
                                type="submit"
                                color='primary'
                            >
                                Simpan
                            </Button>
                            {roles.includes(RolesAccess.SUPER_ADMIN, RolesAccess.PIC_REKOMENDASI) && 
                            ![StatusRekomendasi.SELESAI, StatusRekomendasi.DITOLAK, StatusRekomendasi.VALIDASI_PEMOHONAN, StatusRekomendasi.DRAFT_SK_TANDA_TANGAN_DIREKTUR].includes(data.status)
                            && (
                                 <Button
                                 color='primary'
                                 onClick={() => setIsOpenModalAlert(true)} // Open the modal when clicked
                                 className="ml-4"
                                >
                                 Kirim SK Ke Direktur
                                </Button>
                            )}
                            {roles.includes(RolesAccess.SUPER_ADMIN, RolesAccess.DIREKTUR) && 
                            ![StatusRekomendasi.SELESAI, StatusRekomendasi.DITOLAK, StatusRekomendasi.VALIDASI_PEMOHONAN, StatusRekomendasi.PEMBUATAN_DRAFT_SK].includes(data.status)
                            && (
                                 <Button
                                 color='primary'
                                 onClick={() => setIsOpenModalAlert(true)} // Open the modal when clicked
                                 className="ml-4"
                                >
                                 Pembuatan SK Selesai
                                </Button>
                            )}
                            
                        </div>
                    </CardBody>
                </Card>
            </form>

            {/* ModalAlert for submitting the SK */}
            <ModalAlert
                heading="Submit Draft SK?"
                description="Pastikan semua data dan file sudah valid sebelum dikirim ke direktur."
                buttonSubmitText="Ya, Kirim"
                icon="warning"
                onSubmit={() => onValidate(data?.id)} // Pass draft ID to the validation function
                isOpen={isOpenModalAlert}
                onOpenChange={setIsOpenModalAlert}
            />

                        {/* ModalAlert for submitting the SK */}
            <ModalAlert
                heading="Submit Draft SK?"
                description="Pastikan semua data dan file sudah valid sebelum SK dinyatakan Selesai."
                buttonSubmitText="Ya"
                icon="warning"
                onSubmit={() => onValidateSelesai(data?.id)} // Pass draft ID to the validation function
                isOpen={isOpenModalAlert}
                onOpenChange={setIsOpenModalSelesaiAlert}
            />
        </div>
    );
}
