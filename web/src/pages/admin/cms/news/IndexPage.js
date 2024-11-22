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
} from '@nextui-org/react'
import RootAdmin from '../../../../components/layouts/RootAdmin'
import { PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useMemo, useState } from 'react'
import ModalAlert from '../../../../components/elements/ModalAlert'
import useSWR from 'swr'
import { BASE_URL, getFetcher, getSelectFetcher } from '../../../../services/api'
import CustomDataGrid from '../../../../components/elements/CustomDataGrid'
import useNews from '../../../../hooks/useNews'

// React Quill for rich text editor
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { Controller } from 'react-hook-form'

export default function IndexPage() {
    const [page, setPage] = useState(0)
    const [pageSize, setPageSize] = useState(10)

    const { data, isLoading, mutate } = useSWR(
        `/api/content/search-news?page=${page + 1}&limit=${pageSize}`,
        getFetcher
    )

    // Fetch category of news
    const { data: categoryList, isLoading: categoryListLoading } = useSWR(
        '/api/content/category?type=NEWS',
        getSelectFetcher
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
    } = useNews({ mutate })

    const processedData = data?.data?.map((row) => ({
        ...row,
        categoryName: row.categories?.[0]?.name || '',
    }))

    const newsImages = watch('attachments', [])

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
                field: 'views',
                headerName: 'Dilihat',
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

    return (
        <RootAdmin>
            <Card className="w-full mt-3" radius="sm">
                <CardHeader>
                    <p className="text-md">Daftar Berita</p>
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
                            <ModalHeader>{isEdit ? 'Ubah' : 'Tambah'} Berita</ModalHeader>
                            <ModalBody>
                                <form onSubmit={handleSubmit(onSubmitForm)}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                                        <Input
                                            {...register('title')}
                                            isRequired
                                            variant="faded"
                                            type="text"
                                            label="Judul Berita"
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
                                            name="attachments"
                                            rules={{ required: 'Image is required' }}
                                            render={({ field: { value, onChange, ...field } }) => {
                                                return (
                                                    <Input
                                                        {...field}
                                                        color={errors.attachments ? 'danger' : 'default'}
                                                        isInvalid={errors.attachments}
                                                        errorMessage={errors.attachments && errors.attachments.message}
                                                        radius="sm"
                                                        label="Gambar Berita"
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
                                        <div></div>
                                    </div>

                                    {newsImages.length > 0 && (
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                                            {newsImages.map((image, index) => (
                                                <div key={index} className="relative flex items-center space-x-4">
                                                    <div className="overflow-hidden rounded-lg shadow-md max-w-40">
                                                        <img
                                                            src={`${image instanceof Blob || image instanceof File ? URL.createObjectURL(image) : `${BASE_URL}${image}`}`}
                                                            alt={`Image ${index + 1}`}
                                                            className="w-full h-full object-contain"
                                                        />
                                                    </div>
                                                    {/* <Button
                                                            size="sm"
                                                            onPress={() => handleRemoveImage(index)}
                                                            color="danger"
                                                            isIconOnly
                                                            className="absolute top-2 right-2 p-1 text-white rounded-full shadow-md"
                                                        >
                                                            <TrashIcon className="size-4" />
                                                        </Button> */}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="mb-6">
                                        <div className="mb-1">
                                            <label className="text-sm">Konten</label>
                                        </div>

                                        <Controller
                                            control={control}
                                            name="content"
                                            rules={{ required: 'Content is required' }}
                                            render={({ field: { value, onChange, ...field } }) => {
                                                return (
                                                    <ReactQuill
                                                        {...field}
                                                        value={value}
                                                        onChange={onChange}
                                                        control={control}
                                                        modules={{
                                                            toolbar: [
                                                                [{ header: '1' }, { header: '2' }, { font: [] }],
                                                                [{ list: 'ordered' }, { list: 'bullet' }],
                                                                [{ align: [] }],
                                                                ['bold', 'italic', 'underline', 'strike'],
                                                                ['link'],
                                                                ['image'],
                                                                ['blockquote', 'code-block'],
                                                                [{ direction: 'rtl' }],
                                                            ],
                                                        }}
                                                    />
                                                )
                                            }}
                                        />
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
