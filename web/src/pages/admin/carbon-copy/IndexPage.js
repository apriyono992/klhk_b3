import { Button, Card, CardBody, CardHeader, Chip, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from "@nextui-org/react";
import RootAdmin from "../../../components/layouts/RootAdmin";
import { PencilSquareIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";
import ModalAlert from "../../../components/elements/ModalAlert";
import useCarbonCopy from "../../../hooks/useCarbonCopy";
import useSWR from "swr";
import { getFetcher } from "../../../services/api";
import CustomDataGrid from "../../../components/elements/CustomDataGrid";

export default function IndexPage() {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const { data, isLoading, mutate } = useSWR(`/api/data-master/tembusan?page=${page + 1}&limit=${pageSize}`, getFetcher);
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
    } = useCarbonCopy({ mutate });

    const columns = useMemo(() =>  [
        {
            field: 'nama',
            headerName: 'Nama',
        },
        {
            field: 'tipe',
            headerName: 'Tipe',
            renderCell: (params) => (
                <Chip color={params.row.tipe === 'UMUM' ? 'primary' : 'secondary'} variant="flat" size="sm">{params.row.tipe}</Chip>
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
                    <p className="text-md">Daftar Tembusan</p>
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
                            <ModalHeader>{isEdit ? 'Ubah' : 'Tambah'} Tembusan</ModalHeader>
                            <ModalBody>
                                <form onSubmit={handleSubmit(onSubmitForm)}>
                                    <div className='flex flex-col gap-3 mb-6'>  
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
                                        <Select 
                                            {...register('tipe')}
                                            isRequired
                                            variant="faded" 
                                            label="Tipe" 
                                            color={errors.tipe ? 'danger' : 'default'}
                                            isInvalid={errors.tipe} 
                                            errorMessage={errors.tipe && errors.tipe.message}
                                        >
                                            <SelectItem key="UMUM">UMUM</SelectItem>
                                            <SelectItem key="DIREKTUR">DIREKTUR</SelectItem>
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
