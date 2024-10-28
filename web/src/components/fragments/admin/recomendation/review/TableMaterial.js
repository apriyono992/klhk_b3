import useSWR from "swr";
import { authStateFetcher } from "../../../../../services/api";
import { Button, Card, CardBody, CardHeader, Checkbox, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import ModalAlert from "../../../../elements/ModalAlert";
import { CheckCircleIcon, PencilSquareIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import useRecomendationMaterial from "../../../../../hooks/useRecomendationMaterial";

export default function TableMaterial() {
    const fetcher = (...args) => authStateFetcher(...args);
    const { data, isLoading } = useSWR('/products?limit=4&select=id,title,sku,brand,category,availabilityStatus,returnPolicy,shippingInformation', fetcher);
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
    } = useRecomendationMaterial();

    const columns = [
        'No',
        'Nama Dagang',
        'Cas Number / Nama Bahan Kimia',
        'B3 PP 74/2001',
        'Karateristik B3',
        'Fasa B3',
        'Jenis Kemasan',
        'Tujuan Penggunaan',
        'Aksi'
    ]

    return (
        <>
            <Card radius="sm">
                <CardHeader className="flex items-center gap-3">
                    <p className="text-md">Data Bahan B3</p>
                    <Button isIconOnly onPress={onOpenModalForm} size="sm" color="primary"><PlusIcon className="size-4 stroke-2"/></Button>
                </CardHeader>
                <Divider />
                <CardBody>
                    <Table removeWrapper aria-label="table-vehicle">
                        <TableHeader>
                            {columns.map((item, index) => <TableColumn key={index}>{item}</TableColumn>)}
                        </TableHeader>
                        <TableBody loadingContent={<Spinner/>} loadingState={isLoading ? 'loading' : 'idle'}>
                            {data?.products.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{item.title}</TableCell>
                                    <TableCell>{item.sku} / {item.brand}</TableCell>
                                    <TableCell><CheckCircleIcon className='size-6 stroke-success'/></TableCell>
                                    <TableCell>{item.category}</TableCell>
                                    <TableCell>{item.availabilityStatus}</TableCell>
                                    <TableCell>{item.returnPolicy}</TableCell>
                                    <TableCell>{item.shippingInformation}</TableCell>
                                    <TableCell className='flex items-center gap-1'>
                                        <Button isIconOnly size="sm" color="warning" onPress={() => onClickEdit(item)}><PencilSquareIcon className='size-4'/></Button>
                                        <Button size='sm' onPress={() => onClickDelete(item.id)} color='danger' isIconOnly><TrashIcon className='size-4'/></Button>   
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>

            <ModalAlert isOpen={isOpenModalAlert} onOpenChange={onOpenChangeModalAlert} onSubmit={onSubmitDelete} icon="danger"/>
            <Modal isOpen={isOpenModalForm} onOpenChange={onOpenChangeModalForm} onClose={onCloseForm} isDismissable={false} isKeyboardDismissDisabled={false}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>{isEdit ? 'Edit Data Kendaraan' : 'Tambah Data Kendaraan'}</ModalHeader>
                            <ModalBody>
                                <form onSubmit={handleSubmit(onSubmitForm)}>
                                    <div className='flex flex-col gap-3 mb-6'>
                                        <Input
                                            {...register('casNumber')}
                                            isRequired
                                            variant="faded" 
                                            type="text" 
                                            label="CAS Number" 
                                            color={errors.casNumber ? 'danger' : 'default'}
                                            isInvalid={errors.casNumber} 
                                            errorMessage={errors.casNumber && errors.casNumber.message}
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
                                        <Checkbox 
                                            {...register('b3pp74')}
                                        >
                                            B3 PP 74/2001
                                        </Checkbox>
                                        <Input
                                            {...register('karakteristikB3')}
                                            isRequired
                                            variant="faded" 
                                            type="text" 
                                            label="Karateristik B3" 
                                            color={errors.karakteristikB3 ? 'danger' : 'default'}
                                            isInvalid={errors.karakteristikB3} 
                                            errorMessage={errors.karakteristikB3 && errors.karakteristikB3.message}
                                        />
                                        <Input
                                            {...register('fasaB3')}
                                            isRequired
                                            variant="faded" 
                                            type="text" 
                                            label="Fasa B3" 
                                            color={errors.fasaB3 ? 'danger' : 'default'}
                                            isInvalid={errors.fasaB3} 
                                            errorMessage={errors.fasaB3 && errors.fasaB3.message}
                                        />
                                        <Input
                                            {...register('jenisKemasan')}
                                            isRequired
                                            variant="faded" 
                                            type="text" 
                                            label="Jenis Kemasan" 
                                            color={errors.jenisKemasan ? 'danger' : 'default'}
                                            isInvalid={errors.jenisKemasan} 
                                            errorMessage={errors.jenisKemasan && errors.jenisKemasan.message}
                                        />
                                        <Input
                                            {...register('tujuanPenggunaan')}
                                            isRequired
                                            variant="faded" 
                                            type="text" 
                                            label="Tujuan Penggunaan" 
                                            color={errors.tujuanPenggunaan ? 'danger' : 'default'}
                                            isInvalid={errors.tujuanPenggunaan} 
                                            errorMessage={errors.tujuanPenggunaan && errors.tujuanPenggunaan.message}
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