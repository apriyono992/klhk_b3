import { 
    CubeTransparentIcon, 
    ClipboardDocumentIcon,
    CursorArrowRaysIcon,
    ListBulletIcon,
    ChevronRightIcon
} from "@heroicons/react/24/outline";
import { Accordion, AccordionItem, Avatar } from "@nextui-org/react";
import logo from '../../../assets/images/logo.png'
import ListItem from "../../elements/ListItem";
import { useEffect, useRef } from "react";

export default function Sidebar({ isOpenSidebar, setIsOpenSidebar }) {
    const sidebarRef = useRef(null);
    

    const itemClasses = {
        base: "w-full",
        startContent: 'text-primary',
        title: "text-small text-primary",
        indicator: 'text-primary',
        content: 'py-0',
        trigger: "px-4 py-2.5 data-[hover=true]:bg-primary/20 flex items-center data-[open=true]:bg-primary/20 ",
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsOpenSidebar(false);
            }
        };

        if (isOpenSidebar) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [sidebarRef]);

    return (
        <aside id="logo-sidebar" ref={sidebarRef} className={`fixed top-0 left-0 z-50 w-72 h-screen transition-transform ${ isOpenSidebar ? 'lg:translate-x-0' : '-translate-x-full lg:translate-x-0' } bg-white`} aria-label="Sidebar">
            <div className="h-full overflow-y-auto bg-white">
                <div className="px-5 py-4 flex items-center gap-2 shadow-md bg-white">
                    <Avatar src={logo} className="w-12 h-12" />
                    <div className="flex flex-col text-base leading-tight">
                        <span className="uppercase font-medium">Dirjen PPKL</span>
                        <span className="uppercase font-bold text-primary">MENLHK</span>
                    </div>
                </div>
                <ul className="py-4">
                    <ListItem url="/admin/dasbor" title="Dasbor" icon={<CubeTransparentIcon className="size-5" />} />
                    <ListItem url="/admin/registrasi-b3" title="Registrasi B3" icon={<ClipboardDocumentIcon className="size-5" />} />
                    <ListItem url="/admin/rekomendasi-b3" title="Rekomendasi B3" icon={<CursorArrowRaysIcon className="size-5" />} />
                    <Accordion showDivider={false} className="px-0" itemClasses={itemClasses}>
                        <AccordionItem key="1" title="Mater Data" className="" startContent={<ListBulletIcon className="size-5" />}>
                            <ListItem url="/admin/utama/tembusan" variant="subitem" title="Tembusan" icon={<ChevronRightIcon className="size-3" />} />
                            <ListItem url="/admin/utama/pejabat" variant="subitem" title="Pejabat" icon={<ChevronRightIcon className="size-3" />} />
                            <ListItem url="/admin/utama/bahan-b3" variant="subitem" title="Bahan B3" icon={<ChevronRightIcon className="size-3" />} />
                        </AccordionItem>
                    </Accordion>
                </ul>
            </div>
        </aside>
    )
};
