import { CheckCircleIcon, MinusCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { Tooltip } from "@nextui-org/react";

export default function IsValidIcon({ value, validMessage, invalidMessage }){
    const renderContent = () => {
        switch (value) {
            case true:
                return (
                    <Tooltip content={validMessage ?? 'Sesuai'}>
                        <CheckCircleIcon className='size-6 stroke-success'/>
                    </Tooltip>
                );
            case false:
                return (
                    <Tooltip content={invalidMessage ?? 'Tidak sesuai'}>
                        <XCircleIcon className='size-6 stroke-danger'/>
                    </Tooltip>
                );
            default:
                return (
                    <Tooltip content="Belum validasi">
                        <MinusCircleIcon className='size-6 stroke-gray-500'/>
                    </Tooltip>
                );
        }
    };
  
    return <>{renderContent()}</>;
};