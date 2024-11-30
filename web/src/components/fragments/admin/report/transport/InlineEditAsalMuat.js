import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import ReactSelect from 'react-select';
import { Button, Card, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from '@nextui-org/react'
import ControlledInput from '../../../../elements/ControlledInput';
import toast from 'react-hot-toast';
import { PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { dirtyInput, isResponseErrorObject } from '../../../../../services/helpers';
import useSWR from 'swr';
import { getFetcher, getSelectFetcher, postFetcher } from '../../../../../services/api';
import DataPICSelector from '../ModalDataPIC';

export default function InlineEditAsalMuat({ selectedOption, name, companyId, control, setValue }) {
    const {isOpen: isOpenModalForm, onOpen: onOpenModalForm, onOpenChange: onOpenChangeModalForm, onClose: onCloseModalForm} = useDisclosure();
    const [editId, setEditId] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedItems, setSelectedItems] = useState(null);
    const [detailSelectedItem, setDetailSelectedItem] = useState(null)
    const { 
        register: registerInline,
        control: controlInline, 
        handleSubmit: handleSubmitInline, 
        reset: resetInline, 
        watch: watchInline,
        setValue: setValueInline,
        formState: {  errors: errorsInline, isSubmitting: isSubmittingInline, dirtyFields: dirtyFieldsInline } 
    } = useForm();
    const provinceId = watchInline('provinceId')
    const regencyId = watchInline('regencyId')
    const districtId = watchInline('districtId')

    const { data: province } = useSWR('/api/location/provinces', getFetcher)
    const { data: regency } = useSWR(provinceId ? `/api/location/cities?provinceId=${provinceId}`: null, getFetcher)
    const { data: district } = useSWR(regencyId ? `/api/location/districts?regencyId=${regencyId}`: null, getFetcher)
    const { data: village } = useSWR(districtId ? `/api/location/villages?districtId=${districtId}`: null, getFetcher)
    const { data: dataAsalMuat, isLoading: isLoadingAsalMuat, mutate: mutateAsalMuat } = useSWR(companyId ? `/api/company/search-perusahaan-asal-muat?companyId=${companyId}` : null, getFetcher);

    function onClickEdit(item) {    
        setEditId(item.id);
        setIsEdit(true);
        resetInline({
            namaPerusahaan: item.namaPerusahaan,
            alamat: item.alamat,
            locationType: item.locationType,
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
            namaPerusahaan: '',
            alamat: '',
            locationType: '',
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
                // await putFetcher('/api/company/asal-muat', editId, filteredData);
                // mutate()
                toast.success('Perusahaan asal muat berhasil diubah!');
            } else {
                formData.companyId = companyId
                const response =  await postFetcher('/api/company/asal-muat', formData);
                mutateAsalMuat()
                const newItem = { value: response.id, label: response.namaPerusahaan};
                const newDetailItem = {
                    perusahaanAsalMuatId: response.id,
                    namaPerusahaan: response.namaPerusahaan,
                    locationType: response.locationType,
                    longitudeAsalMuat: response.longitude,
                    latitudeAsalMuat: response.latitude,
                }
                setSelectedItems(newItem);
                setDetailSelectedItem(newDetailItem);
                setValue(name, newDetailItem);
                toast.success('Perusahaan asal muat berhasil ditambah!');
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

    const handleSelectChange = (option) => {
        const filteredData = dataAsalMuat?.data?.filter(item => item.id === option.value);
        const item = {
            perusahaanAsalMuatId: option.value,
            namaPerusahaan: option.label,
            locationType: filteredData[0].locationType,
            longitudeAsalMuat:  filteredData[0].longitude,
            latitudeAsalMuat: filteredData[0].latitude
        }
        setDetailSelectedItem(item)
        setSelectedItems(option);
        setValue(name, item);
    };
    
    return (
        <div className='flex flex-col'>
            <div className='flex items-end gap-3'>
                <div className='flex-1'>
                    <Controller
                        name={name}
                        control={control}
                        render={({ field, fieldState }) => (
                            <div className='flex flex-col'>
                                <label className='text-sm mb-2'>Perusahaan Asal Muat <span className='text-danger'>*</span></label>
                                <ReactSelect
                                    label="Perusahaan Asal Muat"
                                    options={dataAsalMuat?.data?.map((item) => ({value: item.id, label: item.namaPerusahaan}))}
                                    isLoading={isLoadingAsalMuat}
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
                <Button onPress={onOpenModalForm} color='primary' isIconOnly><PlusIcon className='size-4'/></Button>
            </div>
            <div className="mt-6">
                <div className='grid grid-cols-2 items-end'>
                    <div className='text-sm text-gray-500 uppercase'>Nama Perusahaan:</div>
                    <div className='text-sm font-medium'>{detailSelectedItem?.namaPerusahaan}</div>
                    <div className='text-sm text-gray-500 uppercase'>Tipe Lokasi:</div>
                    <div className='text-sm font-medium'>{detailSelectedItem?.locationType}</div>
                    <div className='text-sm text-gray-500 uppercase'>Longitude:</div>
                    <div className='text-sm font-medium'>{detailSelectedItem?.longitudeAsalMuat}</div>
                    <div className='text-sm text-gray-500 uppercase'>Latitude:</div>
                    <div className='text-sm font-medium'>{detailSelectedItem?.latitudeAsalMuat}</div>
                </div>
            </div>

            <Modal size="3xl" isOpen={isOpenModalForm} onOpenChange={onOpenChangeModalForm} onClose={onCloseForm} isDismissable={false} isKeyboardDismissDisabled={false}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>{isEdit ? 'Ubah' : 'Tambah'} Perusahaan Asal Muat</ModalHeader>
                            <ModalBody>
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3 mb-6'>  
                                        <ControlledInput label="Perusahaan" name="namaPerusahaan" type="text" isRequired={true} control={controlInline} />
                                        <ControlledInput label="Alamat" name="alamat" type="text" isRequired={true} control={controlInline} />
                                        <Select
                                            {...registerInline('locationType')}
                                            radius="sm"
                                            label="Tipe"
                                            labelPlacement="outside"
                                            placeholder='Pilih...'
                                            color={errorsInline.locationType ? 'danger' : 'default'}
                                            isInvalid={errorsInline.locationType}
                                            errorMessage={errorsInline.locationType && errorsInline.locationType.message}
                                        >
                                            <SelectItem key="Gudang">Gudang</SelectItem>
                                            <SelectItem key="Pelabuhan">Pelabuhan</SelectItem>
                                        </Select>
                                        <ControlledInput label="Latitude" name="latitude" type="text" isRequired={true} control={controlInline} />
                                        <ControlledInput label="Longitude" name="longitude" type="text" isRequired={true} control={controlInline} />  
                                        <Select
                                            {...registerInline('provinceId')}
                                            radius="sm"
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
                                            radius="sm"
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
                                            radius="sm"
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
                                            radius="sm"
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
                                        <div className="col-span-2">
                                        <DataPICSelector control={controlInline} setValue={setValueInline} type={'customer'} companyIds={[companyId]} />
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