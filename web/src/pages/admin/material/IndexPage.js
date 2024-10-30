import { Button, Card, CardBody, CardHeader, Chip, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from "@nextui-org/react";
import RootAdmin from "../../../components/layouts/RootAdmin";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { PencilSquareIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";
import ModalAlert from "../../../components/elements/ModalAlert";
import useMaterial from "../../../hooks/useMaterial";
import useSWR from "swr";
import { getFetcher } from "../../../services/api";
import { materialType } from "../../../services/enum";

export default function IndexPage() {
    const fetcher = (...args) => getFetcher(...args);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const { data, isLoading, mutate } = useSWR(`/api/data-master/bahan-b3?page=${page + 1}&limit=${pageSize}`, fetcher);
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
    } = useMaterial({ mutate });

    const columns = useMemo(() =>  [
        {
            field: 'casNumber',
            headerName: 'Cas Number/Nomor Kimia',
            width: 280
        },
        {
            field: 'namaBahanKimia',
            headerName: 'Nama Bahan Kimia',
            width: 300
        },
        {
            field: 'namaDagang',
            headerName: 'Nama Dagang',
            width: 300
        },
        {
            field: 'tipeBahan',
            headerName: 'Tipe Bahan',
            width: 300,
            renderCell: (params) => {
                switch (params.row.tipeBahan) {
                    case 'DILARANG':
                        return <Chip color="danger" variant="flat" size="sm">DILARANG</Chip>; // Render a specific component or value for 'value1'
                    case 'TERBATAS DIPERGUNAKAN':
                        return <Chip color="warning" variant="flat" size="sm">TERBATAS DIPERGUNAKAN</Chip>; // Render a specific component or value for 'value2' // Render a 
                    default:
                        return <Chip color="success" variant="flat" size="sm">{params.row.tipeBahan}</Chip>; // Default rendering for any other values
                }
            },
            sortable: false,
            filterable: false
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
            width: 250
        },
    ], [onClickEdit, onClickDelete]);


    return(
        <RootAdmin>
            <Card className="w-full mt-3" radius="sm">
                <CardHeader>
                    <p className="text-md">Daftar Bahan B3</p>
                </CardHeader>
                <Divider />
                <CardBody className='w-full h-[550px] p-5'>
                    <div className="mb-5">
                        <Button onPress={onOpenModalForm} size="sm" color="primary" startContent={<PlusIcon className="size-4 stroke-2"/>}>Tambah</Button>
                    </div>
                    <DataGrid
                        rows={data?.data}
                        rowCount={data?.total || 0}
                        loading={isLoading}
                        columns={columns}
                        disableDensitySelector
                        initialState={{
                            pagination: {
                                paginationModel: {
                                  pageSize: 10,
                                },
                            },
                            sorting: {
                                sortModel: [{ field: 'casNumber', sort: 'asc' }],
                            },
                            density: 'compact',
                        }}
                        slots={{
                            toolbar: GridToolbar,
                        }}
                        paginationMode="server"
                        onPaginationModelChange={(model) => {
                            setPage(model.page);
                            setPageSize(model.pageSize);
                        }}
                        pageSizeOptions={[5, 10, 15]}
                        page={page}
                        pageSize={pageSize}
                        disableRowSelectionOnClick
                    />
                </CardBody>
            </Card>

            <ModalAlert isOpen={isOpenModalAlert} onOpenChange={onOpenChangeModalAlert} onSubmit={onSubmitDelete} icon="danger"/>
            <Modal isOpen={isOpenModalForm} onOpenChange={onOpenChangeModalForm} onClose={onCloseForm} isDismissable={false} isKeyboardDismissDisabled={false}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>{isEdit ? 'Ubah' : 'Tambah'} Bahan B3</ModalHeader>
                            <ModalBody>
                                <form onSubmit={handleSubmit(onSubmitForm)}>
                                    <div className='flex flex-col gap-3 mb-6'>  
                                        <Input
                                            {...register('casNumber')}
                                            isRequired
                                            variant="faded" 
                                            type="text" 
                                            label="Cas Number/Nomor Kimia" 
                                            color={errors.casNumber ? 'danger' : 'default'}
                                            isInvalid={errors.casNumber} 
                                            errorMessage={errors.casNumber && errors.casNumber.message}
                                        />
                                        <Input
                                            {...register('namaBahanKimia')}
                                            isRequired
                                            variant="faded" 
                                            type="text" 
                                            label="Nama Bahan Kimia" 
                                            color={errors.namaBahanKimia ? 'danger' : 'default'}
                                            isInvalid={errors.namaBahanKimia} 
                                            errorMessage={errors.namaBahanKimia && errors.namaBahanKimia.message}
                                        />
                                        <Input
                                            {...register('namaDagang')}
                                            isRequired
                                            variant="faded" 
                                            type="text" 
                                            label="Nama Dagang" 
                                            color={errors.namaDagang ? 'danger' : 'default'}
                                            isInvalid={errors.namaDagang} 
                                            errorMessage={errors.namaDagang && errors.namaDagang.message}
                                        />
                                        <Select 
                                            {...register('tipeBahan')}
                                            isRequired
                                            variant="faded" 
                                            label="Tipe Bahan" 
                                            color={errors.tipeBahan ? 'danger' : 'default'}
                                            isInvalid={errors.tipeBahan} 
                                            errorMessage={errors.tipeBahan && errors.tipeBahan.message}
                                        >
                                            {materialType.map((item) => (
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
