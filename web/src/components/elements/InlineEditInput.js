import { CheckIcon, PencilSquareIcon, PlusCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {useEffect, useState} from "react";
import { set, useForm } from "react-hook-form";

export default function  InlineEditInput({ multiline = false, value = '', onSubmit }) {
    const [isEditing, setIsEditing] = useState(false);
    const [values, setvalues] = useState(value);
    const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: { text: values } });

    // Sync state with prop when the prop changes
    useEffect(() => {
        setvalues(value);
        reset({ text: value }); // Reset the form to the new value
    }, [value, reset]);

    function handleOnSubmit(data) {
        onSubmit(data);
        setIsEditing(false);
        setvalues(data.text);
    }

    function onCancel() {
        reset({ text: values });
        setIsEditing(false);
    }

    return(
        <>
        {
            isEditing
            ?
                (
                    <form onSubmit={handleSubmit(handleOnSubmit)} className="w-full flex items-center gap-3">
                        {
                            multiline
                            ?
                                <textarea {...register("text", { required: true })} className="text-sm border-1 border-gray-300 focus:ring-0 focus:outline-0 px-1 rounded-md" autoFocus rows={4} cols={60}></textarea>
                            :
                                <input {...register("text", { required: true })} type="text" className="text-sm border-1 border-gray-300 focus:ring-0 focus:outline-0 px-1 rounded-md" autoFocus  />


                        }
                        <button><CheckIcon className="size-4"/></button>
                        <button onClick={onCancel}><XMarkIcon className="size-4"/></button>
                    </form>
                )
            :
                (
                    <div className="flex items-center">
                        <span onClick={() => setIsEditing(true)} className={`me-3 text-sm text-black font-medium`}>{values}</span>
                        <button onClick={() => setIsEditing(true)}>
                            <PencilSquareIcon  className="size-4"/>
                        </button>
                    </div>
                )
        }

        </>
    );
}
