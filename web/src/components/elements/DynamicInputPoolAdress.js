import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Button, Divider, Input } from '@nextui-org/react';
import React from 'react';
import { Controller, useFieldArray } from 'react-hook-form';

export default function DynamicInputPoolAddress({ control, errors, fieldName, label, className }) {
    const { fields, append, remove } = useFieldArray({ control, name: fieldName, });

    return (
        <div className={className}>
            <div className='flex justify-between'>
                <label className="text-sm">{label} <span className="text-danger">*</span></label>
                <Button size="sm" isIconOnly onClick={() => append({ name: "", alamat: "", longitude: "", latitude: "" },)} color="success">
                    <PlusIcon className="size-4" />
                </Button>
            </div>
                    {fields.map((field, index) => (
                        <>
                        <div key={index} className="grid grid-cols-2 gap-3 py-3">
                            <Controller
                                name={`${fieldName}[${index}].name`}
                                control={control}
                                defaultValue={field.name}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        size="sm"
                                        placeholder='...'
                                        label="Nama Tempat"
                                        labelPlacement='outside'
                                        fullWidth
                                        isRequired
                                        color={errors?.[fieldName]?.[index]?.name ? "danger" : "default"}
                                        isInvalid={errors?.[fieldName]?.[index]?.name} 
                                    />
                                )}
                            />
                            <Controller
                                name={`${fieldName}[${index}].alamat`}
                                control={control}
                                defaultValue={field.alamat}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        size="sm"
                                        placeholder='...'
                                        label="Alamat"
                                        labelPlacement='outside'
                                        fullWidth
                                        isRequired
                                        color={errors?.[fieldName]?.[index]?.alamat ? "danger" : "default"}
                                        isInvalid={errors?.[fieldName]?.[index]?.alamat} 
                                    />
                                )}
                            />
                            <Controller
                                name={`${fieldName}[${index}].longitude`}
                                control={control}
                                defaultValue={field.longitude}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        size="sm"
                                        placeholder='...'
                                        fullWidth
                                        label="Longitude"
                                        labelPlacement='outside'
                                        isRequired
                                        color={errors?.[fieldName]?.[index]?.longitude ? "danger" : "default"}
                                        isInvalid={errors?.[fieldName]?.[index]?.longitude}
                                    />
                                )}
                            />
                            <Controller
                                name={`${fieldName}[${index}].latitude`}
                                control={control}
                                defaultValue={field.latitude}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        size="sm"
                                        placeholder='...'
                                        label="Latitude"
                                        labelPlacement='outside'
                                        fullWidth
                                        isRequired
                                        color={errors?.[fieldName]?.[index]?.latitude ? "danger" : "default"}
                                        isInvalid={errors?.[fieldName]?.[index]?.latitude} 
                                    />
                                )}
                            />
                            <Button color="danger" size="sm" isIconOnly onClick={() => remove(index)} isDisabled={fields.length === 1}><TrashIcon className="size-4"/></Button>
                        </div>
                        <Divider/>
                        </>
                    ))}
        </div>
    );
}
