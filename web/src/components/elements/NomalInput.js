import React from "react";
import Select from "react-select";
import { Input } from "@mui/material";

export default function NomalInput({ name, label, type = "text", isRequired = false, value, onChange, options = [], className }) {
    // Menggunakan `react-select` jika tipe input adalah "select"
    if (type === "select") {
        return (
            <div className={className}>
                <label className="block text-sm font-medium mb-1">{label}</label>
                <Select
                    name={name}
                    value={options.find((option) => option.value === value) || null}
                    onChange={(selectedOption) => onChange(selectedOption?.value || '')}
                    options={options}
                    isClearable
                    placeholder={`Pilih ${label}`}
                    styles={{
                        control: (provided) => ({
                            ...provided,
                            borderColor: isRequired && !value ? "red" : provided.borderColor,
                        }),
                    }}
                />
            </div>
        );
    }

    // Default input (text, number, date, dll.)
    return (
        <div className={className}>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <Input
                name={name}
                value={value}
                onChange={onChange}
                type={type}
                required={isRequired}
                placeholder={`Masukkan ${label}`}
                fullWidth
            />
        </div>
    );
}
