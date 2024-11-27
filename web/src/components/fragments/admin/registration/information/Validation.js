import { ArrowPathIcon, EyeIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import {
    Button,
    Card,
    CardBody,
    Checkbox,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Textarea,
    useDisclosure
} from '@nextui-org/react';
import ModalAlert from '../../../../elements/ModalAlert';
import useValidationForm from '../../../../../hooks/useValidationForm';
import useSWR from "swr";
import {getFetcher, patchFetcherWithoutId, postFetcher, putFetcher, putFetcherWithoutId} from "../../../../../services/api";
import toast from "react-hot-toast";
import {useState} from "react";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import useAuth from "../../../../../hooks/useAuth";
import StatusPermohonanRegistrasi from '../../../../../enums/statusRegistrasi';

export default function Validation({registrasi}) {
    const [editId, setEditId] = useState(null);
    const { data, isLoading, mutate } = useSWR(`/api/registrasi/validasi-teknis/${registrasi.nomor}`, getFetcher);
    const {isOpen: isOpenModalForm, onOpen: onOpenModalForm, onOpenChange: onOpenChangeModalForm, onClose: onCloseModalForm} = useDisclosure();
    const {isOpen: isOpenModalAlert, onOpenChange: onOpenChangeModalAlert} = useDisclosure();
    const { data: user } = useAuth()

    const schema = yup.object({
        isValid: yup.boolean().oneOf([true, false], 'Isi harus valid atau tidak valid'),
        keterangan: yup.string().when('isValid', (isValid, schema) => {
            if (isValid[0] === false) {
                return schema.notRequired();
            }
            return schema.required('Catatan harus diisi jika dokumen tidak valid');
        }),
    }).required();

    const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm({resolver: yupResolver(schema)});

    // Watch for changes on 'isValid' checkbox
    const isValid = watch('isValid');
    const areAllDocumentValid = data?.every(
        document => document.validasi_valid
    );

    const columns = [
        'No',
        'Nama',
        'Nomor Dokumen',
        'Kesesuaian Dokumen',
        'Catatan',
        'Aksi',
    ]

    const onSubmitForm = async(data) => {
        try {
            data.isValid = data.isValid ? 'false' : 'true';
            await putFetcher(`/api/registrasi/edit-document`, editId , data);
            await mutate()
            toast.success('Status dokumen berhasil diubah!');
            onCloseForm();
        } catch (error) {
            console.log(error);
            toast.error('Gagal ubah status dokumen!');
        }
    }

    function onCloseForm() {
        setEditId(null);
        reset({
            isValid: false,
            keterangan: '',
        });
        onCloseModalForm();
    }

    function onClickEdit(item) {
        setEditId(item.id);
        onOpenModalForm();
    }

    async function onValidate(applicationId) {
        try {
            await putFetcherWithoutId(`/api/registrasi/update-status-registrasi/${registrasi.id}/${StatusPermohonanRegistrasi.PEMBUATAN_DRAFT_SK}`);
            mutate()
            toast.success('Validasi teknis selesai!');
        } catch (error) {
            toast.error('Gagal validasi!');
        }
    }

    return (
        <>
            <Card>
                <CardBody>
                    <div className='mb-6'>
                        <Button isDisabled={!areAllDocumentValid || data?.status === StatusPermohonanRegistrasi.SELESAI || data?.status === StatusPermohonanRegistrasi.DITOLAK } onPress={onOpenChangeModalAlert} color='warning' size='sm' startContent={<ArrowPathIcon className="size-4"/>}>Submit Validasi</Button>
                    </div>
                    <Table removeWrapper aria-label="validation-table" radius='sm'>
                        <TableHeader>
                            {columns.map((item, index) => <TableColumn key={index}>{item}</TableColumn>)}
                        </TableHeader>
                        <TableBody loadingContent={<Spinner/>} loadingState={isLoading ? 'loading' : 'idle'}>
                            {data?.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{item.pertanyaan_teks}</TableCell>
                                    <TableCell>{item.jawaban_pertanyaan}</TableCell>
                                    <TableCell>{item.validasi_valid === 1 ? 'Iya' : 'Tidak'}</TableCell>
                                    <TableCell>{item.keterangan}</TableCell>
                                    <TableCell className='flex items-center gap-1'>
                                        <a target='_blank' href={item.fileUrl} className=''>
                                            <Button isIconOnly size="sm" color='primary'><EyeIcon className='size-4'/></Button>
                                        </a>
                                        <Button isIconOnly size="sm" color="warning" onPress={() => onClickEdit(item)}><PencilSquareIcon className='size-4'/></Button>

                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>

            <Modal isOpen={isOpenModalForm} onOpenChange={onOpenChangeModalForm} onClose={onCloseForm} isDismissable={false} isKeyboardDismissDisabled={false}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Ubah Status Dokumen</ModalHeader>
                            <ModalBody>
                                <form onSubmit={handleSubmit(onSubmitForm)}>
                                    <div className='flex flex-col gap-3 mb-6'>
                                        <Checkbox
                                            {...register('isValid')}
                                        >
                                            Dokumen tidak valid
                                        </Checkbox>
                                        {isValid &&
                                            <Textarea
                                                {...register('keterangan', {
                                                    required: !isValid ? 'Catatan harus diisi jika dokumen tidak valid' : false,
                                                })}
                                                isRequired
                                                variant="faded"
                                                type="text"
                                                label="Catatan"
                                                color={errors.keterangan ? 'danger' : 'default'}
                                                isInvalid={errors.keterangan}
                                                errorMessage={errors.keterangan && errors.keterangan.message}
                                            />
                                        }
                                    </div>
                                    <div className='flex items-center gap-1'>
                                        <Button isLoading={isSubmitting} isDisabled={isSubmitting} type='submit' color='primary'>Simpan</Button>
                                        <Button isDisabled={isSubmitting} color='danger' variant='faded' onPress={onClose}>Batal</Button>
                                    </div>
                                </form>
                            </ModalBody>
                            <ModalFooter>

                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <ModalAlert
                heading="Submit Validasi?"
                description="Pastikan semua file sudah tervalidasi"
                buttonSubmitText='Ya'
                icon='warning'
                onSubmit={() => onValidate(data.id)}
                isOpen={isOpenModalAlert}
                onOpenChange={onOpenChangeModalAlert}
            />
        </>
    )
}
