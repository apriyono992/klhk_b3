import { useState } from "react";
import {
    ChevronDownIcon,
    ChevronUpIcon,
    ArrowRightEndOnRectangleIcon
} from '@heroicons/react/24/outline';
import { 
    Dropdown, 
    DropdownTrigger, 
    DropdownMenu, 
    DropdownItem,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import logo from '../../../assets/images/logo.png'
import { LOGIN_PATH, REGISTER_PATH } from "../../../services/routes";

export default function HeaderLanding() {
    const [isShow, setIsShow] = useState(false)
    const navigate = useNavigate();

    const handleOpenRegister = () => {
        setIsShow(!isShow)
    }

    const handleItemClick = (page) => {
        navigate(`/${page}`);
    };

    return (
        <nav className="w-full fixed top-0 z-40 h-20 bg-white">
            <div className="flex items-center justify-between px-12 py-4">
                <div className="flex flex-row">
                    <img src={logo} alt="Logo" className="size-12"/>
                    <div className="pl-5">
                        <p className="text-[#5D7987] font-semibold text-base">Kementerian Lingkungan Hidup dan Kehutanan</p>
                        <p className="text-[#5D7987] text-base">REPUBLIK INDONESIA</p>
                    </div>
                </div>
                <div className="flex flex-row items-center">
                    <div className="flex flex-row gap-10">
                        <div className="text-[#5D7987] text-base cursor-pointer" onClick={() => navigate('/', {replace: true})}>Beranda</div>
                        <div className="text-[#5D7987] text-base">
                            <Dropdown placement="bottom-start" className="hover">
                                <DropdownTrigger>
                                    <div className="flex flex-row cursor-pointer">
                                        Profil <ChevronDownIcon className="size-4 mt-1 ml-2"/>
                                    </div>
                                </DropdownTrigger>
                                <DropdownMenu variant="faded">
                                    <DropdownItem key="profile">Profil Direktorat PB3</DropdownItem>
                                    <DropdownItem key="organisasi">Organisasi</DropdownItem>
                                    <DropdownItem key="pimpinan">Pimpinan</DropdownItem>
                                    <DropdownItem key="kontak">Kontak</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                        <div className="text-[#5D7987] text-base">
                            <Dropdown placement="bottom-start" className="hover">
                                <DropdownTrigger>
                                    <div className="flex flex-row cursor-pointer">
                                        Informasi <ChevronDownIcon className="size-4 mt-1 ml-2"/>
                                    </div>
                                </DropdownTrigger>
                                <DropdownMenu variant="faded">
                                    <DropdownItem onClick={() => handleItemClick('berita')} key="berita">Berita</DropdownItem>
                                    <DropdownItem onClick={() => handleItemClick('artikel')} key="artikel">Artikel</DropdownItem>
                                    <DropdownItem key="publikasi">Publikasi</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                        <div className="text-[#5D7987] text-base">
                            <Dropdown placement="bottom-start" className="hover">
                                <DropdownTrigger>
                                    <div className="flex flex-row cursor-pointer">
                                        Tata Kelola B3 <ChevronDownIcon className="size-4 mt-1 ml-2"/>
                                    </div>
                                </DropdownTrigger>
                                <DropdownMenu variant="faded">
                                    <DropdownItem key="berita">Portal dan Database</DropdownItem>
                                    <DropdownItem onClick={() => navigate('/pemantauan-merkuri', {replace: true})} key="pemantauan-merkuri">Mercury Monitoring</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                        <div className="text-[#5D7987] text-base">Dokumen</div>
                    </div>
                    <div className="flex flex-row w-36 h-12 ml-6">
                        <div onClick={() => navigate(LOGIN_PATH)} className="flex flex-row items-center justify-center w-[80%] rounded-l-lg border-2 border-[#05472A] cursor-pointer text-[#05472A] hover:bg-[#05472A] hover:text-white">
                           <ArrowRightEndOnRectangleIcon className="size-5 mr-2 "/> Login
                        </div>
                        <div onClick={handleOpenRegister} className="cursor-pointer flex flex-row items-center justify-center w-[20%] rounded-r-lg border-l-0 border-2 border-[#05472A] cursor-pointer text-[#05472A] hover:bg-[#05472A] hover:text-white">
                            {isShow ? <ChevronUpIcon className="size-5"/> : <ChevronDownIcon className="size-5"/>}
                        </div>
                        {isShow && 
                        <div onClick={() => navigate(REGISTER_PATH)} className="absolute top-[85%] flex flex-row items-center justify-center w-36 h-12 rounded-lg border-2 border-[#05472A] cursor-pointer text-[#05472A] bg-white hover:bg-[#05472A] hover:text-white">
                            <ArrowRightEndOnRectangleIcon className="size-5 mr-2 "/> Register
                        </div>
                        }
                    </div>
                </div>
            </div>
        </nav>
    )
}