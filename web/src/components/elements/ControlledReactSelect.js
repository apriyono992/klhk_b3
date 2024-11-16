import React, { useState } from 'react'
import { Controller } from 'react-hook-form';
import Select from 'react-select';

export default function ControlledReactSelect({ options, isLoading, control, name, label, isMulti }) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => {            
                const selectedValue = isMulti
                                        ? options?.filter((option) => field.value?.includes(option.value))
                                        : options?.find((option) => option.value === field.value);
                return (
                    <div className='flex flex-col'>
                        <label className='text-sm mb-2'>{label} <span className='text-danger'>*</span></label>
                        <Select
                            {...field}
                            placeholder='Cari...'
                            options={options}
                            aria-label='react-select'
                            isMulti={isMulti}
                            isClearable
                            isLoading={isLoading}
                            value={selectedValue}
                            onChange={(option) => {
                                const value = isMulti ? option.map((item) => item.value) : option?.value;
                                field.onChange(value);
                            }}
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
                        {fieldState.error && <p className='text-danger text-xs'>{fieldState.error.message}</p>} 
                    </div>
                )
            }}
        /> 
    )
}