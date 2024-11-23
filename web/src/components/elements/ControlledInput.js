import { Input } from "@nextui-org/react";
import React from "react";
import { Controller } from "react-hook-form";

export default function ControlledInput({
    name,
    label,
    type = "text", // Default type ke "text" jika tidak diatur
    isRequired = false, // Default isRequired ke false
    className,
    control,
    rules = {}, // Tambahkan default untuk rules agar opsional
}) {
    return (
        <Controller
            name={name}
            control={control}
            rules={rules} // Terapkan rules dari prop
            render={({ field, fieldState }) => (
                <Input
                    {...field}
                    variant="faded"
                    type={type}
                    isRequired={isRequired}
                    label={label}
                    labelPlacement="outside"
                    placeholder="..."
                    color={fieldState.error ? "danger" : "default"}
                    isInvalid={!!fieldState.error} // Pastikan nilai boolean
                    errorMessage={fieldState.error?.message} // Tampilkan pesan error jika ada
                    className={className}
                />
            )}
        />
    );
}
