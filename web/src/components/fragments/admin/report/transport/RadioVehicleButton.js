import {RadioGroup, Radio, useRadio, VisuallyHidden, cn, Button} from "@nextui-org/react";
import useCustomNavigate from "../../../../../hooks/useCustomNavigate";


export default function RadioVehicleButton(props){
    const { getVehicleTransportHistory } = useCustomNavigate()
    const {
        Component,
        children,
        isSelected,
        description,
        getBaseProps,
        getWrapperProps,
        getInputProps,
        getLabelProps,
        getLabelWrapperProps,
        getControlProps,
    } = useRadio(props);

    return (
        <Component
            {...getBaseProps()}
            className={cn(
                "w-full group inline-flex items-center hover:opacity-70 active:opacity-50 justify-between flex-row-reverse tap-highlight-transparent",
                "cursor-pointer border-2 border-default rounded-lg gap-3 py-4 px-3",
                "data-[selected=true]:border-primary",
            )}
        >
            <VisuallyHidden>
                <input {...getInputProps()} />
            </VisuallyHidden>
            <span {...getWrapperProps()}>
                <span {...getControlProps()} />
            </span>
            <div {...getLabelWrapperProps()}>
                <div className='w-full flex flex-col text-xs'>
                    <div className='flex items-center gap-2 mb-3'>
                        <span className='text-sm font-semibold'>{description?.modelKendaraan}</span>
                        /
                        <span className='text-sm'>{description?.noPolisi}</span>
                    </div>
                    <div className='w-full flex flex-col mb-3'>
                        <div>No. Rangka: <span className="font-semibold">{description?.nomorRangka}</span></div>
                        <div>No. Mesin: <span className="font-semibold">{description?.nomorMesin}</span></div>
                        <div>Tahun Pembuatan: <span className="font-semibold">{description?.tahunPembuatan}</span></div>
                    </div>
                </div>
            </div>
        </Component>
    );
};