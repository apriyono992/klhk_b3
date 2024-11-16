import { Button, Card, CardBody, CardHeader, Chip, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, TableCell, TableRow, Textarea } from "@nextui-org/react";
import { EyeIcon, PencilSquareIcon, PlusIcon } from "@heroicons/react/24/outline";
import useSWR from "swr";
import React, { useEffect } from "react";
import ReactSelect from "../../../../../components/elements/ReactSelect";
import ControlledReactSelect from "../../../../../components/elements/ControlledReactSelect";
import ControlledInput from "../../../../../components/elements/ControlledInput";
import { getFetcher, getSelectFetcher } from "../../../../../services/api";
import RootAdmin from "../../../../../components/layouts/RootAdmin";
import useCustomNavigate from "../../../../../hooks/useCustomNavigate";
import useCreateStorage from "../../../../../hooks/report/storage/useCreateStorage";
import ClientTablePagination from "../../../../../components/elements/ClientTablePagination";

export default function IndexPage() {
    // State untuk menyimpan pilihan perusahaan
    const [tempCompanyId, setTempCompanyId] = React.useState(null);
    const [selectedCompanyId, setSelectedCompanyId] = React.useState(null);
    // Endpoint dinamis berdasarkan pilihan perusahaan
    const endpoint = selectedCompanyId
    ? `/api/penyimpananB3/company/${selectedCompanyId}`
    : null;
    // const { data, isLoading, mutate } = useSWR('/api/penyimpananB3/company/14997adf-dcdf-40c6-b67b-60b2aeec3c13', getFetcher);
    const { data: dataCompany, isLoading: isLoadingCompany } = useSWR(`/api/company?limit=100`, getSelectFetcher);
    const {getCompanyStorageDetailPath}  = useCustomNavigate()

    // Fetch data penyimpanan B3 menggunakan endpoint dinamis
    const { data, isLoading, mutate } = useSWR(endpoint, getFetcher, {
        revalidateIfStale: true,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });

    useEffect(() => {
        // Ambil nilai dari sessionStorage saat komponen pertama kali dimuat
        const savedCompanyId = sessionStorage.getItem("selectedCompanyId");
        if (savedCompanyId) {
            setSelectedCompanyId(savedCompanyId);
        }
    }, []);

    // Fungsi untuk memetakan data perusahaan menjadi opsi select
    function mapCompanyOptions(data) {
        return data?.map(company => ({
            value: company.id,
            label: company.name,
        })) || [];
    }
    
    const { 
        isEdit,
        onClickEdit, 
        onCloseForm,
        onSubmitForm, 
        modalForm: { onOpenModalForm, isOpenModalForm, onOpenChangeModalForm },
        hookForm: { register, handleSubmit, control, formState: { errors, isSubmitting, dirtyFields } }, 
    } = useCreateStorage({ mutate });

    const header = [
        'Perusahaan',
        'Alamat Gudang',
        'Lat - Long',
        'Luas Area',
        'Status',
        'Aksi'
    ]

    const handleCompanyChange = (selected) => {
        console.log(selected);
        const companyId = selected?.value || null;
        setSelectedCompanyId(companyId);
    
        // Simpan companyId ke sessionStorage
        if (companyId) {
            sessionStorage.setItem("selectedCompanyId", companyId);
            mutate(`/api/penyimpananB3/company/${companyId}`);
        } else {
            // Hapus dari sessionStorage jika tidak ada perusahaan yang dipilih
            sessionStorage.removeItem("selectedCompanyId");
        }
    };
    

    // Opsi perusahaan untuk select
    const companyOptions = mapCompanyOptions(dataCompany);


    const content = (item) => (
        <TableRow key={item.id}>
            <TableCell>{item.companyId}</TableCell>
            <TableCell>{item.alamatGudang}</TableCell>
            <TableCell>{`${item.latitude} - ${item.longitude}`}</TableCell>
            <TableCell>{item.luasArea} M2</TableCell>
            <TableCell>
                <Chip
                    color={
                        item.status === 'Rejected'
                            ? 'danger'
                            : item.status === 'Pending'
                            ? 'warning'
                            : item.status === 'Menunggu Verifikasi'
                            ? 'primary'
                            : item.status === 'Review by Admin'
                            ? 'secondary'
                            : item.status === 'Approved'
                            ? 'success'
                            : item.status === 'Delete'
                            ? 'default'
                            : 'default'
                    }
                    variant="flat"
                    size="sm"
                >
                    {item.status}
                </Chip>
            </TableCell>
            <TableCell>
                <div className="flex gap-1">
                    <Button isIconOnly color="primary" size="sm" onPress={() => getCompanyStorageDetailPath(item.id)}><EyeIcon className="size-4"/></Button>
                    <Button isIconOnly size="sm" onPress={() => onClickEdit(item)} color="warning"><PencilSquareIcon className='size-4'/></Button>
                </div>
            </TableCell>
        </TableRow>
    )


    return(
        <RootAdmin>
            <Card className="w-full mt-3" radius="sm">
                <CardHeader>
                    <p className="text-md">Daftar Penyimpanan / Gudang B3</p>
                </CardHeader>
                <Divider />
                <CardBody>
                    <div className="mb-5 flex items-center gap-4">
                        <div style={{ width: '300px', maxWidth: '100%' }}>
                            <ReactSelect
                                label="Pilih Perusahaan"
                                name="companyId"
                                control={control}
                                data={dataCompany}
                                value={companyOptions.find(option => option.value === selectedCompanyId) || null}
                                isLoading={isLoadingCompany}
                                placeholder="Cari Perusahaan"
                                isClearable
                                onChange={handleCompanyChange}
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis',
                                        overflow: 'hidden',
                                    }),
                                }}
                            />
                        </div>
                        <div className="flex-grow"></div>
                            <Button
                                onPress={onOpenModalForm}
                                size="sm"
                                color="primary"
                                startContent={<PlusIcon className="size-4 stroke-2" />}
                            >
                                Tambah
                            </Button>
                        </div>
                    <ClientTablePagination
                        data={data?.penyimpananB3}
                        isLoading={isLoading}
                        header={header}
                        content={content}
                    />
                </CardBody>
            </Card>

            <Modal size="3xl" isOpen={isOpenModalForm} onOpenChange={onOpenChangeModalForm} onClose={onCloseForm} isDismissable={false} isKeyboardDismissDisabled={false}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>{isEdit ? 'Ubah' : 'Tambah'} Penyimpanan / Gudang B3</ModalHeader>
                            <ModalBody>
                                <form onSubmit={handleSubmit(onSubmitForm)}>
                                    <div className='grid grid-cols-1 md:grid-cols-3 gap-3 mb-6'>
                                        <div className="col-span-3">
                                            <ControlledReactSelect 
                                                label="Perusahaan" 
                                                name="companyId" 
                                                control={control} 
                                                options={dataCompany}
                                                isLoading={isLoadingCompany}
                                            /> 
                                        </div>
                                        <Textarea
                                            {...register('alamatGudang')}
                                            isRequired
                                            variant="faded" 
                                            type="text" 
                                            label="Alamat" 
                                            labelPlacement="outside"
                                            color={errors.alamatGudang ? 'danger' : 'default'}
                                            isInvalid={errors.alamatGudang} 
                                            errorMessage={errors.alamatGudang && errors.alamatGudang.message}
                                            className="col-span-3"
                                        />  
                                        <ControlledInput label="Longitude" name="longitude" type="number" isRequired={true} control={control} />
                                        <ControlledInput label="Latitude" name="latitude" type="number" isRequired={true} control={control} />
                                        <ControlledInput label="Luas Area (M2)" name="luasArea" type="number" isRequired={true} control={control} />
                                    </div>
                                    <div className='flex items-center gap-1'>
                                        <Button isLoading={isSubmitting} isDisabled={isSubmitting || (isEdit && Object.keys(dirtyFields).length === 0)} type='submit' color='primary'>{isEdit ? 'Simpan' : 'Tambah'}</Button>
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
