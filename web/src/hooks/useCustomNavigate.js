import { useLocation, useNavigate } from "react-router-dom";

export default function useCustomNavigate() {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    
    const routeGroup = {
        "1": pathname.startsWith("/admin/registrasi-b3"),
        "2": pathname.startsWith("/admin/rekomendasi-b3"),
        "3": pathname.startsWith("/admin/notifikasi"),
        "4": pathname.startsWith("/admin/utama"),
    };

    const getCurrentRouteGroup = () => Object.keys(routeGroup).filter(key => routeGroup[key])
    
    const getRegistrationDetailPath = (id) => navigate(`/admin/registrasi-b3/daftar/${id}`);
    const getRecomendationDetailPath = (id) => navigate(`/admin/rekomendasi-b3/daftar/${id}`);
    const getNotificationDetailPath = (id) => navigate(`/admin/notifikasi/daftar/${id}`);

    return { 
        getRegistrationDetailPath, 
        getRecomendationDetailPath, 
        getNotificationDetailPath,
        getCurrentRouteGroup 
    };
}