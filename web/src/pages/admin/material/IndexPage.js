import { Button, Card, CardBody, CardHeader, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from "@nextui-org/react";
import RootAdmin from "../../../components/layouts/RootAdmin";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { PencilSquareIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useMemo } from "react";
import ModalAlert from "../../../components/elements/ModalAlert";
import useMaterial from "../../../hooks/useMaterial";

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
    } = useMaterial();

    const data = [
        {
            id: 1,
            casNumber: "50-00-0",
            namaBahanKimia: "Formaldehyde",
            namaDagang: "Formalin",
            tipeBahan: "DAPAT_DIPERGUNAKAN"
        },
    ]

    const columns = useMemo(() =>  [
        { 
            field: 'id', 
            headerName: 'No',
            width: 70 
        },
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
    ], []);


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
                                            <SelectItem key="DAPAT_DIPERGUNAKAN">DAPAT DIPERGUNAKAN</SelectItem>
                                            <SelectItem key="TERBATAS_DIPERGUNAKAN">TERBATAS DIPERGUNAKAN</SelectItem>
                                            <SelectItem key="DILARANG">DILARANG</SelectItem>
                                            <SelectItem key="B3_BARU">B3 BARU</SelectItem>
                                            <SelectItem key="NON_B3">NON B3</SelectItem>
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
