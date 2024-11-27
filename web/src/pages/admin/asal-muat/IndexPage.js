import { Button, Card, CardBody, CardHeader, Chip, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Spinner } from "@nextui-org/react";
import RootAdmin from "../../../components/layouts/RootAdmin";
import { PencilSquareIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";
import useSWR from "swr";
import { getFetcher, getSelectFetcher } from "../../../services/api";
import CustomDataGrid from "../../../components/elements/CustomDataGrid";
import useAsalMuat from "../../../hooks/useAsalMuat";
import useAuth from "../../../hooks/useAuth";
import RolesAccess from "../../../enums/roles";
import FilterReactSelect from "../../../components/elements/FilterReactSelect";
import ControlledInput from "../../../components/elements/ControlledInput";
import ControlledReactSelect from "../../../components/elements/ControlledReactSelect";
import ButtonModalAlert from "../../../components/elements/ButtonModalAlert";

export default function IndexPage() {
    const { user, roles } = useAuth();
    const isSuperAdmin = roles.includes(RolesAccess.SUPER_ADMIN);
    const { data: dataCompany, isLoading: isLoadingCompany } = useSWR(
        isSuperAdmin
            ? `/api/company/search-company`
            : `/api/company/search-company?ids=${user.companies.map((company) => company.id).join(",")}`,
        getSelectFetcher
    );
    
    const [selectedCompany, setSelectedCompany] = useState('');
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const { data, isLoading, mutate } = useSWR(selectedCompany ? `/api/company/search-perusahaan-asal-muat?page=${page + 1}&limit=${pageSize}&companyId=${selectedCompany}` : null, getFetcher);
    console.log(data);
    const { 
        isEdit,
        onClickEdit, 
        onSubmitDelete,
        onCloseForm,
        onSubmitForm, 
        fetchData: { dataProvince, dataRegency, dataDistrict, dataVillage },
        modalForm: { onOpenModalForm, isOpenModalForm, onOpenChangeModalForm },
        hookForm: { register, control, handleSubmit, setValue, formState: { errors, isSubmitting, dirtyFields } }, 
    } = useAsalMuat({ mutate });

    const columns = useMemo(() =>  [
        {
            field: 'company',
            headerName: 'Perusahaan',
            valueGetter: (value, row) => row.company.name,
        },
        {
            field: 'namaPerusahaan',
            headerName: 'Perusahaan Asal Muat',
        },
        {
            field: 'locationType',
            headerName: 'Tipe Tempat',
        },
        {
            field: 'alamat',
            headerName: 'Alamat',
        },
        {
            field: 'province',
            headerName: 'Provinsi',
            valueGetter: (value, row) => row.province.name,
        },
        {
            field: 'regency',
            headerName: 'Kabupaten/Kota',
            valueGetter: (value, row) => row.regency.name,
        },
        {
            field: 'district',
            headerName: 'Kecamatan',
            valueGetter: (value, row) => row.district.name,
        },
        {
            field: 'village',
            headerName: 'Kelurahan',
            valueGetter: (value, row) => row.village.name,
        },
        {
            field: 'latitude',
            headerName: 'Latitude',
        },
        {
            field: 'longitude',
            headerName: 'Longitude',
        },
        {
            field: 'action',
            headerName: 'Aksi',
            renderCell: (params) => (
                <div className="flex items-center gap-1">
                    <Button size='sm' onPress={() => onClickEdit(params.row)} color='warning' isIconOnly><PencilSquareIcon className='size-4'/></Button>
                    <ButtonModalAlert
                        buttonTitle={<TrashIcon className='size-4' />}
                        buttonIsIconOnly
                        buttonColor="danger"
                        modalIcon="danger" 
                        modalHeading="Hapus Asal Muat?"
                        buttonSubmitText="Hapus"
                        buttonCancelText="Batal"
                        onSubmit={() => onSubmitDelete(params.row.id)}
                    />
                </div>
            ),
            sortable: false,
            filterable: false
        },
    ], [onClickEdit, onSubmitDelete]);


    return(
        <RootAdmin>
            <Card className="w-full mt-3" radius="sm">
                <CardHeader>
                    <p className="text-md">Daftar Asal Muat</p>
                </CardHeader>
                <Divider />
                <CardBody className='w-full h-[550px] p-5'>
                    <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex flex-col justify-end">
                            <Button onPress={onOpenModalForm} size="sm" color="primary" startContent={<PlusIcon className="size-4 stroke-2"/>}>Tambah</Button>
                        </div>
                        <div className="w-1/4">
                            <FilterReactSelect 
                                placeholder={'Cari Perusahaan'}
                                options={dataCompany} 
                                isLoading={isLoadingCompany}
                                setValue={setSelectedCompany} 
                            />
                        </div>
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
                            columns: {
                                columnVisibilityModel: {
                                    province: false,
                                    regency: false,
                                    district: false,
                                    village: false,
                                    longitude: false,
                                    latitude: false,
                                },
                            },
                        }}
                    />
                </CardBody>
            </Card>

            <Modal size="2xl" scrollBehavior="inside" isOpen={isOpenModalForm} onOpenChange={onOpenChangeModalForm} onClose={onCloseForm} isDismissable={false} isKeyboardDismissDisabled={false}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>{isEdit ? 'Ubah' : 'Tambah'} Asal Muat</ModalHeader>
                            <ModalBody>
                                <form onSubmit={handleSubmit(onSubmitForm)}>
                                    {
                                        isEdit && !dataVillage 
                                            ?
                                            <div className="flex items-center justify-center">
                                                <Spinner/>
                                            </div>
                                            :
                                            <>
                                                <div className='grid grid-cols-2 gap-3 mb-6'>  
                                                    <ControlledReactSelect control={control} label="Perusahaan" name="companyId" options={dataCompany} />
                                                    <ControlledInput label="Nama Perusahaan Asal Muat" name="namaPerusahaan" type="text" isRequired={true} control={control} />
                                                    <ControlledInput label="Alamat" name="alamat" type="text" isRequired={true} control={control} />
                                                    <Select
                                                        {...register('locationType')}
                                                        isRequired
                                                        variant="faded"
                                                        disallowEmptySelection
                                                        label="Tipe"
                                                        labelPlacement="outside"
                                                        placeholder='Pilih...'
                                                        color={errors.locationType ? 'danger' : 'default'}
                                                        isInvalid={errors.locationType}
                                                        errorMessage={errors.locationType && errors.locationType.message}
                                                    >
                                                        <SelectItem key="Gudang">Gudang</SelectItem>
                                                        <SelectItem key="Pelabuhan">Pelabuhan</SelectItem>
                                                    </Select>
                                                    <ControlledInput label="Latitude" name="latitude" type="text" isRequired={true} control={control} />
                                                    <ControlledInput label="Longitude" name="longitude" type="text" isRequired={true} control={control} />  
                                                    <Select
                                                        {...register('provinceId')}
                                                        isRequired
                                                        disallowEmptySelection
                                                        label="Provinsi"
                                                        labelPlacement="outside"
                                                        placeholder='Pilih...'
                                                        onChange={(e) => setValue('provinceId', e.target.value)}
                                                        color={errors.provinceId ? 'danger' : 'default'}
                                                        isInvalid={errors.provinceId}
                                                        errorMessage={errors.provinceId && errors.provinceId.message}
                                                    >
                                                        {dataProvince?.map(item => (
                                                            <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                                                        ))}
                                                    </Select>                    
                                                    <Select
                                                        {...register('regencyId')}
                                                        isRequired
                                                        disallowEmptySelection
                                                        variant="faded"
                                                        label="Kabupaten"
                                                        labelPlacement="outside"
                                                        placeholder='Pilih...'
                                                        onChange={(e) => setValue('regencyId', e.target.value)}
                                                        color={errors.regencyId ? 'danger' : 'default'}
                                                        isInvalid={errors.regencyId}
                                                        errorMessage={errors.regencyId && errors.regencyId.message}
                                                    >
                                                        {dataRegency?.map(item => (
                                                            <SelectItem key={item.id}>{item.name}</SelectItem>
                                                        ))}
                                                    </Select>                    
                                                    <Select
                                                        {...register('districtId')}
                                                        isRequired
                                                        disallowEmptySelection
                                                        variant="faded"
                                                        label="Kecamatan"
                                                        labelPlacement="outside"
                                                        placeholder='Pilih...'
                                                        onChange={(e) => setValue('districtId', e.target.value)}
                                                        color={errors.districtId ? 'danger' : 'default'}
                                                        isInvalid={errors.districtId}
                                                        errorMessage={errors.districtId && errors.districtId.message}
                                                    >
                                                        {dataDistrict?.map(item => (
                                                            <SelectItem key={item.id}>{item.name}</SelectItem>
                                                        ))}
                                                    </Select>                    
                                                    <Select
                                                        {...register('villageId')}
                                                        isRequired
                                                        disallowEmptySelection
                                                        variant="faded"
                                                        label="Kelurahan"
                                                        labelPlacement="outside"
                                                        placeholder='Pilih...'
                                                        color={errors.villageId ? 'danger' : 'default'}
                                                        isInvalid={errors.villageId}
                                                        errorMessage={errors.villageId && errors.villageId.message}
                                                    >
                                                        {dataVillage?.map(item => (
                                                            <SelectItem key={item.id}>{item.name}</SelectItem>
                                                        ))}
                                                    </Select>                    
                                                </div>
                                                <div className='flex items-center gap-1'>
                                                    <Button isLoading={isSubmitting} isDisabled={isSubmitting || (isEdit && Object.keys(dirtyFields).length === 0)} type='submit' color='primary'>{isEdit ? 'Simpan' : 'Tambah'}</Button>
                                                    <Button isDisabled={isSubmitting} color='danger' variant='faded' onPress={onClose}>Batal</Button>
                                                </div>
                                            </>

                                    }
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
