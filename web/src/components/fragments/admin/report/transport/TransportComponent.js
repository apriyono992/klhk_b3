import { Button, Card, CardBody, CardFooter } from '@nextui-org/react'
import React from 'react'
import InlineEditAsalMuat from './InlineEditAsalMuat'
import InlineEditTujuanBongkar from './InlineEditTujuanBongkar'
import { useFieldArray } from 'react-hook-form';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function TransportComponent({ companyId, control, setValue }) {
    const { fields, append, remove } = useFieldArray({ control, name: 'perusahaanAsalMuatDanTujuanBongkar', });
    return (
        <>
            <div className='flex justify-between'>
                <Button 
                    onClick={() => append({ perusahaanAsalMuat: {}, perusahaanTujuanBongkar: {} },)} 
                    color="success"
                    startContent={<PlusIcon className="size-4" />}
                >
                    Tambah Asal Muat dan Tujuan Bongkar
                </Button>
            </div>
            {fields.map((field, index) => (
                <div key={index} className='grid grid-cols-1 md:grid-cols-3 gap-3 mt-3'>
                    <Card radius='sm' className='col-span-1'>
                        <CardBody>
                            <InlineEditAsalMuat 
                                name={`perusahaanAsalMuatDanTujuanBongkar[${index}].perusahaanAsalMuat`} 
                                companyId={companyId} 
                                control={control} 
                                setValue={setValue} 
                            />
                        </CardBody>
                        <CardFooter>
                            <Button color="danger" size="sm" isIconOnly onClick={() => remove(index)} isDisabled={fields.length === 1}><TrashIcon className="size-4"/></Button>
                        </CardFooter>
                    </Card>
                    <Card radius='sm' className='col-span-2'>
                        <CardBody>
                            <InlineEditTujuanBongkar 
                                name={`perusahaanAsalMuatDanTujuanBongkar[${index}].perusahaanTujuanBongkar`}
                                companyId={companyId} 
                                control={control} 
                                setValue={setValue} 
                            />
                        </CardBody>
                    </Card>
                
                </div>
            ))}
        </>
    )
}
