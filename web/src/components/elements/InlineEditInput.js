import { CheckIcon, PencilSquareIcon, PlusCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function  InlineEditInput({ value = "", multiline = false, onSave }) {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(value);
    const [tempInputValue, setTempInputValue] = useState(value);

    function handleSave() {
        if (inputValue.trim() === "") {
            setInputValue(tempInputValue);
        } else {
            setTempInputValue(inputValue)
            onSave(inputValue);
        }
        setIsEditing(false);
    };

    function handleCancel() {
        setInputValue(tempInputValue);
        setIsEditing(false);
    };

    function handleOnChange(event) {
        setInputValue(event.target.value);
    }
    

    return(
        <>
        {
            isEditing 
            ? 
                (
                    <div className="w-full flex items-center gap-3">
                        {
                            multiline
                            ?
                                <textarea className="text-sm border-1 border-gray-300 focus:ring-0 focus:outline-0 px-1 rounded-md" value={inputValue} onChange={handleOnChange} autoFocus rows={4} cols={60}></textarea>
                            :
                                <input type="text" className="text-sm border-1 border-gray-300 focus:ring-0 focus:outline-0 px-1 rounded-md" value={inputValue} onChange={handleOnChange}autoFocus  />
                                

                        }
                        <button onClick={handleSave}><CheckIcon className="size-4"/></button>
                        <button onClick={handleCancel}><XMarkIcon className="size-4"/></button>
                    </div>
                )
            : 
                (
                    <div className="flex items-center">
                        <span onClick={() => setIsEditing(true)} className={`${inputValue.trim() === "" ? "m-0" : "me-3"} text-sm text-black font-medium`}>{inputValue}</span>
                        <button onClick={() => setIsEditing(true)}>
                            {
                                inputValue.trim() === ""
                                ? <PlusCircleIcon  className="size-5"/>
                                : <PencilSquareIcon  className="size-4"/>
                            }
                        </button>
                    </div>
                )
        }
        
        </>
    );
}
