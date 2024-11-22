import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Chip,
    Divider,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectItem,
    Textarea,
} from '@nextui-org/react'
import RootAdmin from '../../../../components/layouts/RootAdmin'
import { PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useEffect, useMemo, useState } from 'react'
import ModalAlert from '../../../../components/elements/ModalAlert'
import useSWR from 'swr'
import { BASE_URL, getBasicSelectFetcher, getFetcher, getSelectFetcher } from '../../../../services/api'
import CustomDataGrid from '../../../../components/elements/CustomDataGrid'
import useNews from '../../../../hooks/useNews'

// React Quill for rich text editor
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { Controller } from 'react-hook-form'
import useEvent from '../../../../hooks/useEvent'

export default function IndexPage() {
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)
    const [provinceId, setProvinceId] = useState(null)
    const [provinceName, setProvinceName] = useState('')
    const [cityId, setCityId] = useState(null)
    const [cityName, setCityName] = useState('')
    const [districtId, setDistrictId] = useState(null)
    const [districtName, setDistrictName] = useState('')
    const [villageId, setVillageId] = useState(null)
    const [villageName, setVillageName] = useState('')

    const [provinceList, setProvinceList] = useState([])
    const [cityList, setCityList] = useState([])
    const [districtList, setDistrictList] = useState([])
    const [villageList, setVillageList] = useState([])

    const { data, isLoading, mutate } = useSWR(
        `/api/content/search-event?page=${page + 1}&limit=${pageSize}`,
        getFetcher
    )

    // Fetch category of event
    const { data: categoryList, isLoading: categoryListLoading } = useSWR(
        '/api/content/category?type=EVENT',
        getSelectFetcher
    )

    // Fetch location
    const { data: provinceData, isLoading: provinceLoading } = useSWR('/api/location/provinces', getBasicSelectFetcher)
    // Load cities when province is selected
    const { data: cityData, isLoading: cityLoading } = useSWR(
        provinceId ? `/api/location/cities?provinceId=${provinceId}` : null,
        getBasicSelectFetcher
    )

    // Load districts when city is selected
    const { data: districtData, isLoading: districtLoading } = useSWR(
        cityId ? `/api/location/districts?regencyId=${cityId}` : null,
        getBasicSelectFetcher
    )

    // Load villages when district is selected
    const { data: villageData, isLoading: villageLoading } = useSWR(
        districtId ? `/api/location/villages?districtId=${districtId}` : null,
        getBasicSelectFetcher
    )

    const {
        isEdit,
        onClickEdit,
        onClickDelete,
        onSubmitDelete,
        onCloseForm,
        onSubmitForm,
        modalForm: { onOpenModalForm, isOpenModalForm, onOpenChangeModalForm },
        modalAlert: { isOpenModalAlert, onOpenChangeModalAlert },
        hookForm: {
            register,
            handleSubmit,
            control,
            watch,
            getValues,
            setValue,
            formState: { errors, isSubmitting, dirtyFields },
        },
    } = useEvent({ mutate })

    const processedData = data?.data?.map((row) => ({
        ...row,
        categoryName: row.categories?.[0]?.name || '',
    }))

    // const handleRemoveImage = (index) => {
    //     const currentImages = getValues('attachments')
    //     const updatedImages = currentImages.filter((_, i) => i !== index)
    //     setValue('attachments', updatedImages)
    // }

    const columns = useMemo(
        () => [
            {
                field: 'title',
                headerName: 'Judul',
            },
            {
                field: 'categoryName',
                headerName: 'Kategori',
            },
            {
                field: 'startDate',
                headerName: 'Mulai',
            },
            {
                field: 'endDate',
                headerName: 'Berakhir',
            },
            {
                field: 'author',
                headerName: 'Penulis',
            },
            {
                field: 'status',
                headerName: 'Status',
                renderCell: (params) => {
                    switch (params.row.status) {
                        case 'DRAFT':
                            return (
                                <Chip color="warning" variant="flat" size="sm">
                                    {params.row.status}
                                </Chip>
                            )
                        default:
                            return (
                                <Chip color="success" variant="flat" size="sm">
                                    {params.row.status}
                                </Chip>
                            )
                    }
                },
                sortable: false,
                filterable: false,
            },
            {
                field: 'action',
                headerName: 'Aksi',
                renderCell: (params) => (
                    <div className="flex items-center gap-1">
                        <Button size="sm" onPress={() => onClickEdit(params.row)} color="warning" isIconOnly>
                            <PencilSquareIcon className="size-4" />
                        </Button>
                        <Button size="sm" onPress={() => onClickDelete(params.row.id)} color="danger" isIconOnly>
                            <TrashIcon className="size-4" />
                        </Button>
                    </div>
                ),
                sortable: false,
                filterable: false,
            },
        ],
        [onClickEdit, onClickDelete]
    )

    const handleProvinceChange = (e) => {
        const selectedProvince = provinceList.find((province) => province.id === e.target.value)
        if (selectedProvince) {
            setCityId(null)
            setDistrictId(null)
            setVillageId(null)

            setCityList([])
            setDistrictList([])
            setVillageList([])

            setProvinceId(selectedProvince.id)
            setProvinceName(selectedProvince.name)

            setValue('provinceName', selectedProvince.name)
        }
    }

    const handleCityChange = (e) => {
        const selectedCity = cityList.find((city) => city.id === e.target.value)
        if (selectedCity) {
            setDistrictId(null)
            setVillageId(null)

            setDistrictList([])
            setVillageList([])

            setCityId(selectedCity.id)
            setCityName(selectedCity.name)

            setValue('cityName', selectedCity.name)
        }
    }

    const handleDistrictChange = (e) => {
        const selectedDistrict = districtList.find((district) => district.id === e.target.value)
        if (selectedDistrict) {
            setVillageId(null)

            setVillageList([])

            setDistrictId(selectedDistrict.id)
            setDistrictName(selectedDistrict.name)

            setValue('districtName', selectedDistrict.name)
        }
    }

    const handleVillageChange = (e) => {
        const selectedVillage = villageList.find((village) => village.id === e.target.value)
        if (selectedVillage) {
            setVillageId(selectedVillage.id)
            setVillageName(selectedVillage.name)

            setValue('villageName', selectedVillage.name)
        }
    }

    useEffect(() => {
        if (provinceData?.length > 0) {
            setProvinceList(provinceData)
        }
    }, [provinceData])

    useEffect(() => {
        if (cityData?.length > 0) {
            setCityList(cityData)
        }
    }, [cityData])

    useEffect(() => {
        if (districtData?.length > 0) {
            setDistrictList(districtData)
        }
    }, [districtData])

    useEffect(() => {
        if (villageData?.length > 0) {
            setVillageList(villageData)
        }
    }, [villageData])

    return (
        <RootAdmin>
            <Card className="w-full mt-3" radius="sm">
                <CardHeader>
                    <p className="text-md">Daftar Event</p>
                </CardHeader>
                <Divider />
                <CardBody className="w-full h-[550px] p-5">
                    <div className="mb-5">
                        <Button
                            onPress={onOpenModalForm}
                            size="sm"
                            color="primary"
                            startContent={<PlusIcon className="size-4 stroke-2" />}
                        >
                            Tambah
                        </Button>
                    </div>
                    <CustomDataGrid
                        data={processedData}
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
                                    telpKantor: false,
                                    faxKantor: false,
                                    emailKantor: false,
                                    npwp: false,
                                    alamatPool: false,
                                    bidangUsaha: false,
                                    nomorInduk: false,
                                },
                            },
                        }}
                    />
                </CardBody>
            </Card>

            <ModalAlert
                isOpen={isOpenModalAlert}
                onOpenChange={onOpenChangeModalAlert}
                onSubmit={onSubmitDelete}
                icon="danger"
            />
            <Modal
                size="3xl"
                isOpen={isOpenModalForm}
                onOpenChange={onOpenChangeModalForm}
                onClose={onCloseForm}
                isDismissable={false}
                isKeyboardDismissDisabled={false}
                classNames={{
                    wrapper: isOpenModalForm ? 'overflow-hidden' : 'overflow-auto',
                }}
            >
                <ModalContent className="max-h-[90vh] overflow-y-auto">
                    {(onClose) => (
                        <>
                            <ModalHeader>{isEdit ? 'Ubah' : 'Tambah'} Event</ModalHeader>
                            <ModalBody>
                                <form onSubmit={handleSubmit(onSubmitForm)}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                                        <Input
                                            {...register('title')}
                                            isRequired
                                            variant="faded"
                                            type="text"
                                            label="Judul Event"
                                            color={errors.title ? 'danger' : 'default'}
                                            isInvalid={errors.title}
                                            errorMessage={errors.title && errors.title.message}
                                        />
                                        <Select
                                            {...register('categories')}
                                            isRequired
                                            variant="faded"
                                            label="Kategori"
                                            color={errors.status ? 'danger' : 'default'}
                                            isInvalid={errors.status}
                                            errorMessage={errors.status && errors.status.message}
                                        >
                                            {!categoryListLoading &&
                                                categoryList.map((item) => (
                                                    <SelectItem key={item.value}>{item.label}</SelectItem>
                                                ))}
                                        </Select>
                                        <Input
                                            {...register('startDate')}
                                            isRequired
                                            variant="faded"
                                            type="date"
                                            label="Tanggal Mulai"
                                            color={errors.startDate ? 'danger' : 'default'}
                                            isInvalid={errors.startDate}
                                            errorMessage={errors.startDate && errors.startDate.message}
                                        />
                                        <Input
                                            {...register('endDate')}
                                            isRequired
                                            variant="faded"
                                            type="date"
                                            label="Tanggal Berakhir"
                                            color={errors.endDate ? 'danger' : 'default'}
                                            isInvalid={errors.endDate}
                                            errorMessage={errors.endDate && errors.endDate.message}
                                        />
                                        <Textarea
                                            {...register('description')}
                                            isRequired
                                            variant="faded"
                                            type="text"
                                            label="Deskripsi"
                                            color={errors.description ? 'danger' : 'default'}
                                            isInvalid={errors.description}
                                            errorMessage={errors.description && errors.description.message}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                                        <Input
                                            {...register('latitude', {
                                                required: 'Latitude is required',
                                                pattern: {
                                                    value: /^-?\d+(\.\d+)?$/, // Regex for validating float numbers
                                                    message: 'Latitude must be a valid number',
                                                },
                                                min: -90, // Latitude should be >= -90
                                                max: 90, // Latitude should be <= 90
                                            })}
                                            isRequired
                                            variant="faded"
                                            type="number"
                                            label="Latitude"
                                            step="0.0000001"
                                            color={errors.latitude ? 'danger' : 'default'}
                                            isInvalid={errors.latitude}
                                            errorMessage={errors.latitude && errors.latitude.message}
                                        />
                                        <Input
                                            {...register('longitude', {
                                                required: 'Longitude is required',
                                                pattern: {
                                                    value: /^-?\d+(\.\d+)?$/, // Regex for validating float numbers
                                                    message: 'Longitude must be a valid number',
                                                },
                                                min: -90, // Latitude should be >= -90
                                                max: 90, // Latitude should be <= 90
                                            })}
                                            isRequired
                                            variant="faded"
                                            type="number"
                                            label="Longitude"
                                            step="0.0000001"
                                            color={errors.longitude ? 'danger' : 'default'}
                                            isInvalid={errors.longitude}
                                            errorMessage={errors.longitude && errors.longitude.message}
                                        />
                                        {!isEdit && (
                                            <>
                                                <Select
                                                    {...register('provinceId', {
                                                        required: 'Provinsi is required',
                                                    })}
                                                    isRequired
                                                    variant="faded"
                                                    label="Provinsi"
                                                    color={errors.provinceId ? 'danger' : 'default'}
                                                    isInvalid={errors.provinceId}
                                                    onChange={handleProvinceChange}
                                                    errorMessage={errors.provinceId && errors.provinceId.message}
                                                >
                                                    {!provinceLoading &&
                                                        provinceList?.map((item) => (
                                                            <SelectItem key={item.id} value={item.id}>
                                                                {item.name}
                                                            </SelectItem>
                                                        ))}
                                                </Select>

                                                <Select
                                                    {...register('cityId', {
                                                        required: 'Kota is required',
                                                    })}
                                                    isRequired
                                                    variant="faded"
                                                    label="Kota"
                                                    color={errors.cityId ? 'danger' : 'default'}
                                                    isInvalid={errors.cityId}
                                                    onChange={handleCityChange}
                                                    errorMessage={errors.cityId && errors.cityId.message}
                                                >
                                                    {!cityLoading &&
                                                        cityList?.map((item) => (
                                                            <SelectItem key={item.id} value={item.id}>
                                                                {item.name}
                                                            </SelectItem>
                                                        ))}
                                                </Select>
                                            </>
                                        )}

                                        {/* <Select
                                            {...register('districtId', {
                                                required: 'Kelurahan is required',
                                            })}
                                            isRequired
                                            variant="faded"
                                            label="Kelurahan"
                                            color={errors.districtId ? 'danger' : 'default'}
                                            isInvalid={errors.districtId}
                                            onChange={handleDistrictChange}
                                            errorMessage={errors.districtId && errors.districtId.message}
                                        >
                                            {!districtLoading &&
                                                districtList?.map((item) => (
                                                    <SelectItem key={item.id} value={item.id}>
                                                        {item.name}
                                                    </SelectItem>
                                                ))}
                                        </Select> */}

                                        {/* <Select
                                            {...register('villageId', {
                                                required: 'Kecamatan is required',
                                            })}
                                            isRequired
                                            variant="faded"
                                            label="Kecamatan"
                                            color={errors.villageId ? 'danger' : 'default'}
                                            isInvalid={errors.villageId}
                                            onChange={handleVillageChange}
                                            errorMessage={errors.villageId && errors.villageId.message}
                                        >
                                            {!villageLoading &&
                                                villageList?.map((item) => (
                                                    <SelectItem key={item.id} value={item.id}>
                                                        {item.name}
                                                    </SelectItem>
                                                ))}
                                        </Select> */}

                                        <div>
                                            <Input
                                                {...register('author')}
                                                isRequired
                                                variant="faded"
                                                type="text"
                                                label="Kreator"
                                                color={errors.author ? 'danger' : 'default'}
                                                isInvalid={errors.author}
                                                errorMessage={errors.author && errors.author.message}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                                        <Controller
                                            control={control}
                                            name="photos"
                                            rules={{ required: 'Image is required' }}
                                            render={({ field: { value, onChange, ...field } }) => {
                                                return (
                                                    <Input
                                                        {...field}
                                                        color={errors.photos ? 'danger' : 'default'}
                                                        isInvalid={errors.photos}
                                                        errorMessage={errors.photos && errors.photos.message}
                                                        radius="sm"
                                                        label="Gambar Event"
                                                        labelPlacement="outside"
                                                        type="file"
                                                        size="md"
                                                        // multiple
                                                        onChange={(e) => {
                                                            onChange([...e.target.files])
                                                        }}
                                                    />
                                                )
                                            }}
                                        />
                                        {/* <Controller
                                            control={control}
                                            name="documents"
                                            rules={{ required: 'Dokumen is required' }}
                                            render={({ field: { value, onChange, ...field } }) => {
                                                return (
                                                    <Input
                                                        {...field}
                                                        color={errors.documents ? 'danger' : 'default'}
                                                        isInvalid={errors.documents}
                                                        errorMessage={errors.documents && errors.documents.message}
                                                        radius="sm"
                                                        label="Dokumen Event"
                                                        labelPlacement="outside"
                                                        type="file"
                                                        size="md"
                                                        // multiple
                                                        onChange={(e) => {
                                                            onChange([...e.target.files])
                                                        }}
                                                    />
                                                )
                                            }}
                                        /> */}
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
                                            {isEdit ? 'Simpan' : 'Tambah'}
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
        </RootAdmin>
    )
}
