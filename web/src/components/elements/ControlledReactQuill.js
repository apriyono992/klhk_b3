import React from 'react'
import { Controller } from 'react-hook-form';
import ReactQuill from 'react-quill';

export default function ControlledReactQuill({ name, control, label }) {
    const quillModules = {
        toolbar: [
            [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['bold', 'italic', 'underline', 'strike'],
            ['clean'],
        ],
    };
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <div className='flex flex-col'>
                    <label className='text-sm mb-2'>{label} <span className='text-danger'>*</span></label>
                    <ReactQuill
                        {...field}
                        theme="snow"
                        modules={quillModules}
                        style={{
                            width: "100%",
                            height: "150px",
                            resize: "horizontal",
                            overflow: "auto",
                        }}
                    />
                    {fieldState.error && <p className='text-danger text-xs'>{fieldState.error.message}</p>} 
                </div>
            )}
        />
    )
}
