import React, { useState, useEffect } from 'react';
import { Autocomplete, Checkbox, TextField, ListItem } from '@mui/material';
import { GridFilterOperator } from '@mui/x-data-grid';

export const CustomFilterInput = ({ item, applyValue, options }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  // Mengatur nilai awal dari item.value jika sudah ada pilihan sebelumnya
  useEffect(() => {
    if (item.value && item.value.length > 0) {
      const initialSelected = options.filter((option) =>
        item.value.includes(option.label)
      );
      setSelectedOptions(initialSelected);
    }
  }, [item.value, options]);

  const handleChange = (event, newValue) => {
    setSelectedOptions(newValue);
    applyValue({ ...item, value: newValue.map((option) => option.label) });
  };

  return (
    <Autocomplete
      multiple
      options={options}
      value={selectedOptions}
      getOptionLabel={(option) => option.label}
      onChange={handleChange}
      disableCloseOnSelect
      renderOption={(props, option, { selected }) => {
        const { key, ...restProps } = props;
        return (
          <ListItem
            key={key}
            {...restProps}
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              backgroundColor: selected ? '#e0e0e0' : 'transparent',
              fontSize: '0.75rem',
              color: '#757575',
            }}
          >
            <Checkbox
              checked={selected}
              size="small"
              style={{ color: '#757575', marginRight: 8 }}
            />
            <span style={{ fontWeight: selected ? 'bold' : 'normal' }}>
              {option.label}
            </span>
          </ListItem>
        );
      }}
      renderTags={() => null}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Select Departments"
          variant="outlined"
          placeholder="Choose options"
          size="small"
        />
      )}
      ListboxProps={{
        style: {
          maxHeight: 200,
          overflow: 'auto',
          padding: '4px',
        },
      }}
    />
  );
};

export const createMultiSelectFilterOperator = (options) => ({
  label: 'Multi-Select',
  value: 'multiSelect',
  getApplyFilterFn: (filterItem) => {
    if (!filterItem.value || filterItem.value.length === 0) {
      return null;
    }

    // Mengembalikan fungsi filter yang benar
    return (row) =>  filterItem.value.includes(row);
  },
  InputComponent: (props) => <CustomFilterInput {...props} options={options} />,
});
