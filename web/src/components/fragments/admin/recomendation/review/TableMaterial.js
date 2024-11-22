import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Checkbox,
    Divider,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from '@nextui-org/react'
import ModalAlert from '../../../../elements/ModalAlert'
import { EyeIcon, PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import useRecomendationMaterial from '../../../../../hooks/useRecomendationMaterial'
import ModalDetailList from '../../../../elements/ModalDetailList'
import DynamicInputPoolAddress from '../../../../elements/DynamicInputPoolAdress'
import { Controller } from 'react-hook-form'
import { getSelectFetcher } from '../../../../../services/api'
import useSWR from 'swr'
import ReactSelect from '../../../../elements/ReactSelect'
import IsValidIcon from '../../../../elements/isValidIcon'

export default function TableMaterial({ data, isLoading, mutate }) {
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
        hookForm: {
            register,
            handleSubmit,
            control,
            formState: { errors, isSubmitting, dirtyFields },
        },
    } = useRecomendationMaterial({ mutate })
    const { data: dataMaterial, isLoading: isLoadingMaterial } = useSWR(`/api/data-master/bahan-b3`, getSelectFetcher)

    const list = (item) => [
        {
            label: 'Cas Number',
            value: item.dataBahanB3.casNumber,
        },
        {
            label: 'Nama Bahan Kimia',
            value: item.dataBahanB3.namaBahanKimia,
        },
        {
            label: 'Nama Dagang',
            value: item.dataBahanB3.namaDagang,
        },
        {
            label: 'Tipe Bahan B3',
            value: item.dataBahanB3.tipeBahan,
        },
        {
            label: 'Karateristik Bahan B3',
            value: item.karakteristikB3,
        },
        {
            label: 'Fasa Bahan B3',
            value: item.fasaB3,
        },
        {
            label: 'Jenis Kemasan',
            value: item.jenisKemasan,
        },
        {
            label: 'Tujuan Penggunaan',
            value: item.tujuanPenggunaan,
        },
        {
            label: 'B3 Diluar List',
            value: <IsValidIcon value={item.b3DiluarList} />,
        },
        {
            label: 'B3 PP 74',
            value: <IsValidIcon value={item.b3pp74} />,
        },
        {
            label: 'Asal Muat',
            value: item.asalMuatLocations.map((location, index) => (
                <div key={index}>
                    {index + 1}. {location.name}
                </div>
            )),
        },
        {
            label: 'Tujuan Bongkar',
            value: item.tujuanBongkarLocations.map((location, index) => (
                <div key={index}>
                    {index + 1}. {location.name}
                </div>
            )),
        },
    ]

    const columns = [
        'No',
        'Nama Dagang',
        'Cas Number / Nama Bahan Kimia',
        'Karateristik B3',
        'Fasa B3',
        'Jenis Kemasan',
        'Aksi',
    ]

    return (
        <>
            <Card radius="sm">
                <CardHeader className="flex items-center gap-3">
                    <p className="text-md">Data Bahan B3</p>
                    <Button isIconOnly onPress={() => onClickCreate(data.id)} size="sm" color="primary">
                        <PlusIcon className="size-4 stroke-2" />
                    </Button>
                </CardHeader>
                <Divider />
                <CardBody>
                    <Table removeWrapper aria-label="table-vehicle">
                        <TableHeader>
                            {columns.map((item, index) => (
                                <TableColumn key={index}>{item}</TableColumn>
                            ))}
                        </TableHeader>
                        <TableBody
                            loadingContent={<Spinner />}
                            loadingState={isLoading ? 'loading' : 'idle'}
                            emptyContent="Tidak ada data"
                        >
                            {data?.b3Substances.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{item.dataBahanB3.namaDagang}</TableCell>
                                    <TableCell>
                                        {item.dataBahanB3.casNumber} / {item.dataBahanB3.namaBahanKimia}
                                    </TableCell>
                                    <TableCell>{item.karakteristikB3}</TableCell>
                                    <TableCell>{item.fasaB3}</TableCell>
                                    <TableCell>{item.jenisKemasan}</TableCell>
                                    <TableCell className="flex items-center gap-1">
                                        <ModalDetailList list={list(item)} label={'Bahan B3'} />
                                        <Button isIconOnly size="sm" color="warning" onPress={() => onClickEdit(item)}>
                                            <PencilSquareIcon className="size-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            onPress={() => onClickDelete(item.id)}
                                            color="danger"
                                            isIconOnly
                                        >
                                            <TrashIcon className="size-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>

            <ModalAlert
                isOpen={isOpenModalAlert}
                onOpenChange={onOpenChangeModalAlert}
                onSubmit={onSubmitDelete}
                icon="danger"
            />
            <Modal
                scrollBehavior="inside"
                size="5xl"
                isOpen={isOpenModalForm}
                onOpenChange={onOpenChangeModalForm}
                onClose={onCloseForm}
                isDismissable={false}
                isKeyboardDismissDisabled={false}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>{isEdit ? 'Edit' : 'Tambah'} Data Bahan B3</ModalHeader>
                            <ModalBody>
                                <form onSubmit={handleSubmit(onSubmitForm)}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                                        {isEdit !== true && (
                                            <div className={`col-span-2 `}>
                                                <Controller
                                                    name="dataBahanB3Id"
                                                    control={control}
                                                    render={({ field, fieldState }) => (
                                                        <ReactSelect
                                                            label="Bahan B3"
                                                            data={dataMaterial}
                                                            isLoading={isLoadingMaterial}
                                                            value={field.value}
                                                            onChange={(selectedOption) =>
                                                                field.onChange(
                                                                    selectedOption ? selectedOption.value : ''
                                                                )
                                                            }
                                                            error={fieldState.error && fieldState.error.message}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        )}
                                        <Checkbox {...register('b3pp74')}>B3 PP 74/2001</Checkbox>
                                        <Checkbox {...register('b3DiluarList')}>B3 Diluar List</Checkbox>
                                        <Input
                                            {...register('karakteristikB3')}
                                            isRequired
                                            variant="faded"
                                            type="text"
                                            label="Karateristik B3"
                                            labelPlacement="outside"
                                            placeholder="..."
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
                                            labelPlacement="outside"
                                            placeholder="..."
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
                                            labelPlacement="outside"
                                            placeholder="..."
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
                                            labelPlacement="outside"
                                            placeholder="..."
                                            color={errors.tujuanPenggunaan ? 'danger' : 'default'}
                                            isInvalid={errors.tujuanPenggunaan}
                                            errorMessage={errors.tujuanPenggunaan && errors.tujuanPenggunaan.message}
                                        />
                                        <Card className="col-span-2" radius="sm">
                                            <CardBody>
                                                <DynamicInputPoolAddress
                                                    control={control}
                                                    errors={errors}
                                                    fieldName="asalMuat"
                                                    label={'Asal Muat'}
                                                />
                                            </CardBody>
                                        </Card>
                                        <Card className="col-span-2" radius="sm">
                                            <CardBody>
                                                <DynamicInputPoolAddress
                                                    control={control}
                                                    errors={errors}
                                                    fieldName="tujuanBongkar"
                                                    label={'Tujuan Bongkar'}
                                                />
                                            </CardBody>
                                        </Card>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            isLoading={isSubmitting}
                                            isDisabled={
                                                isSubmitting || (isEdit && Object.keys(dirtyFields).length === 0)
                                            }
                                            type="submit"
                                            color="primary"
                                        >
                                            Simpan
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
                            <ModalFooter></ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}
