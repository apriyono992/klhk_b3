import { useState } from "react";
import { 
    SunIcon, 
    MoonIcon, 
    UserIcon, 
    Bars3BottomLeftIcon,
    ArrowLeftStartOnRectangleIcon
} from '@heroicons/react/24/outline';
import { 
    Dropdown, 
    DropdownTrigger, 
    DropdownMenu, 
    DropdownItem, 
    Avatar,
    Button,
} from "@nextui-org/react";

export default function Header() {
    const [theme, setTheme] = useState(true);

    return (
        <header className="navbar bg-white px-5 border-b border-slate-100 shadow-md">
            <div className="flex-1 gap-4">
                <label htmlFor="my-drawer" className="flex lg:hidden ring-2 ring-primary rounded-xl p-2 cursor-pointer">
                    <Bars3BottomLeftIcon className="size-5 stroke-primary" />
                </label>
                <div className="hidden md:flex flex-col items-start">
                    <span className="uppercase font-bold text-primary">Kementrian Lingkungan Hidup dan Kehutanan</span>
                    <span className="uppercase font-medium">Direktorat Jendral Pengelolaan Sampah, Limbah, dan B3</span>
                </div>
                <div className="flex md:hidden flex-col items-start">
                    <span className="uppercase font-medium">Dirjen PPKL</span>
                    <span className="uppercase font-bold text-primary">MENLHK</span>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button onClick={() => setTheme(!theme)} isIconOnly className="bg-default rounded-full">
                    { theme ? <SunIcon className="size-6" /> : <MoonIcon className="size-5" /> }
                </Button>
                
                <Dropdown placement="bottom-start">
                    <DropdownTrigger>
                        <Avatar as="button" src="https://i.pravatar.cc/150?u=a042581f4e29026024d"/>
                    </DropdownTrigger>
                    <DropdownMenu variant="faded">
                        <DropdownItem key="settings" startContent={<UserIcon className="size-4" />}>Profile</DropdownItem>
                        <DropdownItem key="logout" startContent={<ArrowLeftStartOnRectangleIcon className="size-4" />}>Log Out</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </header>
    )
}