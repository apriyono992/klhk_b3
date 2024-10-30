import RootAdmin from '../../../components/layouts/RootAdmin';
import { Button, Card, CardBody, CardHeader, Chip, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import { EyeIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { getFetcher } from '../../../services/api';
import useSWR from 'swr';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import useCustomNavigate from '../../../hooks/useCustomNavigate';
import { useMemo, useState } from 'react';
import useNotification from '../../../hooks/useNotification';
import ModalAlert from '../../../components/elements/ModalAlert';
import SelectSearch from '../../../components/elements/SelectSearch';
import { Controller } from 'react-hook-form';
export default function IndexPage() {
    const fetcher = (...args) => getFetcher(...args);
    const { getNotificationDetailPath } = useCustomNavigate();
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const { data, isLoading, mutate } = useSWR(`/api/notifikasi?page=${page + 1}&limit=${pageSize}`, fetcher);
    const { 
        onClickDelete,
        onSubmitDelete,
        onCloseForm,
        onSubmitForm, 
        modalForm: { onOpenModalForm, isOpenModalForm, onOpenChangeModalForm },
        modalAlert: { isOpenModalAlert, onOpenChangeModalAlert },
        hookForm: { handleSubmit, control, formState: { isSubmitting } }, 
    } = useNotification({ mutate });

    const columns = useMemo(() => [
        {
            field: 'referenceNumber',
            headerName: 'Nomor Referensi',
            width: 300,
            
        },
        {
            field: 'company',
            headerName: 'Perusahaan',
            width: 300,
            renderCell: (params) => params.row.company.name
            
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 300,
            renderCell: (params) => {
                switch (params.row.status) {
                    case 'Selesai':
                        return <Chip color="success" variant="flat" size="sm">Selesai</Chip>; // Render a specific component or value for 'value1'
                    case 'Dibatalkan':
                        return <Chip color="danger" variant="flat" size="sm">Dibatalkan</Chip>; // Render a specific component or value for 'value2' // Render a 
                    default:
                        return <Chip color="secondary" variant="flat" size="sm">{params.row.status}</Chip>; // Default rendering for any other values
                }
            },
        },
        {
            field: 'action',
            headerName: 'Aksi',
            renderCell: (params) => (
                <div className="flex items-center gap-1">
                    <Button size='sm' color='primary' isIconOnly onClick={() => getNotificationDetailPath(params.row.id)}><EyeIcon className='size-4'/></Button>
                </div>
                
            ),
            sortable: false,
            filterable: false
        }, 
    ], [getNotificationDetailPath, onClickDelete])
    return (
        <RootAdmin>
            <Card className="w-full mt-3" radius='sm'>
                <CardHeader>
                    <p className="text-md">Daftar Notifikasi</p>
                </CardHeader>
                <Divider/>
                <CardBody className='w-full h-[530px] p-5'>
                    <div className="mb-5">
                        <Button onPress={onOpenModalForm} size="sm" color="primary" startContent={<PlusIcon className="size-4 stroke-2"/>}>Tambah</Button>
                    </div>
                    <DataGrid
                        rows={data?.data}
                        rowCount={data?.total || 0}
                        loading={isLoading}
                        columns={columns}
                        disableDensitySelector
                        initialState={{
                            pagination: {
                                paginationModel: {
                                  pageSize: 10,
                                },
                            },
                            sorting: {
                                sortModel: [{ field: 'company', sort: 'asc' }],
                            },
                            density: 'compact',
                        }}
                        slots={{
                            toolbar: GridToolbar,
                        }}
                        paginationMode="server"
                        onPaginationModelChange={(model) => {
                            setPage(model.page);
                            setPageSize(model.pageSize);
                        }}
                        pageSizeOptions={[5, 10, 15]}
                        page={page}
                        pageSize={pageSize}
                        disableRowSelectionOnClick
                    />
                </CardBody>
            </Card>

            <ModalAlert 
                isOpen={isOpenModalAlert} 
                onOpenChange={onOpenChangeModalAlert} 
                onSubmit={onSubmitDelete} 
                heading="Batalkan Notifikasi?"
                buttonSubmitText="Ya, Batalkan"
                icon="danger"
            />
            <Modal isOpen={isOpenModalForm} onOpenChange={onOpenChangeModalForm} onClose={onCloseForm} isDismissable={false} isKeyboardDismissDisabled={false}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Tambah Notifikasi</ModalHeader>
                            <ModalBody>
                                <form onSubmit={handleSubmit(onSubmitForm)}>
                                    <div className='flex flex-col gap-3 mb-6'>  
                                        <Controller
                                            name="companyId"
                                            control={control}
                                            render={({ field, fieldState }) => (
                                                <div className='flex flex-col'>
                                                    <label className='text-sm mb-1.5'>Perusahaan <span className='text-danger'>*</span></label>
                                                    <SelectSearch
                                                        value={field.value}
                                                        onChange={(selectedOption) => field.onChange(selectedOption ? selectedOption.value : '')}
                                                    /> 
                                                    {fieldState.error && <div className="text-red-500 text-xs">{fieldState.error.message}</div>}
                                                </div>   
                                            )}
                                        />   
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
    );
};
