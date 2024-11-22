import { yupResolver } from '@hookform/resolvers/yup'
import { useDisclosure } from '@nextui-org/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import * as yup from 'yup'
import { deleteFetcher, postWithFormDataFetcher, putWithFormDataFetcher } from '../services/api'
import { dirtyInput, isResponseErrorObject } from '../services/helpers'
import useAuth from './useAuth'

export default function useEvent({ mutate }) {
    const { data: userData } = useAuth()

    const formSchema = yup
        .object()
        .shape({
            title: yup.string().required('Harus diisi'),
            description: yup.string().required('Harus diisi'),
            categories: yup.string().required('Harus diisi'),
            author: yup.string().required('Harus diisi'),
            // documents: yup.mixed(),
            photos: yup.mixed(),
            latitude: yup.number().required('Harus diisi'),
            longitude: yup.number().required('Harus diisi'),
            startDate: yup.string().required('Harus diisi'),
            endDate: yup.string().required('Harus diisi'),
            provinceName: yup.string().required('Harus diisi'),
            cityName: yup.string().required('Harus diisi'),
        })
        .required()

    const {
        isOpen: isOpenModalForm,
        onOpen: onOpenModalForm,
        onOpenChange: onOpenChangeModalForm,
        onClose: onCloseModalForm,
    } = useDisclosure()
    const { isOpen: isOpenModalAlert, onOpenChange: onOpenChangeModalAlert } = useDisclosure()
    const [editId, setEditId] = useState(null)
    const [isEdit, setIsEdit] = useState(false)
    const {
        register,
        handleSubmit,
        reset,
        control,
        setValue,
        getValues,
        watch,
        formState: { errors, isSubmitting, dirtyFields },
    } = useForm({ resolver: yupResolver(formSchema) })

    function onClickEdit(item) {
        setEditId(item.id)
        setIsEdit(true)
        reset({
            title: item.title,
            description: item.description,
            categories: item.categories[0]?.id,
            author: item.author,
            documents: item.attachmentsUrl,
            photos: item.photosUrl,
            latitude: item.latitude,
            longitude: item.longitude,
            startDate: item.startDate,
            endDate: item.endDate,
            provinceName: item.provinceName,
            cityName: item.cityName,
        })
        onOpenChangeModalForm()
    }

    function onCloseForm() {
        setEditId(null)
        setIsEdit(false)
        reset({
            title: '',
            description: '',
            categories: '',
            documents: [],
            photos: [],
            latitude: 0,
            longitude: 0,
            startDate: '',
            endDate: '',
            author: '',
            provinceName: '',
            cityName: '',
        })
        onCloseModalForm()
    }

    function onClickDelete(id) {
        setEditId(id)
        onOpenChangeModalAlert()
    }

    async function onSubmitDelete() {
        try {
            await deleteFetcher('/api/content/event', editId)
            mutate()
            toast.success('Event berhasil dihapus!')
        } catch (error) {
            toast.error('Gagal hapus Event!')
        }
    }

    async function onSubmitForm(data) {
        try {
            if (isEdit) {
                const filteredData = dirtyInput(dirtyFields, data)

                const formData = new FormData()

                // Loop over filteredData to append fields to formData
                Object.keys(filteredData).forEach((key) => {
                    const value = filteredData[key]

                    // Special handling for 'attachments' field (which is an array of files)
                    if (key === 'documents' && Array.isArray(value)) {
                        if (value.length > 0) {
                            value.forEach((file, index) => {
                                console.log(`Appending file ${index + 1}:`, file)
                                if (file instanceof File) {
                                    formData.append('documents', file)
                                } else {
                                    console.error('Invalid file object:', file)
                                }
                            })
                        } else {
                            console.warn('No documents found.')
                        }
                    } else if (key === 'photos' && Array.isArray(value)) {
                        if (value.length > 0) {
                            value.forEach((file, index) => {
                                console.log(`Appending file ${index + 1}:`, file)
                                if (file instanceof File) {
                                    formData.append('photos', file)
                                } else {
                                    console.error('Invalid file object:', file)
                                }
                            })
                        } else {
                            console.warn('No photos found.')
                        }
                    } else if (value !== undefined && value !== null) {
                        formData.append(key, value)
                    }
                })

                formData.append('createdById', userData.userId)
                formData.append('status', 'PUBLISHED')

                await putWithFormDataFetcher('/api/content/event', editId, formData)
                mutate()
                toast.success('Event berhasil diubah!')
            } else {
                const formData = new FormData()

                // for (let i = 0; i < data.documents.length; i++) {
                //     formData.append('documents', data.documents[i])
                // }

                for (let i = 0; i < data.photos.length; i++) {
                    formData.append('photos', data.photos[i])
                }

                formData.append('title', data.title)
                formData.append('description', data.description)
                formData.append('author', data.author)
                formData.append('createdById', userData.userId)
                formData.append('categories', data.categories)
                formData.append('status', 'PUBLISHED')
                formData.append('startDate', data.startDate)
                formData.append('endDate', data.endDate)
                formData.append('latitude', data.latitude)
                formData.append('longitude', data.longitude)
                formData.append('province', data.provinceName)
                formData.append('city', data.cityName)

                await postWithFormDataFetcher('/api/content/event', formData)
                mutate()
                toast.success('Event berhasil ditambah!')
            }
            onCloseForm()
        } catch (error) {
            isResponseErrorObject(error.response.data.message)
                ? Object.entries(error.response.data.message).forEach(([key, value]) => {
                      toast.error(value)
                  })
                : toast.error(error.response.data.message)
        }
    }

    return {
        modalForm: {
            isOpenModalForm,
            onOpenModalForm,
            onOpenChangeModalForm,
        },
        modalAlert: {
            isOpenModalAlert,
            onOpenChangeModalAlert,
        },
        hookForm: {
            register,
            handleSubmit,
            reset,
            control,
            getValues,
            setValue,
            watch,
            formState: { errors, isSubmitting, dirtyFields },
        },
        isEdit,
        onClickEdit,
        onCloseForm,
        onClickDelete,
        onSubmitDelete,
        onSubmitForm,
    }
}
