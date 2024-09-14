import { 
    CubeTransparentIcon, 
    XMarkIcon,
    TruckIcon,
    ClipboardDocumentIcon 
} from "@heroicons/react/24/outline";
import ListItem from "../../elements/ListItem";
import { User } from "@nextui-org/react";

export default function Sidebar() {
    return (
        <ul className="menu text-base-content min-h-full w-72 shadow-md p-4 bg-white border-r border-slate-100">
            <AppNameCard/>
            <ListItem isActive title="Dashboard" icon={<CubeTransparentIcon className="size-6" />} />
            <ListItem title="Registrasi B3" icon={<ClipboardDocumentIcon className="size-6" />} />
            <ListItem title="Pengangkutan B3" icon={<TruckIcon className="size-6" />} />
        </ul>
    )
};

function AppNameCard() {
    return (
        <>
            <div className="flex justify-between items-center border-b border-slate-300 px-2 pb-4 mb-3">
                <div className="flex gap-2 items-center">
                    <User 
                        name="Jane Doe"
                        description="PIC Registrasi"
                        className="font-medium"
                        avatarProps={{
                            src: "https://i.pravatar.cc/150?u=a04258114e29026702d"
                        }}
                    />
                </div>
                <label htmlFor="my-drawer" className="flex lg:hidden ring-2 ring-gray-300 rounded-xl p-2 cursor-pointer">
                    <XMarkIcon className="size-5 stroke-gray-400" />
                </label>
            </div>
        </>
    )
}
