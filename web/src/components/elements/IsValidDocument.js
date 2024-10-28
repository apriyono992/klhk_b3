import { CheckCircleIcon, MinusCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { Tooltip } from "@nextui-org/react";

export default function IsValidIcon({ value }){
    const renderContent = () => {
        switch (value) {
            case true:
                return (
                    <Tooltip content="Dokumen valid">
                        <CheckCircleIcon className='size-6 stroke-success'/>
                    </Tooltip>
                );
            case false:
                return (
                    <Tooltip content="Dokumen tidak valid">
                        <XCircleIcon className='size-6 stroke-danger'/>
                    </Tooltip>
                );
            default:
                return (
                    <Tooltip content="Dokumen belum tervalidasi">
                        <MinusCircleIcon className='size-6 stroke-gray-500'/>
                    </Tooltip>
                );;
        }
    };
  
    return <>{renderContent()}</>;
};