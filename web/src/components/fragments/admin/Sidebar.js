import { 
    CubeTransparentIcon, 
    ClipboardDocumentIcon,
    CursorArrowRaysIcon,
    ListBulletIcon,
    ChevronRightIcon,
    FolderIcon,
    DocumentIcon,
    ChartBarIcon,
    BellAlertIcon
} from "@heroicons/react/24/outline";
import { Accordion, AccordionItem, Avatar } from "@nextui-org/react";
import logo from '../../../assets/images/logo.png'
import ListItem from "../../elements/ListItem";
import { useEffect, useRef } from "react";
import { CARBON_COPY_INDEX_PATH, DASHBOARD_PATH, MATERIAL_INDEX_PATH, NOTIFICATION_DASHBOARD_PATH, NOTIFICATION_INDEX_PATH, OFFICIAL_INDEX_PATH, RECOMENDATION_DASHBOARD_PATH, RECOMENDATION_INDEX_PATH, REGISTRATION_DASHBOARD_PATH, REGISTRATION_INDEX_PATH } from "../../../services/routes";
import useCustomNavigate from "../../../hooks/useCustomNavigate";

export default function Sidebar({ isOpenSidebar, setIsOpenSidebar }) {
    const sidebarRef = useRef(null);
    const { getCurrentRouteGroup } = useCustomNavigate()    
    
    const itemClasses = {
        base: "w-full",
        startContent: 'text-primary',
        title: "text-small text-primary",
        indicator: 'text-primary',
        content: 'py-0',
        trigger: "px-4 py-3 data-[hover=true]:bg-primary/20 flex items-center data-[open=true]:bg-primary/20 ",
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
    
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpenSidebar, setIsOpenSidebar, sidebarRef]);

    return (
        <aside id="logo-sidebar" ref={sidebarRef} className={`fixed top-0 left-0 z-50 w-72 h-screen transition-transform shadow-md ${ isOpenSidebar ? 'lg:translate-x-0' : '-translate-x-full lg:translate-x-0' } bg-white`} aria-label="Sidebar">
            <div className="h-full overflow-y-auto bg-white">
                <div className="px-5 py-4 flex items-center gap-2 shadow-md bg-white">
                    <Avatar src={logo} className="w-12 h-12" />
                    <div className="flex flex-col text-base leading-tight">
                        <span className="uppercase font-medium">Dirjen PPKL</span>
                        <span className="uppercase font-bold text-primary">MENLHK</span>
                    </div>
                </div>
                <ul className="py-4">
                    <ListItem url={DASHBOARD_PATH} title="Dasbor" icon={<CubeTransparentIcon className="size-5" />} />
                    <Accordion 
                        defaultSelectedKeys={getCurrentRouteGroup()}
                        showDivider={false} 
                        className="px-0" 
                        itemClasses={itemClasses}
                    >
                        <AccordionItem key="1" title="Registrasi B3" className="" startContent={<ClipboardDocumentIcon className="size-5" />}>
                            <ListItem url={REGISTRATION_DASHBOARD_PATH} variant="subitem" title="Dasbor" icon={<ChartBarIcon className="size-4" />} />
                            <ListItem url={REGISTRATION_INDEX_PATH} variant="subitem" title="Daftar" icon={<ListBulletIcon className="size-4" />} />
                        </AccordionItem>
                        <AccordionItem key="2" title="Rekomendasi B3" className="" startContent={<CursorArrowRaysIcon className="size-5" />}>
                            <ListItem url={RECOMENDATION_DASHBOARD_PATH} variant="subitem" title="Dasbor" icon={<ChartBarIcon className="size-4" />} />
                            <ListItem url={RECOMENDATION_INDEX_PATH} variant="subitem" title="Daftar" icon={<ListBulletIcon className="size-4" />} />
                        </AccordionItem>
                        <AccordionItem key="3" title="Notifikasi" className="" startContent={<BellAlertIcon className="size-5" />}>
                            <ListItem url={NOTIFICATION_DASHBOARD_PATH} variant="subitem" title="Dasbor" icon={<ChartBarIcon className="size-4" />} />
                            <ListItem url={NOTIFICATION_INDEX_PATH} variant="subitem" title="Daftar" icon={<ListBulletIcon className="size-4" />} />
                        </AccordionItem>
                        <AccordionItem key="4" title="Mater Data" className="" startContent={<FolderIcon className="size-5" />}>
                            <ListItem url={CARBON_COPY_INDEX_PATH} variant="subitem" title="Tembusan" icon={<DocumentIcon className="size-4" />} />
                            <ListItem url={OFFICIAL_INDEX_PATH} variant="subitem" title="Pejabat" icon={<DocumentIcon className="size-4" />} />
                            <ListItem url={MATERIAL_INDEX_PATH} variant="subitem" title="Bahan B3" icon={<DocumentIcon className="size-4" />} />
                        </AccordionItem>
                    </Accordion>
                </ul>
            </div>
        </aside>
    )
};
