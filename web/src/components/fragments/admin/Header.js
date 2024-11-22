import { 
    UserIcon, 
    Bars3BottomLeftIcon,
    ArrowLeftStartOnRectangleIcon,
    HomeIcon
} from '@heroicons/react/24/outline';
import { 
    Dropdown, 
    DropdownTrigger, 
    DropdownMenu, 
    DropdownItem, 
    Button,
    User,
    Breadcrumbs,
    BreadcrumbItem,
} from "@nextui-org/react";
import useAuth from "../../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'
import { LOGIN_PATH } from "../../../services/routes";
import { removeSlug } from '../../../services/helpers';

export default function Header({ onOpenSidebar }) {
    const { user, roles } = useAuth()
    const navigate = useNavigate();
    const location = useLocation();

    function handleLogout() {
        Cookies.remove('accessToken')
        Cookies.remove('refreshToken')
        Cookies.remove('sessionExpire')
        return navigate(LOGIN_PATH, { replace: true })
    }


    return (
        <nav className="w-full fixed top-0 z-40 lg:pl-72 bg-default">
            <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center justify-start gap-5">
                    <Button onPress={ onOpenSidebar } isIconOnly color="primary" variant="flat" className="lg:hidden">
                        <Bars3BottomLeftIcon className="size-5" />
                    </Button>    
                    <Breadcrumbs className="capitalize" color="secondary" isDisabled>
                        <BreadcrumbItem><HomeIcon className="size-4 mb-0.5" /></BreadcrumbItem>
                        {
                            location.pathname.split('/').filter(path => path !== '' && path !== 'admin').map((path) => (
                                <BreadcrumbItem key={path}>{removeSlug(path)}</BreadcrumbItem>
                            ))
                        }
                    </Breadcrumbs>
                </div>
                <Dropdown placement="bottom-start">
                    <DropdownTrigger>
                        <User 
                            as="button" 
                            name={`${user.fullName}`}
                            description="User"
                            avatarProps={{
                                src: `https://ui-avatars.com/api/?name=${user.fullName}`
                            }}
                        />
                    </DropdownTrigger>
                    <DropdownMenu variant="faded">
                        <DropdownItem key="settings" startContent={<UserIcon className="size-4" />}>Profile</DropdownItem>
                        <DropdownItem key="logout" startContent={<ArrowLeftStartOnRectangleIcon className="size-4" />}><button onClick={handleLogout}>Logout</button></DropdownItem>
                    </DropdownMenu>
                </Dropdown>  
            </div>
        </nav>
    )
}
