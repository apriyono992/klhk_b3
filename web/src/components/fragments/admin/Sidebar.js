import { 
    CubeTransparentIcon, 
    XMarkIcon,
    TruckIcon,
    ClipboardDocumentIcon, 
} from "@heroicons/react/24/outline";
import { Avatar } from "@nextui-org/react";
import logo from '../../../assets/images/logo.png'
import ListItem from "../../elements/ListItem";

export default function Sidebar() {
    return (
        <aside className="z-50 drawer-side">
            <label htmlFor="my-drawer" className="drawer-overlay"></label>
            <ul className="menu flex text-base-content min-h-full w-72 shadow-md p-4 bg-white border-r border-slate-100">
                <AppNameCard/>

                <ListItem isActive title="Dashboard" icon={<CubeTransparentIcon className="size-5" />} />
                <ListItem title="Registrasi B3" icon={<ClipboardDocumentIcon className="size-5" />} />
                <ListItem title="Pengangkutan B3" icon={<TruckIcon className="size-5" />} />
            </ul>
        </aside>
    )
};

function AppNameCard() {
    return (
        <>
            <div className="flex justify-between items-center border-b border-slate-300 px-2 pb-4 mb-3">
                <div className="flex items-center gap-2">
                    <Avatar src={logo} className="w-12 h-12" />
                    <div className="flex flex-col items-start">
                        <span className="uppercase font-medium">SITKPB3</span>
                        <span className="uppercase font-bold text-primary">PTSP Online</span>
                    </div>
                </div>
                <label htmlFor="my-drawer" className="flex lg:hidden ring-2 ring-gray-300 rounded-xl p-2 cursor-pointer">
                    <XMarkIcon className="size-5 stroke-gray-400" />
                </label>
            </div>
        </>
    )
}
