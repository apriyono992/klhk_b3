import { Button, Card, CardBody, CardHeader, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import ModalAlert from "../../../../elements/ModalAlert";
import { PencilSquareIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import useRecomendationVehicle from "../../../../../hooks/useRecomendationVehicle";

export default function TableVehicle({ data, isLoading, mutate }) {
    const { 
        isEdit,
        onClickCreate,
        onClickEdit, 
        onClickDelete,
        onSubmitDelete,
        onCloseForm,
        onSubmitForm, 
        modalForm: { isOpenModalForm, onOpenChangeModalForm },
        modalAlert: { isOpenModalAlert, onOpenChangeModalAlert },
        hookForm: { register, handleSubmit, formState: { errors, isSubmitting } }, 
    } = useRecomendationVehicle({ mutate });

    const columns = [
        'No',
        'No.Polisi',
        'Model Kendaraan',
        'Tahun Pembuatan',
        'Nomor Rangka',
        'Nomor Mesin',
        'Kepemilikan',
        'Aksi'
    ]

    return (
        <>
            <Card radius="sm">
                <CardHeader className="flex items-center gap-3">
                    <p className="text-md">Data Kendaraan</p>
                    <Button isIconOnly onPress={() => onClickCreate(data.id, data.company.id)} size="sm" color="primary"><PlusIcon className="size-4 stroke-2"/></Button>
                </CardHeader>
                <Divider />
                <CardBody>
                    <Table removeWrapper aria-label="table-vehicle">
                        <TableHeader>
                            {columns.map((item, index) => <TableColumn key={index}>{item}</TableColumn>)}
                        </TableHeader>
                        <TableBody loadingContent={<Spinner/>} loadingState={isLoading ? 'loading' : 'idle'} emptyContent="Tidak ada data">
                            {data?.vehicles.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{item.vehicle.noPolisi}</TableCell>
                                    <TableCell>{item.vehicle.modelKendaraan}</TableCell>
                                    <TableCell>{item.vehicle.tahunPembuatan}</TableCell>
                                    <TableCell>{item.vehicle.nomorRangka}</TableCell>
                                    <TableCell>{item.vehicle.nomorRangka}</TableCell>
                                    <TableCell>{item.vehicle.kepemilikan}</TableCell>
                                    <TableCell className='flex items-center gap-1'>
                                        <Button size='sm' onPress={() => onClickEdit(item.vehicle)} color='warning' isIconOnly><PencilSquareIcon className='size-4'/></Button>
                                        <Button size='sm' onPress={() => onClickDelete(item.vehicle.id, data.id)} color='danger' isIconOnly><TrashIcon className='size-4'/></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>

            <ModalAlert isOpen={isOpenModalAlert} onOpenChange={onOpenChangeModalAlert} onSubmit={onSubmitDelete} icon="danger"/>
            <Modal scrollBehavior="inside" isOpen={isOpenModalForm} onOpenChange={onOpenChangeModalForm} onClose={onCloseForm} isDismissable={false} isKeyboardDismissDisabled={false}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>{isEdit ? 'Edit Data Kendaraan' : 'Tambah Data Kendaraan'}</ModalHeader>
                            <ModalBody>
                                <form onSubmit={handleSubmit(onSubmitForm)}>
                                    <div className='flex flex-col gap-3 mb-6'>
                                        <Input
                                            {...register('noPolisi')}
                                            isRequired
                                            variant="faded" 
                                            type="text" 
                                            label="No. Polisi" 
                                            color={errors.noPolisi ? 'danger' : 'default'}
                                            isInvalid={errors.noPolisi} 
                                            errorMessage={errors.noPolisi && errors.noPolisi.message}
                                        />
                                        <Input
                                            {...register('modelKendaraan')}
                                            isRequired
                                            variant="faded" 
                                            type="text" 
                                            label="Model Kendaraan" 
                                            color={errors.modelKendaraan ? 'danger' : 'default'}
                                            isInvalid={errors.modelKendaraan} 
                                            errorMessage={errors.modelKendaraan && errors.modelKendaraan.message}
                                        />
                                        <Input
                                            {...register('tahunPembuatan')}
                                            isRequired
                                            variant="faded" 
                                            type="text" 
                                            label="Tahun Pembuatan" 
                                            color={errors.tahunPembuatan ? 'danger' : 'default'}
                                            isInvalid={errors.tahunPembuatan} 
                                            errorMessage={errors.tahunPembuatan && errors.tahunPembuatan.message}
                                        />
                                        <Input
                                            {...register('nomorRangka')}
                                            isRequired
                                            variant="faded" 
                                            type="text" 
                                            label="No. Rangka" 
                                            color={errors.nomorRangka ? 'danger' : 'default'}
                                            isInvalid={errors.nomorRangka} 
                                            errorMessage={errors.nomorRangka && errors.nomorRangka.message}
                                        />
                                        <Input
                                            {...register('nomorMesin')}
                                            isRequired
                                            variant="faded" 
                                            type="text" 
                                            label="No. Mesin" 
                                            color={errors.nomorMesin ? 'danger' : 'default'}
                                            isInvalid={errors.nomorMesin} 
                                            errorMessage={errors.nomorMesin && errors.nomorMesin.message}
                                        />
                                        <Input
                                            {...register('kepemilikan')}
                                            isRequired
                                            variant="faded" 
                                            type="text" 
                                            label="Kepemilikan" 
                                            color={errors.kepemilikan ? 'danger' : 'default'}
                                            isInvalid={errors.kepemilikan} 
                                            errorMessage={errors.kepemilikan && errors.kepemilikan.message}
                                        />
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
        </>
    )
}