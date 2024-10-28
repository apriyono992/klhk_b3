import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie'
import { DASHBOARD_PATH } from '../../services/routes';

export default function RouteGuest() {
    const location = useLocation()
    if (Cookies.get('accessToken')) return (<Navigate to={DASHBOARD_PATH} state={{ from: location }} replace />);
    return (<Outlet/>);
}

