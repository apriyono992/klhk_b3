import { Button, Card, CardBody, Checkbox, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tab, Tabs, Textarea } from '@nextui-org/react';
import { useState } from 'react'
import RootAdmin from '../../../../../components/layouts/RootAdmin';
import TableHistory from '../../../../../components/fragments/admin/report/TableHistory';
import useValidateProduction from '../../../../../hooks/report/production/useValidateProduction';
import { getFetcher } from '../../../../../services/api';
import useSWR from 'swr';
import ModalCompanyNotReport from '../../../../../components/fragments/admin/report/ModalCompanyNotReport';
import CustomDataGrid from '../../../../../components/elements/CustomDataGrid';

export default function IndexPage() {
    const api = '/api/pelaporan-b3-dihasilkan';
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const { data: dataPeriod } = useSWR(`/api/period/report-active`, getFetcher);
    const { data, isLoading, mutate } = useSWR(dataPeriod ? `${api}/search?page=${page + 1}&limit=${pageSize}&periodId=${dataPeriod?.id}` : null, getFetcher);
    const { 
        modalForm: { isOpenModalForm, onOpenChangeModalForm },
        hookForm: { register, handleSubmit, formState: { errors, isSubmitting } },
        onCloseForm,
        onSubmitForm,
        columnsTableHistory,
        columnsTableActivePeriod,
        isChecked,
        setIsChecked
    } = useValidateProduction({ mutate });

    return(
        <RootAdmin>
            <Card radius='sm'>
                <CardBody>
                    <Tabs
                        color="primary"
                        variant="underlined"
                        aria-label="tabs"
                        classNames={{
                            tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                            cursor: "w-full",
                            tab: "max-w-fit px-1.5 h-12",
                            tabContent: "group-data-[selected=true]:font-semibold"
                        }}
                    >
                        <Tab key="1" title="Periode Aktif">
                            <ModalCompanyNotReport api={api} />
                            <div className='h-[500px]'>
                                <CustomDataGrid
                                    data={data?.data}
                                    rowCount={data?.total || 0}
                                    isLoading={isLoading}
                                    columns={columnsTableActivePeriod}
                                    pageSize={pageSize}
                                    setPageSize={setPageSize}
                                    page={page}
                                    setPage={setPage}
                                />
                            </div>
                        </Tab>
                        <Tab key="2" title="Riwayat">
                            <TableHistory columns={columnsTableHistory} api={`${api}/search`} />
                        </Tab>
                    </Tabs>
                </CardBody>
            </Card>

            <Modal isOpen={isOpenModalForm} onOpenChange={onOpenChangeModalForm} onClose={onCloseForm} isDismissable={false} isKeyboardDismissDisabled={false}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Validasi Laporan</ModalHeader>
                            <ModalBody>
                                <form onSubmit={handleSubmit(onSubmitForm)}>
                                    <div className='flex flex-col gap-3 mb-6'>  
                                        <Checkbox 
                                            {...register('status')}
                                            onValueChange={setIsChecked}
                                        >
                                            Disetujui
                                        </Checkbox>
                                        <Textarea
                                            {...register('adminNote')}
                                            variant="faded" 
                                            type="text" 
                                            isRequired={isChecked ? false : true}
                                            isDisabled={isChecked ? true : false}
                                            label="Catatan" 
                                            color={errors.adminNote ? 'danger' : 'default'}
                                            isInvalid={errors.adminNote} 
                                            errorMessage={errors.adminNote && errors.adminNote.message}
                                        />
                                    </div>
                                    <div className='flex items-center gap-1'>
                                        <Button isLoading={isSubmitting} isDisabled={isSubmitting} type='submit' color='primary'>Simpan</Button>
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
