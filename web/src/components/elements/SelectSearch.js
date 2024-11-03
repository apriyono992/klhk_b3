import React, { useState } from 'react'
import { debounce } from 'lodash';
import AsyncSelect from 'react-select/async';

export default function SelectSearch({ fetcher, fieldOptionName, fieldOptionSubName, isMulti, value, onChange }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selected, setSelected] = useState(value);

    const handleChange = (selectedOptions) => {
        setSelected(selectedOptions)
        onChange(selectedOptions)
    };
    
    const fetchOptions = async (inputValue) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetcher(inputValue);
            return response.data.map((item) => ({
                value: item.id,
                label: `${item?.[fieldOptionName]} ${ fieldOptionSubName ? '- '+item?.[fieldOptionSubName] : '' }`,
            }));
        } catch (err) {
            setError('Gagal memuat data');
            return [];
        } finally {
            setLoading(false);
        }
    };

    const debouncedFetch = debounce(async (inputValue, resolve) => {
        const options = await fetchOptions(inputValue);
        resolve(options);
    }, 700);

    const loadOptions = (inputValue) => {
        return new Promise((resolve) => {
            if (inputValue.length > 2) {
                debouncedFetch(inputValue, resolve);
            } else {
                resolve([]);
            }
        });
    };

    return (
        <AsyncSelect
            loadOptions={loadOptions}
            isMulti={isMulti}
            cacheOptions
            value={selected}
            onChange={handleChange}
            isLoading={loading}
            noOptionsMessage={() => error || 'Tidak ada data'}
            placeholder="Cari berdasarkan nama"
            isClearable
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
                control: (styles) => ({ ...styles, backgroundColor: '#f4f4f5' }),
                option: (styles) => ({ ...styles, color: '#475569', fontSize: '10pt' }),
                placeholder: (styles) => ({ ...styles, color: '#475569', fontSize: '10pt' }),
                multiValue: (styles) => ({ ...styles, backgroundColor: '#d1d5db', borderRadius: 5 }),
                indicatorSeparator: (styles) => ({ ...styles, alignSelf: 'stretch', marginBottom: 8, marginTop: 8, width: 2, backgroundColor: '#e5e7eb' }),
            }}
        />
    )
}
