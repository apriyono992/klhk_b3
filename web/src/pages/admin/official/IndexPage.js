import { Button, Card, CardBody, CardHeader, Chip, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from "@nextui-org/react";
import RootAdmin from "../../../components/layouts/RootAdmin";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { PencilSquareIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";
import ModalAlert from "../../../components/elements/ModalAlert";
import useOfficial from "../../../hooks/useOfficial";
import { getFetcher } from "../../../services/api";
import useSWR from "swr";
import { officialStatus } from "../../../services/enum";
import CustomDataGrid from "../../../components/elements/CustomDataGrid";

export default function IndexPage() {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const { data, isLoading, mutate } = useSWR(`/api/data-master/pejabat?page=${page + 1}&limit=${pageSize}`, getFetcher);
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
    } = useOfficial({ mutate });

    const columns = useMemo(() =>  [
        {
            field: 'nip',
            headerName: 'NIP',
        },
        {
            field: 'nama',
            headerName: 'Nama',
        },
        {
            field: 'jabatan',
            headerName: 'Jabatan',
        },
        {
            field: 'status',
            headerName: 'Status',
            renderCell: (params) => (
                <Chip size="sm" variant="flat" color="primary">{params.row.status}</Chip>
            ),
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
                    <p className="text-md">Daftar Pejabat</p>
                </CardHeader>
                <Divider />
                <CardBody className='w-full h-[550px] p-5'>
                    <div className="mb-5">
                        <Button onPress={onOpenModalForm} size="sm" color="primary" startContent={<PlusIcon className="size-4 stroke-2"/>}>Tambah</Button>
                    </div>
                    <CustomDataGrid
                        data={data?.data}
                        rowCount={data?.total || 0}
                        isLoading={isLoading}
                        columns={columns}
                        pageSize={pageSize}
                        setPageSize={setPageSize}
                        page={page}
                        setPage={setPage}
                        initialState={{
                            sorting: {
                                sortModel: [{ field: 'nama', sort: 'asc' }],
                            },
                        }}
                    />
                </CardBody>
            </Card>

            <ModalAlert isOpen={isOpenModalAlert} onOpenChange={onOpenChangeModalAlert} onSubmit={onSubmitDelete} icon="danger"/>
            <Modal isOpen={isOpenModalForm} onOpenChange={onOpenChangeModalForm} onClose={onCloseForm} isDismissable={false} isKeyboardDismissDisabled={false}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>{isEdit ? 'Ubah' : 'Tambah'} Pejabat</ModalHeader>
                            <ModalBody>
                                <form onSubmit={handleSubmit(onSubmitForm)}>
                                    <div className='flex flex-col gap-3 mb-6'>  
                                        <Input
                                            {...register('nip')}
                                            isRequired
                                            variant="faded" 
                                            type="text" 
                                            label="NIP" 
                                            color={errors.nip ? 'danger' : 'default'}
                                            isInvalid={errors.nip} 
                                            errorMessage={errors.nip && errors.nip.message}
                                        />
                                        <Input
                                            {...register('nama')}
                                            isRequired
                                            variant="faded" 
                                            type="text" 
                                            label="Nama" 
                                            color={errors.nama ? 'danger' : 'default'}
                                            isInvalid={errors.nama} 
                                            errorMessage={errors.nama && errors.nama.message}
                                        />   
                                        <Input
                                            {...register('jabatan')}
                                            isRequired
                                            variant="faded" 
                                            type="text" 
                                            label="Jabatan" 
                                            color={errors.jabatan ? 'danger' : 'default'}
                                            isInvalid={errors.jabatan} 
                                            errorMessage={errors.jabatan && errors.jabatan.message}
                                        />     
                                        <Select 
                                            {...register('status')}
                                            isRequired
                                            variant="faded" 
                                            label="Status"
                                            color={errors.status ? 'danger' : 'default'}
                                            isInvalid={errors.status} 
                                            errorMessage={errors.status && errors.status.message}
                                        >
                                            {officialStatus.map((item) => (
                                                <SelectItem key={item}>{item}</SelectItem>
                                            ))}
                                        </Select>    
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
