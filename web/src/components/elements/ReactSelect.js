import React, { useState } from 'react'
import { debounce } from 'lodash';
import Select from 'react-select';

export default function ReactSelect({ data, isLoading, error, value, onChange, defaultValue, label, isMulti, isDisabled = false }) {
    const [selected, setSelected] = useState(value);

    const handleChange = (selectedOptions) => {
        setSelected(selectedOptions)
        onChange(selectedOptions)
    };

    return (
        <div className='flex flex-col'>
            <label className='text-sm mb-2'>{label} <span className='text-danger'>*</span></label>
            <Select
                placeholder='Cari...'
                defaultValue={defaultValue}
                options={data}
                aria-label='react-select'
                isClearable
                value={selected}
                onChange={handleChange}
                isMulti={isMulti}
                isLoading={isLoading}
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
                isDisabled={isDisabled}
            />
            {error && <p className='text-danger text-xs'>{error}</p>} 
        </div>
    )
}
