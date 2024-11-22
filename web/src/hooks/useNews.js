import { yupResolver } from '@hookform/resolvers/yup'
import { useDisclosure } from '@nextui-org/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import * as yup from 'yup'
import { deleteFetcher, postWithFormDataFetcher, putWithFormDataFetcher } from '../services/api'
import { dirtyInput, isResponseErrorObject } from '../services/helpers'
import useAuth from './useAuth'

export default function useNews({ mutate }) {
    const { data: userData } = useAuth()

    const formSchema = yup
        .object()
        .shape({
            title: yup.string().required('Harus diisi'),
            content: yup.string().required('Harus diisi'),
            categories: yup.string().required('Harus diisi'),
            attachments: yup.mixed().required('Harus diisi'),
            author: yup.string().required('Harus diisi'),
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
            content: item.content,
            categories: item.categories[0]?.id,
            attachments: item.photoUrls,
            author: item.author,
        })
        onOpenChangeModalForm()
    }

    function onCloseForm() {
        setEditId(null)
        setIsEdit(false)
        reset({
            title: '',
            content: '',
            categories: '',
            attachments: [],
            author: '',
        })
        onCloseModalForm()
    }

    function onClickDelete(id) {
        setEditId(id)
        onOpenChangeModalAlert()
    }

    async function onSubmitDelete() {
        try {
            await deleteFetcher('/api/content/news', editId)
            mutate()
            toast.success('Berita berhasil dihapus!')
        } catch (error) {
            toast.error('Gagal hapus Berita!')
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
                    if (key === 'attachments' && Array.isArray(value)) {
                        if (value.length > 0) {
                            value.forEach((file, index) => {
                                console.log(`Appending file ${index + 1}:`, file)
                                if (file instanceof File) {
                                    formData.append('attachments', file)
                                } else {
                                    console.error('Invalid file object:', file)
                                }
                            })
                        } else {
                            console.warn('No attachments found.')
                        }
                    } else if (value !== undefined && value !== null) {
                        formData.append(key, value)
                    }
                })

                formData.append('createdById', userData.userId)
                formData.append('status', 'PUBLISHED')

                await putWithFormDataFetcher('/api/content/news', editId, formData)
                mutate()
                toast.success('Berita berhasil diubah!')
            } else {
                const formData = new FormData()

                for (let i = 0; i < data.attachments.length; i++) {
                    formData.append('attachments', data.attachments[i])
                }

                formData.append('title', data.title)
                formData.append('content', data.content)
                formData.append('author', data.author)
                formData.append('createdById', userData.userId)
                formData.append('categories', data.categories)
                formData.append('status', 'PUBLISHED')

                await postWithFormDataFetcher('/api/content/news', formData)
                mutate()
                toast.success('Berita berhasil ditambah!')
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
