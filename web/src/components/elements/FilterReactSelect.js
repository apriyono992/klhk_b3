import ReactSelect from 'react-select';

export default function FilterReactSelect({placeholder, options, isLoading, setValue}) {
    return (
        <div className=''>
            <ReactSelect
                options={options}
                placeholder={placeholder}
                isLoading={isLoading}
                theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                })}
                onChange={(option) => setValue(option.value)}
                styles={{
                    singleValue: (styles) => ({ ...styles, color: '#475569', fontSize: '10pt' }),
                    menu: (styles) => ({ ...styles, zIndex: 999 }),
                    control: (styles) => ({ ...styles, border: 0, borderBottom: '1px solid #e5e7eb', borderBottomWidth: 2, boxShadow: 'none', }),
                    option: (styles) => ({ ...styles, color: '#475569', fontSize: '10pt' }),
                    placeholder: (styles) => ({ ...styles, color: '#475569', fontSize: '10pt' }),
                    multiValue: (styles) => ({ ...styles, backgroundColor: '#d1d5db', borderRadius: 5 }),
                    dropdownIndicator: (styles) => ({ ...styles, color: '#00000' }),
                    indicatorSeparator: (styles) => ({ ...styles, alignSelf: 'stretch', marginBottom: 8, marginTop: 8, width: 2, backgroundColor: '#ffff' }),
                }}
            />
        </div>
    )
}
