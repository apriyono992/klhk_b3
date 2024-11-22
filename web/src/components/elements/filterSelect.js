import React from "react";
import Select from "react-select";
import { useGridRootProps } from "@mui/x-data-grid";

export function InputSelect({ item, applyValue, options }) {
    const rootProps = useGridRootProps();
    console.log(options)
    return (
        <Select
            value={options.find((option) => option?.value === item?.value) || null}
            onChange={(selectedOption) => applyValue({ ...item, value: selectedOption?.value || '' })}
            options={options}
            isClearable
            placeholder="Pilih opsi"
            menuPortalTarget={document.body}
            menuPosition="fixed"
            styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                control: (provided) => ({
                    ...provided,
                    minWidth: '150px',
                }),
            }}
        />
    );
}
