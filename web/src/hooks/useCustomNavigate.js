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
        "6": pathname.startsWith("/admin/gudang/stok-b3") || pathname.startsWith("/gudang/stok-b3"),
        "7": pathname.startsWith('/admin/cms'),
        "8": pathname.startsWith("/admin/merkuri"),
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
    
    const getReportTransportVehicle = (applicationId, periodId) => navigate(`/pelaporan/pengangkutan-b3/rekomendasi/daftar/${applicationId}/${periodId}`)
    const getReportTransportVehicleDetail = (periodeId) => navigate(`/pelaporan/pengangkutan-b3/kendaraan/daftar/${periodeId}`) 
    const getAdminReportTransportVehicleDetail = (periodeId) => navigate(`/admin/pelaporan/pengangkutan-b3/daftar/${periodeId}`) 
    const createReportTransportVehicle = (periodeId) => navigate(`/pelaporan/pengangkutan-b3/kendaraan/tambah/${periodeId}`)
    const editReportTransportVehicle = (id) => navigate(`/pelaporan/pengangkutan-b3/kendaraan/ubah/${id}`)

    const getCompanyReportDistributionDetail = (id) => navigate(`/pelaporan/bahan-b3/distribusi/daftar/${id}`)
    const editCompanyReportDistribution = (id) => navigate(`/pelaporan/bahan-b3/distribusi/ubah/${id}`)
    const getAdminReportDistributionDetail = (id) => navigate(`/admin/pelaporan/bahan-b3/distribusi/daftar/${id}`)

    return {
        getRegistrationDetailPath,
        getRecomendationDetailPath,
        getNotificationDetailPath,
        getNotificationImportVerificationDraftPath,
        getNotificationImportApprovalDraftPath,
        getNotificationImportEcDraftPath,
        getAdminStorageDetailPath,
        getCompanyStorageDetailPath,
        getReportTransportVehicle,
        getReportTransportVehicleDetail,
        getAdminReportTransportVehicleDetail,
        createReportTransportVehicle,
        editReportTransportVehicle,
        getCompanyReportDistributionDetail,
        editCompanyReportDistribution,
        getAdminReportDistributionDetail,
        getCurrentRouteGroup 
    };
}
