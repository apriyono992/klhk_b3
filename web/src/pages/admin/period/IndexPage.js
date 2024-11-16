import { Button, Card, CardBody, CardHeader, Checkbox, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, TableCell, TableRow } from "@nextui-org/react";
import RootAdmin from "../../../components/layouts/RootAdmin";
import { CheckIcon, PencilSquareIcon, PlusIcon } from "@heroicons/react/24/outline";
import useSWR from "swr";
import { getFetcher } from "../../../services/api";
import usePeriod from "../../../hooks/usePeriod";
import { format } from 'date-fns';
import ClientTablePagination from "../../../components/elements/ClientTablePagination";
import ControlledInput from "../../../components/elements/ControlledInput";
import IsValidIcon from "../../../components/elements/isValidIcon";

export default function IndexPage() {
    const { data, isLoading, mutate } = useSWR(`/api/period/all`, getFetcher);
    const { 
        onClickEdit, 
        onCloseForm,
        onSubmitForm, 
        modalForm: { onOpenModalForm, isOpenModalForm, onOpenChangeModalForm },
        hookForm: { register,control, handleSubmit, formState: { errors, isSubmitting, dirtyFields } }, 
    } = usePeriod({ mutate });

    const header = [
        'Nama',
        'Tanggal Mulai',
        'Tanggal Selesai',
        'Tanggal Finalisasi',
        'Status',
        'Aksi'
    ]

    const content = (item) => (
        <TableRow key={item.id}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{format(item.startDate, 'PPP')}</TableCell>
            <TableCell>{format(item.endDate, 'PPP')}</TableCell>
            <TableCell>{format(item.finalizationDeadline, 'PPP')}</TableCell>
            <TableCell>
                {
                    item.isActive ? <span className="text-success">Aktif</span> : <span className="text-danger">Tidak Aktif</span>
                }
            </TableCell>
            <TableCell>
                <Button size='sm' onPress={() => onClickEdit(item.id)} color='success' isIconOnly><CheckIcon className='size-4'/></Button>
            </TableCell>
        </TableRow>
    );


    return(
        <RootAdmin>
            <Card className="w-full mt-3" radius="sm">
                <CardHeader>
                    <p className="text-md">Daftar Periode</p>
                </CardHeader>
                <Divider />
                <CardBody>
                    <div className="mb-5">
                        <Button onPress={onOpenModalForm} size="sm" color="primary" startContent={<PlusIcon className="size-4 stroke-2"/>}>Tambah</Button>
                    </div>
                    <ClientTablePagination
                        data={data}
                        isLoading={isLoading}
                        header={header}
                        content={content}
                    />
                </CardBody>
            </Card>

            <Modal isOpen={isOpenModalForm} onOpenChange={onOpenChangeModalForm} onClose={onCloseForm} isDismissable={false} isKeyboardDismissDisabled={false}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Tambah Periode</ModalHeader>
                            <ModalBody>
                                <form onSubmit={handleSubmit(onSubmitForm)}>
                                    <div className='flex flex-col gap-3 mb-6'> 
                                        <ControlledInput label="Nama" name="name" type="text" isRequired={true} control={control} /> 
                                        <ControlledInput label="Tanggal Mulai" name="startDate" type="date" isRequired={true} control={control} /> 
                                        <ControlledInput label="Tanggal Selesai" name="endDate" type="date" isRequired={true} control={control} /> 
                                        <ControlledInput label="Tanggal Finalisasi" name="finalizationDeadline" type="date" isRequired={true} control={control} />
                                        <Checkbox {...register("isActive")}>Aktif</Checkbox> 
                                    </div>
                                    <div className='flex items-center gap-1'>
                                        <Button isLoading={isSubmitting} isDisabled={isSubmitting} type='submit' color='primary'>Tambah</Button>
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
