import RootAdmin from '../../../components/layouts/RootAdmin';
import { Button, Card, CardBody, CardHeader, Chip, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import { EyeIcon, PlusIcon } from '@heroicons/react/24/outline';
import { getFetcher, getSelectCountryFetcher, getSelectFetcher, getSelectFetcherJenisB3 } from '../../../services/api';
import useSWR from 'swr';
import useCustomNavigate from '../../../hooks/useCustomNavigate';
import { useMemo, useState } from 'react';
import useNotification from '../../../hooks/notification/useNotification';
import { Controller } from 'react-hook-form';
import ReactSelect from '../../../components/elements/ReactSelect';
import CustomDataGrid from '../../../components/elements/CustomDataGrid';
import {calculateNoticationProcessingDays} from '../../../services/helpers';
import { getCountryName } from '../../../services/helpers'

export default function IndexPage() {    
    const { getNotificationDetailPath } = useCustomNavigate();
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const { data, isLoading, mutate } = useSWR(`/api/notifikasi?page=${page + 1}&limit=${pageSize}`, getFetcher);
    const { data: dataCompany, isLoading: isLoadingCompany, } = useSWR(`/api/company/search-company`, getSelectFetcher);
    const { data: dataBahan, isLoading: isLoadingBahan, } = useSWR(`/api/data-master/bahan-b3`, getSelectFetcherJenisB3);
    const { data: dataCountry, isLoading: isLoadingCountry, } = useSWR(`/api/countries`, getSelectCountryFetcher);

    const { 
        onCloseForm,
        onSubmitForm,
        modalForm: { onOpenModalForm, isOpenModalForm, onOpenChangeModalForm },
        hookForm: { register, control, handleSubmit, formState: { errors, isSubmitting } }, 
    } = useNotification({ mutate });

    const columns = useMemo(() => [
        {
            field: 'referenceNumber',
            headerName: 'Nomor Referensi',
        },
        {
            field: 'dataBahanB3NamaBahan',
            headerName: 'Nama Bahan Kimia',
            valueGetter: (value, row) => row.dataBahanB3.namaBahanKimia,
        },
        {
            field: 'dataBahanB3NamaDagang',
            headerName: 'Nama Dagang',
            valueGetter: (value, row) => row.dataBahanB3.namaDagang,
        },
        {
            field: 'negaraAsal',
            headerName: 'Eksportir/Negara Asal',
            valueGetter: (value, row) => getCountryName(row.negaraAsal, "en", {select: "official"}) // console.log(row.negaraAsal),          
        },
        {
            field: 'companyName',
            headerName: 'Importir',
            valueGetter: (value, row) => row.company.name,
            
        },
        {
            field: 'statusHistoryNotes',
            headerName: 'Riwayat Surat',
            valueGetter: (value, row) => row.draftSuratNotifikasiId.map((item) => item.nomorSurat).join(', '),  
        },

        {
            field: 'lamaProses',
            headerName: 'Lama Proses',
            renderCell: (params) => {
              const lamaProses = calculateNoticationProcessingDays(params.row.statusHistory);
          
              // Gunakan if-else untuk perbandingan logika
              if (lamaProses < 45) {
                return (
                  <Chip color="success" variant="flat" size="sm">
                    {lamaProses} Hari
                  </Chip>
                );
              } else {
                return (
                  <Chip color="danger" variant="flat" size="sm">
                    {lamaProses} Hari
                  </Chip>
                );
              }
            },
          },
          
        {
            field: 'status',
            headerName: 'Status',
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
            renderCell: (params) => {
                return (
                    <div className="flex items-center gap-1">
                        <Button size='sm' color='primary' isIconOnly onClick={() => getNotificationDetailPath(params.row.id)}><EyeIcon className='size-4'/></Button>
                    </div>    
                )},
            sortable: false,
            filterable: false
        }, 
    ], [getNotificationDetailPath])

    // const columns = useMemo(
    //     () => [
    //         {
    //             field: 'referenceNumber',
    //             headerName: 'Nomor Referensi',
    //         },
    //         {
    //             field: 'dataBahanB3NamaBahan',
    //             headerName: 'Nama Bahan Kimia',
    //             valueGetter: (value, row) => row.dataBahanB3.namaBahanKimia,
    //         },
    //         {
    //             field: 'dataBahanB3NamaDagang',
    //             headerName: 'Nama Dagang',
    //             valueGetter: (value, row) => row.dataBahanB3.namaDagang,
    //         },
    //         {
    //             field: 'negaraAsal',
    //             headerName: 'Eksportir/Negara Asal',
    //         },
    //         {
    //             field: 'companyName',
    //             headerName: 'Importir',
    //             valueGetter: (value, row) => row.company.name,
    //         },
    //         {
    //             field: 'statusHistoryNotes',
    //             headerName: 'Riwayat Surat',
    //             valueGetter: (value, row) => row.draftSuratNotifikasiId.map((item) => item.nomorSurat).join(', '),
    //         },
    //         {
    //             field: 'status',
    //             headerName: 'Status',
    //             renderCell: (params) => {
    //                 switch (params.row.status) {
    //                     case 'Selesai':
    //                         return (
    //                             <Chip color="success" variant="flat" size="sm">
    //                                 Selesai
    //                             </Chip>
    //                         ) // Render a specific component or value for 'value1'
    //                     case 'Dibatalkan':
    //                         return (
    //                             <Chip color="danger" variant="flat" size="sm">
    //                                 Dibatalkan
    //                             </Chip>
    //                         ) // Render a specific component or value for 'value2' // Render a
    //                     default:
    //                         return (
    //                             <Chip color="secondary" variant="flat" size="sm">
    //                                 {params.row.status}
    //                             </Chip>
    //                         ) // Default rendering for any other values
    //                 }
    //             },
    //         },
    //         {
    //             field: 'action',
    //             headerName: 'Aksi',
    //             renderCell: (params) => (
    //                 <div className="flex items-center gap-1">
    //                     <Button
    //                         size="sm"
    //                         color="primary"
    //                         isIconOnly
    //                         onClick={() => getNotificationDetailPath(params.row.id)}
    //                     >
    //                         <EyeIcon className="size-4" />
    //                     </Button>
    //                 </div>
    //             ),
    //             sortable: false,
    //             filterable: false,
    //         },
    //     ],
    //     [getNotificationDetailPath]
    // )

    return (
        <RootAdmin>
            <Card className="w-full mt-3" radius="sm">
                <CardHeader>
                    <p className="text-md">Daftar Notifikasi</p>
                </CardHeader>
                <Divider />
                <CardBody className="w-full h-[530px] p-5">
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
                                    dataBahanB3NamaBahan: false,
                                    dataBahanB3NamaDagang: false,
                                    statusHistoryNotes: false,
                                },
                            },
                        }}
                    />
                </CardBody>
            </Card>

            <Modal scrollBehavior='inside' isOpen={isOpenModalForm} onOpenChange={onOpenChangeModalForm} onClose={onCloseForm} isDismissable={false} isKeyboardDismissDisabled={false} style={{
    overflow: 'visible', // Pastikan modal tidak membatasi dropdown
  }}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Tambah Notifikasi</ModalHeader>
                            <ModalBody>
                                <form onSubmit={handleSubmit(onSubmitForm)}>
                                    <div className="flex flex-col gap-2 mb-6">
                                    <Input
                                            {...register('referenceNumber')}
                                            isRequired
                                            variant="faded"
                                            type="text"
                                            labelPlacement="outside"
                                            placeholder="..."
                                            label="Nomor Referensi"
                                            color={errors.referenceNumber ? 'danger' : 'default'}
                                            isInvalid={errors.referenceNumber}
                                            errorMessage={errors.referenceNumber && errors.referenceNumber.message}
                                        />
                                        <Input
                                            {...register('tanggalDiterima')}
                                            isRequired
                                            variant="faded"
                                            type="date"
                                            labelPlacement="outside"
                                            placeholder="..."
                                            label="Tanggal Email masuk"
                                            color={errors.tanggalDiterima ? 'danger' : 'default'}
                                            isInvalid={errors.tanggalDiterima}
                                            errorMessage={errors.tanggalDiterima && errors.tanggalDiterima.message}
                                        />
                                        <Controller
                                            name="databahanb3Id"
                                            control={control}
                                            render={({ field, fieldState }) => (
                                                <div className="flex flex-col">
                                                    <ReactSelect
                                                        label="Cas Number - Nama Bahan Kimia"
                                                        data={dataBahan}
                                                        isLoading={isLoadingBahan}
                                                        value={field.value}
                                                        onChange={(selectedOption) =>
                                                            field.onChange(selectedOption ? selectedOption.value : '')
                                                        }
                                                        error={fieldState.error && fieldState.error.message}
                                                    />
                                                </div>
                                            )}
                                        />
                                        <Controller
                                            name="companyId"
                                            control={control}
                                            render={({ field, fieldState }) => (
                                                <div className="flex flex-col">
                                                    <ReactSelect
                                                        label="Perusahaan"
                                                        data={dataCompany}
                                                        isLoading={isLoadingCompany}
                                                        value={field.value}
                                                        onChange={(selectedOption) =>
                                                            field.onChange(selectedOption ? selectedOption.value : '')
                                                        }
                                                        error={fieldState.error && fieldState.error.message}
                                                    />
                                                </div>
                                            )}
                                        /> 
                                        <Controller
                                            name="negaraAsal"
                                            control={control}
                                            render={({ field, fieldState }) => (
                                                <div className='flex flex-col'>
                                                    <ReactSelect
                                                        label="Negara Asal"
                                                        menuPortalTarget={document.body} // Dropdown muncul di root body
                                                        styles={{
                                                            menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Pastikan z-index tinggi
                                                            menu: (base) => ({
                                                                ...base,
                                                                zIndex: 9999,
                                                                position: 'absolute', // Tetapkan posisi absolute
                                                            }),
                                                        }}
                                                        data={dataCountry}
                                                        isLoading={isLoadingCountry}
                                                        value={field.value}
                                                        onChange={(selectedOption) => field.onChange(selectedOption ? selectedOption.value : '')}
                                                        error={fieldState.error && fieldState.error.message}
                                                    />
                                                </div>   
                                            )}
                                        />      
                                    </div>
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
                            <ModalFooter></ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </RootAdmin>
    );
};
