import { Button, Card, CardBody, CardHeader, Checkbox, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, TableCell, TableRow, Chip } from "@nextui-org/react";
import RootAdmin from "../../../components/layouts/RootAdmin";
import { CheckIcon, PencilSquareIcon, PlusIcon } from "@heroicons/react/24/outline";
import useSWR from "swr";
import { getFetcher } from "../../../services/api";
import usePeriod from "../../../hooks/usePeriod";
import { format } from 'date-fns';
import { id } from 'date-fns/locale';  // Import Indonesian locale
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
        'Tanggal Mulai Periode',
        'Tanggal Akhir Periode',
        'Tanggal Mulai Pelaporan',
        'Tanggal Selesai Pelaporan',
        'Batas Waktu Finalisasi',
        'Status Periode',
        'Status Pelaporan',
        'Aksi'
    ]

    const content = (item) => (
        <TableRow key={item.id}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{format(item.startPeriodDate, 'PPP', { locale: id })}</TableCell>
            <TableCell>{format(item.endPeriodDate, 'PPP', { locale: id })}</TableCell>
            <TableCell>{format(item.startReportingDate, 'PPP', { locale: id })}</TableCell>
            <TableCell>{format(item.endReportingDate, 'PPP', { locale: id })}</TableCell>
            <TableCell>{format(item.finalizationDeadline, 'PPP', { locale: id })}</TableCell>
            <TableCell>
                {
                    item.isActive ?  <Chip color="success" variant="flat" size="sm">Aktif</Chip> : <Chip color="error" variant="flat" size="sm">Tidak Aktif</Chip>
                }
            </TableCell>
            <TableCell>
                {
                    item.isReportingActive ? <Chip color="success" variant="flat" size="sm">Aktif</Chip> : <Chip color="danger" variant="flat" size="sm">Tidak Aktif</Chip>
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

            <Modal
                isOpen={isOpenModalForm}
                onOpenChange={onOpenChangeModalForm}
                onClose={onCloseForm}
                isDismissable={false}
                isKeyboardDismissDisabled={false}
                >
                <ModalContent>
                    {(onClose) => (
                    <>
                        <ModalHeader>Tambah Periode</ModalHeader>
                        <ModalBody>
                        <form onSubmit={handleSubmit(onSubmitForm)}>
                            <div className="flex flex-col gap-3 mb-6">
                            {/* Nama Periode */}
                            <ControlledInput
                                label="Nama"
                                name="name"
                                type="text"
                                isRequired={true}
                                control={control}
                                errorMessage={errors?.name?.message}
                            />
                            
                            {/* Tanggal Mulai Periode */}
                            <ControlledInput
                                label="Tanggal Mulai Periode"
                                name="startPeriodDate"
                                type="date"
                                isRequired={true}
                                control={control}
                                errorMessage={errors?.startPeriodDate?.message}
                            />
                            
                            {/* Tanggal Akhir Periode */}
                            <ControlledInput
                                label="Tanggal Akhir Periode"
                                name="endPeriodDate"
                                type="date"
                                isRequired={true}
                                control={control}
                                errorMessage={errors?.endPeriodDate?.message}
                            />
                            
                            {/* Tanggal Awal Pelaporan */}
                            <ControlledInput
                                label="Tanggal Mulai Pelaporan"
                                name="startReportingDate"
                                type="date"
                                isRequired={true}
                                control={control}
                                errorMessage={errors?.startReportingDate?.message}
                            />
                            
                            {/* Tanggal Akhir Pelaporan */}
                            <ControlledInput
                                label="Tanggal Selesai Pelaporan"
                                name="endReportingDate"
                                type="date"
                                isRequired={true}
                                control={control}
                                errorMessage={errors?.endReportingDate?.message}
                            />
                            
                            {/* Tanggal Finalisasi */}
                            <ControlledInput
                                label="Batas Waktu Finalisasi"
                                name="finalizationDeadline"
                                type="date"
                                isRequired={true}
                                control={control}
                                errorMessage={errors?.finalizationDeadline?.message}
                            />
                            
                            {/* Checkbox untuk Aktivasi */}
                            <Checkbox {...register("isActive")}>Aktif</Checkbox>
                            <Checkbox {...register("isReportingActive")}>Pelaporan Aktif</Checkbox>
                            </div>
                            
                            {/* Tombol Aksi */}
                            <div className="flex items-center gap-1">
                            <Button
                                isLoading={isSubmitting}
                                isDisabled={isSubmitting}
                                type="submit"
                                color="primary"
                            >
                                Tambah
                            </Button>
                            <Button
                                isDisabled={isSubmitting}
                                color="danger"
                                variant="faded"
                                onPress={onClose}
                            >
                                Batal
                            </Button>
                            </div>
                        </form>
                        </ModalBody>
                        <ModalFooter />
                    </>
                    )}
                </ModalContent>
                </Modal>

        </RootAdmin>
    )
}
