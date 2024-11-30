import {
    CubeTransparentIcon,
    ClipboardDocumentIcon,
    CursorArrowRaysIcon,
    ListBulletIcon,
    FolderIcon,
    ChartBarIcon,
    BellAlertIcon,
    BuildingOfficeIcon,
    ExclamationTriangleIcon,
    UserGroupIcon,
    ArchiveBoxIcon,
    PresentationChartBarIcon,
    AtSymbolIcon,
    TruckIcon,
    NewspaperIcon,
    PaperClipIcon,
    DocumentIcon,
    TicketIcon,
    ClockIcon,
    CogIcon,
    UserIcon,
    ArrowsPointingOutIcon,
    ScaleIcon,
    ArrowDownOnSquareIcon,
    ArrowUpOnSquareIcon,
    TableCellsIcon,
    PowerIcon,
} from "@heroicons/react/24/outline";
import { Accordion, AccordionItem, Avatar } from "@nextui-org/react";
import logo from "../../../assets/images/logo.png";
import ListItem from "../../elements/ListItem";
import { useEffect, useRef } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import {
    ADMIN_REPORT_CONSUMPTION_MATERIAL_INDEX,
    ADMIN_REPORT_DISTRIBUTION_MATERIAL_INDEX,
    ADMIN_REPORT_PRODUCTION_MATERIAL,
    ADMIN_REPORT_STORAGE,
    ADMIN_REPORT_TRANSPORT_INDEX,
    ASAL_MUAT_INDEX_PATH,
    CARBON_COPY_INDEX_PATH,
    CMS_ARTICLE_PATH,
    CMS_DOCUMENT_PATH,
    CMS_EVENT_PATH,
    CMS_NEWS_PATH,
    COMPANY_INDEX_PATH,
    COMPANY_REPORT_STORAGE,
    DASHBOARD_PATH,
    MATERIAL_INDEX_PATH,
    MERKURI_MONITORING_INDEX_PATH,
    NOTIFICATION_DASHBOARD_PATH,
    NOTIFICATION_INDEX_PATH,
    OFFICIAL_INDEX_PATH,
    PELAPORAN_DASHBOARD_PATH,
    PELAPORAN_PENGANGKUTAN_GRAFIK,
    PELAPORAN_PENGANGKUTAN_PENCARIAN,
    PELAPORAN_PENGGUNAAN_GRAFIK,
    PELAPORAN_PENGGUNAAN_PENCARIAN,
    PELAPORAN_PRODUSEN_GRAFIK,
    PELAPORAN_PRODUSEN_PENCARIAN,
    PELAPORAN_PENYIMPANAN_GRAFIK_PATH,
    PERIOD_INDEX_PATH,
    RECOMENDATION_DASHBOARD_PATH,
    RECOMENDATION_INDEX_PATH,
    REGISTRATION_DASHBOARD_PATH,
    REGISTRATION_INDEX_PATH,
    REPORT_CONSUMPTION_MATERIAL_INDEX,
    REPORT_DISTRIBUTION_MATERIAL,
    REPORT_DISTRIBUTION_MATERIAL_INDEX,
    REPORT_PRODUCTION_MATERIAL,
    REPORT_TRANSPORT_INDEX,
    REPORT_TRANSPORT_RECOMENDATION_INDEX,
    STOK_B3_INDEX_ADMIN_PATH,
    STOK_B3_INDEX_USER_PATH,
    TUJUAN_BONGKAR_INDEX_PATH,
    USERS_MANAGEMENT_INDEX_PATH,
    WPR_INDEX_PATH
} from "../../../services/routes";
import useCustomNavigate from "../../../hooks/useCustomNavigate";
import RolesAccess from "../../../enums/roles";
import { icon } from "leaflet";

export default function Sidebar({ isOpenSidebar, setIsOpenSidebar }) {
    const sidebarRef = useRef(null);
    const { user, roles } = useAuth();
    const { getCurrentRouteGroup } = useCustomNavigate()


    // Data menu lengkap dengan assign roles
    const menuData = [
        {
            title: "Dasbor",
            url: DASHBOARD_PATH,
            icon: <CubeTransparentIcon className="size-5" />,
            roles: [RolesAccess.SUPER_ADMIN, RolesAccess.DIREKTUR, RolesAccess.KAB_SUBDIT_REGISTRASI, RolesAccess.KAB_SUBDIT_REKOMENDASI],
        },
        {
            key: "1",
            title: "Registrasi B3",
            icon: <ClipboardDocumentIcon className="size-5" />,
            roles: [RolesAccess.SUPER_ADMIN, RolesAccess.PIC_REGISTRASI],
            children: [
                { title: "Dasbor", url: REGISTRATION_DASHBOARD_PATH, icon: <ChartBarIcon className="size-4" /> ,
                    roles: [RolesAccess.SUPER_ADMIN, RolesAccess.PIC_REGISTRASI]},
                { title: "Daftar", url: REGISTRATION_INDEX_PATH, icon: <ListBulletIcon className="size-4" /> ,
                    roles: [RolesAccess.SUPER_ADMIN, RolesAccess.PIC_REGISTRASI]},
            ],
        },
        {
            key: "2",
            title: "Rekomendasi Pengakutan B3",
            icon: <CursorArrowRaysIcon className="size-5" />,
            roles: [RolesAccess.SUPER_ADMIN, RolesAccess.PIC_REKOMENDASI],
            children: [
                {
                    title: "Dasbor",
                    url: RECOMENDATION_DASHBOARD_PATH,
                    icon: <ChartBarIcon className="size-4" />,
                    roles: [RolesAccess.SUPER_ADMIN, RolesAccess.PIC_REKOMENDASI]
                },
                { title: "Daftar", url: RECOMENDATION_INDEX_PATH, icon: <ListBulletIcon className="size-4" />,roles: [RolesAccess.SUPER_ADMIN, RolesAccess.PIC_REKOMENDASI] },
            ],
        },
        {
            key: "3",
            title: "Notifikasi",
            icon: <BellAlertIcon className="size-5" />,
            roles: [RolesAccess.SUPER_ADMIN, RolesAccess.PIC_NOTIFIKASI],
            children: [
                { title: "Dasbor", url: NOTIFICATION_DASHBOARD_PATH, icon: <ChartBarIcon className="size-4" />, roles: [RolesAccess.SUPER_ADMIN, RolesAccess.PIC_NOTIFIKASI]},
                { title: "Daftar", url: NOTIFICATION_INDEX_PATH, icon: <ListBulletIcon className="size-4" />, roles: [RolesAccess.SUPER_ADMIN, RolesAccess.PIC_NOTIFIKASI] },
            ],
        },
        {
            key: "4",
            title: "Pelaporan",
            icon: <PresentationChartBarIcon className="size-5" />,
            roles: [RolesAccess.SUPER_ADMIN, RolesAccess.PIC_PELAPORAN, RolesAccess.PENGELOLA],
            children: [
                // Akses untuk Super Admin
                {
                    title: "Dashboard",
                    url: PELAPORAN_DASHBOARD_PATH,
                    icon: <TableCellsIcon className="size-4" />,
                    roles: [RolesAccess.SUPER_ADMIN, RolesAccess.PIC_PELAPORAN, RolesAccess.PENGELOLA], // Bisa diakses semua
                },
                {
                    title: "Penyimpanan B3 (Admin)",
                    url: ADMIN_REPORT_STORAGE,
                    icon: <ArchiveBoxIcon className="size-4" />,
                    roles: [RolesAccess.SUPER_ADMIN, RolesAccess.PIC_PELAPORAN], // Hanya Super Admin dan PIC Pelaporan
                },
                {
                    title: "Pengangkutan B3 (Admin)",
                    url: ADMIN_REPORT_TRANSPORT_INDEX,
                    icon: <TruckIcon className="size-4" />,
                    roles: [RolesAccess.SUPER_ADMIN, RolesAccess.PIC_PELAPORAN], // Hanya Super Admin dan PIC Pelaporan
                },
                {
                    title: "Produksi Jenis B3 (Admin)",
                    url: ADMIN_REPORT_PRODUCTION_MATERIAL,
                    icon: <ExclamationTriangleIcon className="size-4" />,
                    roles: [RolesAccess.SUPER_ADMIN, RolesAccess.PIC_PELAPORAN], // Hanya Super Admin dan PIC Pelaporan
                },
                {
                    title: "Distribusi Jenis B3 (Admin)",
                    url: ADMIN_REPORT_DISTRIBUTION_MATERIAL_INDEX,
                    icon: <ArrowsPointingOutIcon className="size-4" />,
                    roles: [RolesAccess.SUPER_ADMIN, RolesAccess.PIC_PELAPORAN], // Hanya Super Admin dan PIC Pelaporan
                },
                {
                    title: "Konsumsi B3 (Admin)",
                    url: ADMIN_REPORT_CONSUMPTION_MATERIAL_INDEX,
                    icon: <ScaleIcon className="size-4" />,
                    roles: [RolesAccess.SUPER_ADMIN, RolesAccess.PIC_PELAPORAN], // Hanya Super Admin dan PIC Pelaporan
                },

                // Akses untuk Pengelola (User)
                {
                    title: "Penyimpanan B3 (Perusahaan)",
                    url: COMPANY_REPORT_STORAGE,
                    icon: <ArchiveBoxIcon className="size-4" />,
                    roles: [RolesAccess.SUPER_ADMIN, RolesAccess.PENGELOLA], // Hanya Super Admin dan Pengelola
                },
                {
                    title: "Pengangkutan B3 (Perusahaan)",
                    url: REPORT_TRANSPORT_RECOMENDATION_INDEX,
                    icon: <TruckIcon className="size-4" />,
                    roles: [RolesAccess.SUPER_ADMIN, RolesAccess.PENGELOLA], // Hanya Super Admin dan Pengelola
                },
                {
                    title: "Produksi Jenis B3 (Perusahaan)",
                    url: REPORT_PRODUCTION_MATERIAL,
                    icon: <ExclamationTriangleIcon className="size-4" />,
                    roles: [RolesAccess.SUPER_ADMIN, RolesAccess.PENGELOLA], // Hanya Super Admin dan Pengelola
                },
                {
                    title: "Distribusi Jenis B3 (Perusahaan)",
                    url: REPORT_DISTRIBUTION_MATERIAL_INDEX,
                    icon: <ArrowsPointingOutIcon className="size-4" />,
                    roles: [RolesAccess.SUPER_ADMIN, RolesAccess.PENGELOLA], // Hanya Super Admin dan Pengelola
                },
                {
                    title: "Konsumsi B3 (Perusahaan)",
                    url: REPORT_CONSUMPTION_MATERIAL_INDEX,
                    icon: <ScaleIcon className="size-4" />,
                    roles: [RolesAccess.SUPER_ADMIN, RolesAccess.PENGELOLA], // Hanya Super Admin dan Pengelola
                },
            ],
        },
        {
            key: "5",
            title: "Data Master",
            icon: <FolderIcon className="size-5" />,
            roles: [RolesAccess.SUPER_ADMIN, RolesAccess.DIREKTUR, RolesAccess.PENGELOLA, RolesAccess.PIC_NOTIFIKASI, RolesAccess.PIC_PELAPORAN, RolesAccess.PIC_REGISTRASI, RolesAccess.PIC_REKOMENDASI], // Akses hanya untuk SuperAdmin
            children: [
                {
                    title: "Tembusan",
                    url: CARBON_COPY_INDEX_PATH,
                    icon: <AtSymbolIcon className="size-4" />,
                    roles: [RolesAccess.SUPER_ADMIN, RolesAccess.DIREKTUR,RolesAccess.PIC_NOTIFIKASI, RolesAccess.PIC_PELAPORAN, RolesAccess.PIC_REGISTRASI, RolesAccess.PIC_REKOMENDASI], // Akses hanya untuk SuperAdmin
                },
                {
                    title: "Pejabat",
                    url: OFFICIAL_INDEX_PATH,
                    icon: <UserGroupIcon className="size-4" />,
                    roles: [RolesAccess.SUPER_ADMIN, RolesAccess.DIREKTUR,RolesAccess.PIC_NOTIFIKASI, RolesAccess.PIC_PELAPORAN, RolesAccess.PIC_REGISTRASI, RolesAccess.PIC_REKOMENDASI], // Akses hanya untuk SuperAdmin
                },
                {
                    title: "Bahan B3",
                    url: MATERIAL_INDEX_PATH,
                    icon: <ExclamationTriangleIcon className="size-4" />,
                    roles: [RolesAccess.SUPER_ADMIN, RolesAccess.DIREKTUR, RolesAccess.PENGELOLA, RolesAccess.PIC_NOTIFIKASI, RolesAccess.PIC_PELAPORAN, RolesAccess.PIC_REGISTRASI, RolesAccess.PIC_REKOMENDASI], // Akses hanya untuk SuperAdmin
                },
                {
                    title: "Perusahaan",
                    url: COMPANY_INDEX_PATH,
                    icon: <BuildingOfficeIcon className="size-4" />,
                    roles: [RolesAccess.SUPER_ADMIN, RolesAccess.DIREKTUR, RolesAccess.PENGELOLA, RolesAccess.PIC_NOTIFIKASI, RolesAccess.PIC_PELAPORAN, RolesAccess.PIC_REGISTRASI, RolesAccess.PIC_REKOMENDASI], // Akses hanya untuk SuperAdmin
                },
                {
                    title: "Periode",
                    url: PERIOD_INDEX_PATH,
                    icon: <ClockIcon className="size-4" />,
                    roles: [RolesAccess.SUPER_ADMIN, RolesAccess.PIC_PELAPORAN], // Akses hanya untuk SuperAdmin
                },
                {
                    title: "Asal Muat",
                    url: ASAL_MUAT_INDEX_PATH,
                    icon: <ArrowDownOnSquareIcon className="size-4" />,
                    roles: [RolesAccess.SUPER_ADMIN, RolesAccess.DIREKTUR, RolesAccess.PENGELOLA, RolesAccess.PIC_NOTIFIKASI, RolesAccess.PIC_PELAPORAN, RolesAccess.PIC_REGISTRASI, RolesAccess.PIC_REKOMENDASI], // Akses hanya untuk SuperAdmin
                },
                {
                    title: "Tujuan Bongkar",
                    url: TUJUAN_BONGKAR_INDEX_PATH,
                    icon: <ArrowUpOnSquareIcon className="size-4" />,
                    roles: [RolesAccess.SUPER_ADMIN, RolesAccess.DIREKTUR, RolesAccess.PENGELOLA, RolesAccess.PIC_NOTIFIKASI, RolesAccess.PIC_PELAPORAN, RolesAccess.PIC_REGISTRASI, RolesAccess.PIC_REKOMENDASI], // Akses hanya untuk SuperAdmin
                },
            ],
        },
        {
            key: "7",
            title: "CMS",
            icon: <NewspaperIcon className="size-4" />,
            roles: [RolesAccess.SUPER_ADMIN, RolesAccess.PIC_CMS],
            children: [
                { title: "Berita", url: CMS_NEWS_PATH, icon: <NewspaperIcon className="size-4" />,
                    roles: [RolesAccess.SUPER_ADMIN, RolesAccess.PIC_CMS]},
                { title: "Artikel", url: CMS_ARTICLE_PATH, icon: <PaperClipIcon className="size-4" /> ,
                    roles: [RolesAccess.SUPER_ADMIN, RolesAccess.PIC_CMS]},
                { title: "Dokumen", url: CMS_DOCUMENT_PATH, icon: <DocumentIcon className="size-4" /> ,
                    roles: [RolesAccess.SUPER_ADMIN, RolesAccess.PIC_CMS]},
                { title: "Event", url: CMS_EVENT_PATH, icon: <TicketIcon className="size-4" /> ,
                    roles: [RolesAccess.SUPER_ADMIN, RolesAccess.PIC_CMS]},
            ],
        },
        {
            key: "6",
            title: "Stok B3",
            icon: <BellAlertIcon className="size-5" />,
            roles: [RolesAccess.SUPER_ADMIN, RolesAccess.PENGELOLA, RolesAccess.PIC_PELAPORAN],
            children: [
                { title: "Stok B3 Admin", url: STOK_B3_INDEX_ADMIN_PATH, icon: <ChartBarIcon className="size-4" /> ,
                    roles: [RolesAccess.SUPER_ADMIN, RolesAccess.PIC_PELAPORAN]},
                { title: "Stok B3 User", url: STOK_B3_INDEX_USER_PATH, icon: <ListBulletIcon className="size-4" /> ,
                    roles: [RolesAccess.SUPER_ADMIN, RolesAccess.PENGELOLA]},
            ],
        },
        {
            key: "8",
            title: "Merkuri",
            icon: <PowerIcon className="size-5" />,
            roles: [RolesAccess.SUPER_ADMIN, RolesAccess.PIC_CMS, RolesAccess.DIREKTUR], // Akses untuk SuperAdmin dan Pengelola
            children: [
                {
                    title: "Wilayah Pertambangan Rakyat",
                    url: WPR_INDEX_PATH,
                    icon: <CogIcon className="size-4" />,
                    roles: [RolesAccess.SUPER_ADMIN, RolesAccess.PIC_CMS], // Hanya untuk SuperAdmin
                },
                {
                    title: "Merkuri Monitoring Lingkungan",
                    url: MERKURI_MONITORING_INDEX_PATH,
                    icon: <ArchiveBoxIcon className="size-4" />,
                    roles: [RolesAccess.SUPER_ADMIN, RolesAccess.PIC_CMS], // Hanya untuk SuperAdmin
                },
            ],
        },
        {
            key: "9",
            title: "User Management",
            icon: <UserGroupIcon className="size-5" />,
            roles: [RolesAccess.SUPER_ADMIN],
            children: [
                { title: "Users", url: USERS_MANAGEMENT_INDEX_PATH, icon: <UserIcon className="size-4" /> ,
                    roles: [RolesAccess.SUPER_ADMIN]},
            ],
        },
        {
            key: "10",
            title: "Dashboard Pengangkutan",
            icon: <ChartBarIcon className="size-5" />,
            roles: [RolesAccess.SUPER_ADMIN, RolesAccess.PIC_PELAPORAN, RolesAccess.DIREKTUR],
            children:[                        {
                title: "Grafik",
                url: PELAPORAN_PENGANGKUTAN_GRAFIK,
                icon: <ArchiveBoxIcon className="size-4" />,
                roles: [RolesAccess.SUPER_ADMIN, RolesAccess.PIC_PELAPORAN],
            },
            {
                title: "Peta",
                url: PELAPORAN_DASHBOARD_PATH,
                icon: <ArchiveBoxIcon className="size-4" />,
                roles: [RolesAccess.SUPER_ADMIN, RolesAccess.PIC_PELAPORAN],
            },
            {
                title: "Pencarian",
                url: PELAPORAN_PENGANGKUTAN_PENCARIAN,
                icon: <ArchiveBoxIcon className="size-4" />,
                roles: [RolesAccess.SUPER_ADMIN, RolesAccess.PIC_PELAPORAN],
            }
            ]
        },
        {
            key: "11",
            title: "Dashboard Penggunaan",
            icon: <ChartBarIcon className="size-5" />,
            roles: [RolesAccess.SUPER_ADMIN, RolesAccess.PIC_PELAPORAN, RolesAccess.DIREKTUR],
            children:[                        {
                title: "Grafik",
                url: PELAPORAN_PENGGUNAAN_GRAFIK,
                icon: <ArchiveBoxIcon className="size-4" />,
                roles: [RolesAccess.SUPER_ADMIN, RolesAccess.PIC_PELAPORAN],
            },
            {
                title: "Peta",
                url: PELAPORAN_DASHBOARD_PATH,
                icon: <ArchiveBoxIcon className="size-4" />,
                roles: [RolesAccess.SUPER_ADMIN, RolesAccess.PIC_PELAPORAN],
            },
            {
                title: "Pencarian",
                url: PELAPORAN_PENGGUNAAN_PENCARIAN,
                icon: <ArchiveBoxIcon className="size-4" />,
                roles: [RolesAccess.SUPER_ADMIN, RolesAccess.PIC_PELAPORAN],
            }
            ]
        },
        {
            key: "12",
            title: "Dashboard Produsen",
            icon: <ChartBarIcon className="size-5" />,
            roles: [RolesAccess.SUPER_ADMIN, RolesAccess.PIC_PELAPORAN, RolesAccess.DIREKTUR],
            children:[                        {
                title: "Grafik",
                url: PELAPORAN_PRODUSEN_GRAFIK,
                icon: <ArchiveBoxIcon className="size-4" />,
                roles: [RolesAccess.SUPER_ADMIN, RolesAccess.PIC_PELAPORAN],
            },
            {
                title: "Peta",
                url: PELAPORAN_DASHBOARD_PATH,
                icon: <ArchiveBoxIcon className="size-4" />,
                roles: [RolesAccess.SUPER_ADMIN, RolesAccess.PIC_PELAPORAN],
            },
            {
                title: "Pencarian",
                url: PELAPORAN_PRODUSEN_PENCARIAN,
                icon: <ArchiveBoxIcon className="size-4" />,
                roles: [RolesAccess.SUPER_ADMIN, RolesAccess.PIC_PELAPORAN],
            }
            ]
        },
        {
            key: "13",
            title: "Dashboard Penyimpanan",
            icon: <ChartBarIcon className="size-5" />,
            roles: [RolesAccess.SUPER_ADMIN, RolesAccess.PIC_PELAPORAN, RolesAccess.DIREKTUR],
            children:[                        {
                title: "Grafik",
                url: PELAPORAN_PENYIMPANAN_GRAFIK_PATH,
                icon: <ArchiveBoxIcon className="size-4" />,
                roles: [RolesAccess.SUPER_ADMIN, RolesAccess.PIC_PELAPORAN],
            },
            {
                title: "Peta",
                url: PELAPORAN_DASHBOARD_PATH,
                icon: <ArchiveBoxIcon className="size-4" />,
                roles: [RolesAccess.SUPER_ADMIN, RolesAccess.PIC_PELAPORAN],
            }
            ]
        }
    ];

    const itemClasses = {
        base: "w-full",
        startContent: "text-primary",
        title: "text-small text-primary",
        indicator: "text-primary",
        content: "py-0",
        trigger: "px-4 py-3 data-[hover=true]:bg-primary/20 flex items-center data-[open=true]:bg-primary/20",
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsOpenSidebar(false);
            }
        };

        if (isOpenSidebar) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpenSidebar, setIsOpenSidebar, sidebarRef]);

    const filteredMenu = menuData
    .filter((menu) => menu?.roles?.some((role) => roles.includes(role))) // Filter menu utama
    .map((menu) => {
        if (menu.children) {
            return {
                ...menu,
                children: menu.children.filter((child) =>
                    child.roles?.some((role) => roles.includes(role))
                ),
            };
        }
        return menu;
    })
    .filter((menu) => !menu.children || menu.children.length > 0);

    return (
        <aside
            id="logo-sidebar"
            ref={sidebarRef}
            className={`fixed top-0 left-0 z-50 w-72 h-screen transition-transform shadow-md ${
                isOpenSidebar ? "lg:translate-x-0" : "-translate-x-full lg:translate-x-0"
            } bg-white`}
            aria-label="Sidebar"
        >
            <div className="h-full overflow-y-auto bg-white">
                <div className="px-5 py-4 flex items-center gap-2 shadow-md bg-white">
                    <Avatar src={logo} className="w-12 h-12" />
                    <div className="flex flex-col text-base leading-tight">
                        <span className="uppercase font-medium">Dirjen PPKL</span>
                        <span className="uppercase font-bold text-primary">MENLHK</span>
                    </div>
                </div>
                <ul className="py-4">
                    {filteredMenu.map((menu, index) =>
                        menu.children ? (
                            <Accordion
                                key={index}
                                showDivider={false}
                                className="px-0"
                                itemClasses={itemClasses}
                            >
                                <AccordionItem
                                    key={menu.key}
                                    title={menu.title}
                                    startContent={menu.icon}
                                >
                                    {menu.children.map((submenu, subIndex) => (
                                        <ListItem
                                            key={subIndex}
                                            url={submenu.url}
                                            variant="subitem"
                                            title={submenu.title}
                                            icon={submenu.icon}
                                        />
                                    ))}
                                </AccordionItem>
                            </Accordion>
                        ) : (
                            <ListItem
                                key={index}
                                url={menu.url}
                                title={menu.title}
                                icon={menu.icon}
                            />
                        )
                    )}
                </ul>
            </div>
        </aside>
    );
}
