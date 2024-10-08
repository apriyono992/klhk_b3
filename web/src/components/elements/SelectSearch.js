import React from 'react'
import Select from 'react-select'

export default function SelectSearch() {
  const options = [
    { value: '1', label: 'Orang 1' },
    { value: '2', label: 'Orang 2' },
    { value: '3', label: 'Orang 3' },
    { value: '4', label: 'Orang 4' },
    { value: '5', label: 'Orang 5' },
    { value: '6', label: 'Orang 6' },
]

    return (
        <Select 
            className="z-30 mt-1"
            isMulti
            placeholder="Cari" 
            options={options}
            theme={(theme) => ({
                ...theme,
                borderRadius: 7,
                colors: 'transparent'
            })}
            styles={{
                placeholder: (styles) => ({ ...styles, color: '#475569', fontSize: '10pt' }),
                indicatorsContainer: (styles) => ({ ...styles, backgroundColor: '#f9fafb' }),
                control: (styles) => ({ ...styles, backgroundColor: '#f9fafb' }),
                menu: (styles) => ({ ...styles, backgroundColor: 'white' }),
                multiValue: (styles) => ({ ...styles, backgroundColor: '#d1d5db', borderRadius: 5, paddingTop: 0.5 }),
                indicatorSeparator: (styles) => ({ ...styles, alignSelf: 'stretch', marginBottom: 8, marginTop: 8, width: 1, backgroundColor: '#d1d5db' }),
            }} 
        />   
    )
}
