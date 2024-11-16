import { Input } from '@nextui-org/react'
import React from 'react'
import { Controller } from 'react-hook-form'

export default function ControlledInput({ name, label, type, isRequired, className, control }) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <Input
                    {...field}
                    variant="faded" 
                    type={type}
                    isRequired={isRequired}
                    label={label} 
                    labelPlacement='outside'
                    placeholder="..."
                    color={fieldState.error ? 'danger' : 'default'}
                    isInvalid={fieldState.error} 
                    errorMessage={fieldState.error && fieldState.error.message}
                    className={className}
                />
            )}
        />
    )
}