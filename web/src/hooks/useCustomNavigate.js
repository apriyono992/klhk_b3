import { useLocation, useNavigate } from 'react-router-dom'

export default function useCustomNavigate() {
    const navigate = useNavigate()
    const { pathname } = useLocation()

    const routeGroup = {
        "1": pathname.startsWith("/admin/registrasi-b3"),
        "2": pathname.startsWith("/admin/rekomendasi-b3"),
        "3": pathname.startsWith("/admin/notifikasi"),
        "4": pathname.startsWith("/admin/pelaporan") || pathname.startsWith("/pelaporan"),
        "5": pathname.startsWith("/admin/utama"),
        "6": pathname.startsWith('/admin/cms'),
    };

    const getCurrentRouteGroup = () => Object.keys(routeGroup).filter(key => routeGroup[key])
    
    const getRegistrationDetailPath = (id) => navigate(`/admin/registrasi-b3/daftar/${id}`);
    const getRecomendationDetailPath = (id) => navigate(`/admin/rekomendasi-b3/daftar/${id}`);
    const getNotificationDetailPath = (id) => navigate(`/admin/notifikasi/daftar/${id}`);
    const getNotificationImportVerificationDraftPath = (notificationId) => navigate(`/admin/notifikasi/draft-surat-kebenaran-impor/${notificationId}`);
    const getNotificationImportApprovalDraftPath = (notificationId) => navigate(`/admin/notifikasi/draft-surat-persetujuan-impor/${notificationId}`);
    const getNotificationImportEcDraftPath = (notificationId) => navigate(`/admin/notifikasi/draft-surat-explicit-consent/${notificationId}`);
    const getAdminStorageDetailPath = (id) => navigate(`/admin/pelaporan/penyimpanan-b3/daftar/${id}`);
    const getCompanyStorageDetailPath = (id) => navigate(`/pelaporan/penyimpanan-b3/daftar/${id}`);

    return {
        getRegistrationDetailPath,
        getRecomendationDetailPath,
        getNotificationDetailPath,
        getNotificationImportVerificationDraftPath,
        getNotificationImportApprovalDraftPath,
        getNotificationImportEcDraftPath,
        getAdminStorageDetailPath,
        getCompanyStorageDetailPath,
        getCurrentRouteGroup 
    };
}
