import { Button, Card, CardBody, CardHeader, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea } from "@nextui-org/react";
import RootAdmin from "../../../components/layouts/RootAdmin";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { PencilSquareIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";
import ModalAlert from "../../../components/elements/ModalAlert";
import useSWR from "swr";
import { getFetcher } from "../../../services/api";
import useCompany from "../../../hooks/useCompany";
import CustomDataGrid from "../../../components/elements/CustomDataGrid";

export default function IndexPage() {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const { data, isLoading, mutate } = useSWR(`/api/company?page=${page + 1}&limit=${pageSize}`, getFetcher);
    console.log(data?.data);
    
    const { 
        isEdit,
        onClickEdit, 
        onClickDelete,
        onSubmitDelete,
        onCloseForm,
        onSubmitForm, 
        modalForm: { onOpenModalForm, isOpenModalForm, onOpenChangeModalForm },
        modalAlert: { isOpenModalAlert, onOpenChangeModalAlert },
        hookForm: { register, handleSubmit, formState: { errors, isSubmitting, dirtyFields } }, 
    } = useCompany({ mutate });

    const columns = useMemo(() =>  [
        {
            field: 'name',
            headerName: 'Nama Perusahaan',
        },
        {
            field: 'penanggungJawab',
            headerName: 'Penanggung Jawab',
        },
        {
            field: 'alamatKantor',
            headerName: 'Alamat Kantor',
        },
        {
            field: 'telpKantor',
            headerName: 'Telp Kantor',
        },
        {
            field: 'faxKantor',
            headerName: 'Fax Kantor',
        },
        {
            field: 'emailKantor',
            headerName: 'Fax Kantor',
        },
        {
            field: 'npwp',
            headerName: 'NPWP',
        },
        {
            field: 'alamatPool',
            headerName: 'Alamat Pool',
            renderCell: (params) => params.row.alamatPool.map((item) => item).join(', ')
        },
        {
            field: 'bidangUsaha',
            headerName: 'Bidang Usaha',
        },
        {
            field: 'nomorInduk',
            headerName: 'Nomor Induk',
        },
        {
            field: 'action',
            headerName: 'Aksi',
            renderCell: (params) => (
                <div className="flex items-center gap-1">
                    <Button size='sm' onPress={() => onClickEdit(params.row)} color='warning' isIconOnly><PencilSquareIcon className='size-4'/></Button>
                    <Button size='sm' onPress={() => onClickDelete(params.row.id)} color='danger' isIconOnly><TrashIcon className='size-4'/></Button>
                </div>
            ),
            sortable: false,
            filterable: false
        },
    ], [onClickEdit, onClickDelete]);


    return(
        <RootAdmin>
            <Card className="w-full mt-3" radius="sm">
                <CardHeader>
                    <p className="text-md">Daftar Perusahaan</p>
                </CardHeader>
                <Divider />
                <CardBody className='w-full h-[550px] p-5'>
                    <div className="mb-5">
                        <Button onPress={onOpenModalForm} size="sm" color="primary" startContent={<PlusIcon className="size-4 stroke-2"/>}>Tambah</Button>
                    </div>
                    <CustomDataGrid
                        data={data?.data}
                        rowCount={data?.total|| 0}
                        isLoading={isLoading}
                        columns={columns}
                        pageSize={pageSize}
                        setPageSize={setPageSize}
                        page={page}
                        setPage={setPage}
                        initialState={{
                            columns: {
                                columnVisibilityModel: {
                                    telpKantor: false,
                                    faxKantor: false,
                                    emailKantor: false,
                                    npwp: false,
                                    alamatPool: false,
                                    bidangUsaha: false,
                                    nomorInduk: false,
                                },
                            },
                        }}
                    />
                </CardBody>
            </Card>

            <ModalAlert isOpen={isOpenModalAlert} onOpenChange={onOpenChangeModalAlert} onSubmit={onSubmitDelete} icon="danger"/>
            <Modal size="3xl" isOpen={isOpenModalForm} onOpenChange={onOpenChangeModalForm} onClose={onCloseForm} isDismissable={false} isKeyboardDismissDisabled={false}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>{isEdit ? 'Ubah' : 'Tambah'} Perusahaan</ModalHeader>
                            <ModalBody>
                                <form onSubmit={handleSubmit(onSubmitForm)}>
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3 mb-6'>  
                                        <Input
                                            {...register('name')}
                                            isRequired
                                            variant="faded" 
                                            type="text" 
                                            label="Nama Perusahaan" 
                                            color={errors.name ? 'danger' : 'default'}
                                            isInvalid={errors.name} 
                                            errorMessage={errors.name && errors.name.message}
                                        />
                                        <Input
                                            {...register('penanggungJawab')}
                                            isRequired
                                            variant="faded" 
                                            type="text" 
                                            label="Penanggung Jawab" 
                                            color={errors.penanggungJawab ? 'danger' : 'default'}
                                            isInvalid={errors.penanggungJawab} 
                                            errorMessage={errors.penanggungJawab && errors.penanggungJawab.message}
                                        />
                                        <Textarea
                                            {...register('alamatKantor')}
                                            isRequired
                                            variant="faded" 
                                            type="text" 
                                            label="Alamat Kantor" 
                                            color={errors.alamatKantor ? 'danger' : 'default'}
                                            isInvalid={errors.alamatKantor} 
                                            errorMessage={errors.alamatKantor && errors.alamatKantor.message}
                                            className='col-span-2'
                                        /> 
                                        <Input
                                            {...register('telpKantor')}
                                            isRequired
                                            variant="faded" 
                                            type="text" 
                                            label="Telepon Kantor" 
                                            color={errors.telpKantor ? 'danger' : 'default'}
                                            isInvalid={errors.telpKantor} 
                                            errorMessage={errors.telpKantor && errors.telpKantor.message}
                                        />
                                        <Input
                                            {...register('faxKantor')}
                                            isRequired
                                            variant="faded" 
                                            type="text" 
                                            label="Fax Kantor" 
                                            color={errors.faxKantor ? 'danger' : 'default'}
                                            isInvalid={errors.faxKantor} 
                                            errorMessage={errors.faxKantor && errors.faxKantor.message}
                                        />
                                        <Input
                                            {...register('emailKantor')}
                                            isRequired
                                            variant="faded" 
                                            type="text" 
                                            label="Email Kantor" 
                                            color={errors.emailKantor ? 'danger' : 'default'}
                                            isInvalid={errors.emailKantor} 
                                            errorMessage={errors.emailKantor && errors.emailKantor.message}
                                        />
                                        <Input
                                            {...register('npwp')}
                                            isRequired
                                            variant="faded" 
                                            type="text" 
                                            label="NPWP" 
                                            color={errors.npwp ? 'danger' : 'default'}
                                            isInvalid={errors.npwp} 
                                            errorMessage={errors.npwp && errors.npwp.message}
                                        />
                                        {/* {fields.map((field, index) => (
                                            <div key={index} className="flex items-center gap-1">
                                                <Controller
                                                    name={`other[${index}].value`}
                                                    control={control}
                                                    defaultValue={field.value}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            size="sm"
                                                            placeholder="Masukkan Kata"
                                                            fullWidth
                                                            isRequired
                                                            color={errors?.other?.[index]?.value ? "danger" : "default"}
                                                            isInvalid={errors?.other?.[index]?.value} 
                                                        />
                                                    )}
                                                />
                                                <Button color="danger" size="sm" isIconOnly onClick={() => remove(index)} isDisabled={fields.length === 1}><TrashIcon className="size-4"/></Button>
                                            </div>
                                        ))} */}
                                        <Input
                                            {...register('bidangUsaha')}
                                            isRequired
                                            variant="faded" 
                                            type="text" 
                                            label="Bidang Usaha" 
                                            color={errors.bidangUsaha ? 'danger' : 'default'}
                                            isInvalid={errors.bidangUsaha} 
                                            errorMessage={errors.bidangUsaha && errors.bidangUsaha.message}
                                        />
                                        <Input
                                            {...register('nomorInduk')}
                                            isRequired
                                            variant="faded" 
                                            type="text" 
                                            label="Nomor Induk" 
                                            color={errors.nomorInduk ? 'danger' : 'default'}
                                            isInvalid={errors.nomorInduk} 
                                            errorMessage={errors.nomorInduk && errors.nomorInduk.message}
                                        />
                                    </div>
                                    <div className='flex items-center gap-1'>
                                        <Button isLoading={isSubmitting} isDisabled={isSubmitting || (isEdit && Object.keys(dirtyFields).length === 0)} type='submit' color='primary'>{isEdit ? 'Simpan' : 'Tambah'}</Button>
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
        </RootAdmin>
    )
}
