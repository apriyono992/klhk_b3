import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie'

export default function RouteGuard() {
    const location = useLocation()
    if (!Cookies.get('accessToken')) return (<Navigate to="/login" state={{ from: location }} replace />);
    return (<Outlet/>);
}
