import { Button, Card, CardBody, CardHeader, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from "@nextui-org/react";
import RootAdmin from "../../../components/layouts/RootAdmin";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { PencilSquareIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useMemo } from "react";
import ModalAlert from "../../../components/elements/ModalAlert";
import useCarbonCopy from "../../../hooks/useCarbonCopy";
import useSWR from "swr";
import { getFetcher } from "../../../services/api";

export default function IndexPage() {
    const { 
        isEdit,
        onClickEdit, 
        onClickDelete,
        onSubmitDelete,
        onCloseForm,
        onSubmitForm, 
        modalForm: { onOpenModalForm, isOpenModalForm, onOpenChangeModalForm },
        modalAlert: { isOpenModalAlert, onOpenChangeModalAlert },
        hookForm: { register, handleSubmit, formState: { errors, isSubmitting } }, 
    } = useCarbonCopy();

    // const fetcher = (...args) => getFetcher(...args);
    // const { data, isLoading } = useSWR('/api/data-master/tembusan', getFetcher);
    // console.log(data);
    

    const data = [
        {
            id: 1,
            nama: 'Direktur Utama',
            tipe: 'UMUM',
        },
        {
            id: 2,
            nama: 'Kepala Kantor',
            tipe: 'UMUM',
        },
        {
            id: 3,
            nama: 'Bupati',
            tipe: 'UMUM',
        },
    ]

    const columns = useMemo(() =>  [
        { 
            field: 'id', 
            headerName: 'No',
            width: 70 
        },
        {
            field: 'nama',
            headerName: 'Nama',
            width: 300
        },
        {
            field: 'tipe',
            headerName: 'Tipe',
            width: 300
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
                    <p className="text-md">Daftar Tembusan</p>
                </CardHeader>
                <Divider />
                <CardBody className='w-full h-[550px] p-5'>
                    <div className="mb-5">
                        <Button onPress={onOpenModalForm} size="sm" color="primary" startContent={<PlusIcon className="size-4 stroke-2"/>}>Tambah</Button>
                    </div>
                    <DataGrid
                        rows={data}
                        // loading={isLoading}
                        columns={columns}
                        disableDensitySelector
                        initialState={{
                            pagination: {
                                paginationModel: {
                                  pageSize: 10,
                                },
                            },
                            density: 'compact',
                        }}
                        slots={{
                            toolbar: GridToolbar,
                        }}
                        pageSizeOptions={[5, 10, 15]}
                        checkboxSelection
                        disableRowSelectionOnClick
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
                                        <Button isLoading={isSubmitting} isDisabled={isSubmitting} type='submit' color='primary'>{isEdit ? 'Simpan' : 'Tambah'}</Button>
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
