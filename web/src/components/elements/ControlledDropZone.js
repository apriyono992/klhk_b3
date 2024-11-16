import { ArrowUpTrayIcon, TrashIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone';
import { Controller } from 'react-hook-form';

export default function ControlledDropZone({ name, label, control, setValue }) {
    const [previews, setPreviews] = useState([]);
    const onDrop = (acceptedFiles) => {
        const imageFiles = acceptedFiles.map((file) =>
            Object.assign(file, {
                preview: URL.createObjectURL(file),
            })
        );
        const newFiles = [...previews, ...imageFiles];
        setPreviews(newFiles);
        setValue("photos", newFiles, { shouldValidate: true });
    };
    
    const { getRootProps, getInputProps } = useDropzone({
        accept: { "image/*": []},
        onDrop,
        multiple: true,
    });

   
    const handleRemoveImage = (index) => {
        const updatedPreviews = previews.filter((_, i) => i !== index);
        setPreviews(updatedPreviews);
        setValue("photos", updatedPreviews, { shouldValidate: true });
    };
    return (
        <>
            <Controller
                name={name}
                control={control}
                render={({ field: { onChange }, fieldState }) => (
                    <div>
                        <label className="text-sm">{label} <span className="text-danger">*</span></label>
                        <div {...getRootProps()} className="border-2 border-dashed border-gray-300 bg-neutral-100 px-4 py-3 rounded-xl mt-1.5 text-center cursor-pointer">
                            <input {...getInputProps({ onChange })} />
                            <div className="flex flex-col gap-2">
                                <ArrowUpTrayIcon className="mx-auto size-5 stroke-2 text-gray-500" />
                                <p className="text-sm text-gray-500">Tarik Atau Klik Untuk Upload Gambar</p>
                            </div>
                        </div>
                        {fieldState.error && <span className="text-xs text-danger">{fieldState.error.message}</span>}
                    </div>
                )}
            />
            <div className="grid grid-cols-4 gap-3">
            {previews.map((file, index) => (
                <div onClick={() => handleRemoveImage(index)} key={index} className="h-20 drop-shadow-xl relative cursor-pointer">
                    <img className="w-full h-full rounded-lg object-cover object-center absolute inset-0" src={file.preview} alt={`preview-${index}`} />
                    <div className="w-full h-20 flex items-center justify-center z-10 bg-white opacity-0 hover:opacity-85 rounded-lg">
                        <TrashIcon className="size-7"/>
                    </div>
                </div>
            ))}
            </div>
        </>
    )
}
