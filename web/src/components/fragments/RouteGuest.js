import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie'

export default function RouteGuest() {
    const location = useLocation()
    if (Cookies.get('accessToken')) return (<Navigate to="/admin/dasbor" state={{ from: location }} replace />);
    return (<Outlet/>);
}

