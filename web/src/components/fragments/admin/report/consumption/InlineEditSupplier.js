import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import ReactSelect from 'react-select';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, TableCell, TableRow, useDisclosure } from '@nextui-org/react'
import ControlledInput from '../../../../elements/ControlledInput';
import toast from 'react-hot-toast';
import { PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { dirtyInput, isResponseErrorObject } from '../../../../../services/helpers';
import useSWR from 'swr';
import { getFetcher, postFetcher } from '../../../../../services/api';
import ClientTablePagination from '../../../../elements/ClientTablePagination';
import ControlledReactSelect from '../../../../elements/ControlledReactSelect';
import { yupResolver } from '@hookform/resolvers/yup';
import { supplierValidation } from '../../../../../services/validation';
import DataPICSelector from '../ModalDataPIC';

export default function InlineEditSupplier({ selectedOption, companyId, control, setValue }) {
    const {isOpen: isOpenModalForm, onOpen: onOpenModalForm, onOpenChange: onOpenChangeModalForm, onClose: onCloseModalForm} = useDisclosure();
    const [editId, setEditId] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [detailSelectedItem, setDetailSelectedItem] = useState([])
    const header = ['Nama Supplier', 'Alamat', 'Email', 'Actions'];
    const content = (item) => (
        <TableRow key={item.id}>
            <TableCell>{item.namaSupplier}</TableCell>
            <TableCell>{item.alamat}</TableCell>
            <TableCell>{item.email}</TableCell>
            <TableCell className="flex items-center gap-1">
                <Button size="sm" onPress={() => onClickEdit(item)} color="warning" isIconOnly><PencilSquareIcon className="size-4" /></Button>
                <Button size="sm" onPress={() => handleDeleteItem(item.id)} color="danger" isIconOnly><TrashIcon className="size-4" /></Button>
            </TableCell>
        </TableRow>
    )
    const { 
        register: registerInline,
        control: controlInline, 
        handleSubmit: handleSubmitInline, 
        reset: resetInline, 
        watch: watchInline,
        setValue: setValueInline,
        formState: {  errors: errorsInline, isSubmitting: isSubmittingInline, dirtyFields: dirtyFieldsInline } 
    } = useForm({ resolver: yupResolver(supplierValidation) });
    const provinceId = watchInline('provinceId')
    const regencyId = watchInline('regencyId')
    const districtId = watchInline('districtId')

    const { data: province, mutate: mutateProvince } = useSWR('/api/location/provinces', getFetcher)
    const { data: regency, mutate: mutateRegency } = useSWR(provinceId ? `/api/location/cities?provinceId=${provinceId}`: null, getFetcher)
    const { data: district, mutate: mutateDistrict } = useSWR(regencyId ? `/api/location/districts?regencyId=${regencyId}`: null, getFetcher)
    const { data: village, mutate: mutateVillage } = useSWR(districtId ? `/api/location/villages?districtId=${districtId}`: null, getFetcher)
    const { data: dataSupplier, isLoading: isLoadingSupplier, mutate: mutateSupplier } = useSWR(companyId ? `/api/company/data-suppliers/${companyId}` : null, getFetcher);
    

    async function onClickEdit(item) {    
        setEditId(item.id);
        setIsEdit(true);
        resetInline({
            namaSupplier: item.namaSupplier,
            alamat: item.alamat,
            email: item.email,
            telepon: item.telepon,
            fax: item.fax,
            latitude: item.latitude,
            longitude: item.longitude,
            provinceId: item.provinceId,
            regencyId: item.regencyId,
            districtId: item.districtId,
            villageId: item.villageId, 
        });           
        onOpenChangeModalForm();
    }

    function onCloseForm() {
        setEditId(null);
        setIsEdit(false);
        resetInline({
            namaSupplier: '',
            alamat: '',
            email: '',
            telepon: '',
            fax: '',
            latitude: '',
            longitude: '',
            provinceId: '',
            regencyId: '',
            districtId: '',
            villageId: '',
        });
        onCloseModalForm()
    }

    async function onSubmitForm(formData) {
        try {
            if (isEdit) {
                const filteredData = dirtyInput(dirtyFieldsInline, formData);
                console.log(filteredData);
                toast.success('Perusahaan supplier berhasil diubah!');
            } else {
                const payload = {
                    namaSupplier: formData.namaSupplier,
                    alamat: formData.alamat,
                    email: formData.email,
                    fax: formData.fax,
                    longitude: formData.longitude,
                    latitude: formData.latitude,
                    provinceId: formData.provinceId?.toString(),
                    regencyId: formData.regencyId?.toString(), 
                    districtId: formData.districtId?.toString(),
                    villageId: formData.villageId?.toString(),
                    telepon: formData.telepon,
                    dataPICIds: formData.dataPICIds,
                }
                
                const response =  await postFetcher(`/api/company/data-supplier/${companyId}`, payload);
                mutateSupplier()
                const newItem = {value: response.id, label: response.namaSupplier,};
                setSelectedItems(prevItems => [...prevItems, newItem]);
                setDetailSelectedItem()
                setValue("dataSuppliers", [...selectedItems, newItem].map(item => item.value));
                toast.success('Perusahaan supplier berhasil ditambah!');
            }
            onCloseForm();
        } catch (error) {
            isResponseErrorObject(error.response.data.message)
                ? Object.entries(error.response.data.message).forEach(([key, value]) => {
                    toast.error(value);
                })
                : toast.error(error.response.data.message)
        }
    }
    

    const handleDeleteItem = (id) => {
        const updatedItems = selectedItems.filter((item) => item.value !== id);
        const updatedDetail = detailSelectedItem.filter((item) => updatedItems.some((uItem) => uItem.value === item.id));
        setDetailSelectedItem(updatedDetail);
        setSelectedItems(updatedItems);
        setValue("dataSuppliers", updatedItems.map((item) => item.value));
    };

    const handleSelectChange = (options) => {
        const opt = options.map(item => item.value)
        const filteredData = dataSupplier?.filter(item => opt.includes(item.id));
        setDetailSelectedItem(filteredData)
        setSelectedItems(options || []);
        setValue("dataSuppliers", opt);
    };
    console.log(detailSelectedItem )
    return (
        <div className='flex flex-col'>
            <div className='flex items-end gap-3'>
                <div className='flex-1'>
                    <Controller
                        name="dataSuppliers"
                        control={control}
                        render={({ field, fieldState }) => (
                            <div className='flex flex-col'>
                                <label className='text-sm mb-2'>Perusahaan Supplier <span className='text-danger'>*</span></label>
                                <ReactSelect
                                    isMulti
                                    options={dataSupplier?.map((item) => ({value: item.id, label: item.namaSupplier}))}
                                    isLoading={isLoadingSupplier}
                                    value={selectedItems}
                                    onChange={handleSelectChange}
                                    theme={(theme) => ({
                                        ...theme,
                                        borderRadius: 10,
                                        borderWidth: 4,
                                        colors: {
                                            ...theme.colors,
                                            primary25: '#f4f4f5',
                                        },
                                    })}
                                    styles={{
                                        menu: (styles) => ({ ...styles, zIndex: 999 }),
                                        control: (styles) => ({ ...styles, backgroundColor: '#f4f4f5' }),
                                        option: (styles) => ({ ...styles, color: '#475569', fontSize: '10pt' }),
                                        placeholder: (styles) => ({ ...styles, color: '#475569', fontSize: '10pt' }),
                                        multiValue: (styles) => ({ ...styles, backgroundColor: '#d1d5db', borderRadius: 5 }),
                                        indicatorSeparator: (styles) => ({ ...styles, alignSelf: 'stretch', marginBottom: 8, marginTop: 8, width: 2, backgroundColor: '#e5e7eb' }),
                                    }}
                                />
                                {fieldState.error && <span className='text-xs text-danger'>{fieldState.error.message}</span>}
                            </div>
                        )}
                    />
                </div>
                <Button onPress={onOpenModalForm} color='primary' startContent={<PlusIcon className='size-4'/>}>Tambah Perusahaan Supplier</Button>
            </div>
            <div className="mt-4">
                <ClientTablePagination header={header} data={detailSelectedItem} content={content} />
            </div>

            <Modal scrollBehavior='inside' size="3xl" isOpen={isOpenModalForm} onOpenChange={onOpenChangeModalForm} onClose={onCloseForm} isDismissable={false} isKeyboardDismissDisabled={false}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>{isEdit ? 'Ubah' : 'Tambah'} Perusahaan Supplier</ModalHeader>
                            <ModalBody>
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3 mb-6'>  
                                        <ControlledInput label="Supplier" name="namaSupplier" type="text" isRequired={true} control={controlInline} />
                                        <ControlledInput label="Alamat" name="alamat" type="text" isRequired={true} control={controlInline} />
                                        <ControlledInput label="Email" name="email" type="text" isRequired={true} control={controlInline} />
                                        <ControlledInput label="Telepon" name="telepon" type="text" isRequired={true} control={controlInline} />
                                        <ControlledInput label="Fax" name="fax" type="text" isRequired={true} control={controlInline} />
                                        <ControlledInput label="Latitude" name="latitude" type="text" isRequired={true} control={controlInline} />
                                        <ControlledInput label="Longitude" name="longitude" type="text" isRequired={true} control={controlInline} />  
                                        <Select
                                            {...registerInline('provinceId')}
                                            isRequired
                                            variant='faded'
                                            label="Provinsi"
                                            labelPlacement="outside"
                                            placeholder='Pilih...'
                                            onChange={(e) => setValueInline('provinceId', e.target.value)}
                                            color={errorsInline.provinceId ? 'danger' : 'default'}
                                            isInvalid={errorsInline.provinceId}
                                            errorMessage={errorsInline.provinceId && errorsInline.provinceId.message}
                                        >
                                            {province?.map(item => (
                                                <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                                            ))}
                                        </Select>                    
                                        <Select
                                            {...registerInline('regencyId')}
                                            isRequired
                                            variant='faded'
                                            label="Kabupaten"
                                            labelPlacement="outside"
                                            placeholder='Pilih...'
                                            onChange={(e) => setValueInline('regencyId', e.target.value)}
                                            color={errorsInline.regencyId ? 'danger' : 'default'}
                                            isInvalid={errorsInline.regencyId}
                                            errorMessage={errorsInline.regencyId && errorsInline.regencyId.message}
                                        >
                                            {regency?.map(item => (
                                                <SelectItem key={item.id}>{item.name}</SelectItem>
                                            ))}
                                        </Select>                    
                                        <Select
                                            {...registerInline('districtId')}
                                            isRequired
                                            variant='faded'
                                            label="Kecamatan"
                                            labelPlacement="outside"
                                            placeholder='Pilih...'
                                            onChange={(e) => setValueInline('districtId', e.target.value)}
                                            color={errorsInline.districtId ? 'danger' : 'default'}
                                            isInvalid={errorsInline.districtId}
                                            errorMessage={errorsInline.districtId && errorsInline.districtId.message}
                                        >
                                            {district?.map(item => (
                                                <SelectItem key={item.id}>{item.name}</SelectItem>
                                            ))}
                                        </Select>                    
                                        <Select
                                            {...registerInline('villageId')}
                                            isRequired
                                            variant='faded'
                                            label="Kelurahan"
                                            labelPlacement="outside"
                                            placeholder='Pilih...'
                                            color={errorsInline.villageId ? 'danger' : 'default'}
                                            isInvalid={errorsInline.villageId}
                                            errorMessage={errorsInline.villageId && errorsInline.villageId.message}
                                        >
                                            {village?.map(item => (
                                                <SelectItem key={item.id}>{item.name}</SelectItem>
                                            ))}
                                        </Select>      
                                        {/* Tambahkan DataPICSelector */}
                                        <div className="col-span-2">
                                        <DataPICSelector control={controlInline} setValue={setValueInline} type={'supplier'} companyIds={[companyId]} />
                                        </div>               
                                    </div>
                                    <div className='flex items-center gap-1'>
                                        <Button onPress={handleSubmitInline(onSubmitForm)} isLoading={isSubmittingInline} isDisabled={isSubmittingInline || (isEdit && Object.keys(dirtyFieldsInline).length === 0)} type='submit' color='primary'>{isEdit ? 'Simpan' : 'Tambah'}</Button>
                                        <Button isDisabled={isSubmittingInline} color='danger' variant='faded' onPress={onClose}>Batal</Button>
                                    </div>
                            </ModalBody>
                            <ModalFooter>

                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}
