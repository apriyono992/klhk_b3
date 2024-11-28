import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import RequestPasswordResetPage from "../pages/auth/RequestPasswordResetPage";
import PasswordResetPage from "../pages/auth/PasswordResetPage";
import DashboardPage from "../pages/admin/DashboardPage";
import RouteGuest from "../components/fragments/RouteGuest";
import {AuthProvider, AuthContext } from "../contexts/AuthContext";
import RegistrationIndexPage from "../pages/admin/registration/IndexPage";
import RegistrationDashboardPage from "../pages/admin/registration/DashboardPage";
import RegistrationDetailPage from "../pages/admin/registration/DetailPage";
import RecomendationDashboardPage from "../pages/admin/recomendation/DashboardPage";
import RecomendationIndexPage from "../pages/admin/recomendation/IndexPage";
import RecomendationDetailPage from "../pages/admin/recomendation/DetailPage";
import NotificationDashboardPage from "../pages/admin/notification/DashboardPage";
import NotificationIndexPage from "../pages/admin/notification/IndexPage";
import NotificationDetailPage from "../pages/admin/notification/DetailPage";
import NotificationImportVerficationDraftPage from "../pages/admin/notification/ImportVerficationDraftPage";
import NotificationImportApprovalDraftPage from "../pages/admin/notification/ImportApprovalDraftPage";
import NotificationImportEcDraftPage from "../pages/admin/notification/ImportEcDraftPage";
import CompanyReportStorageIndexPage from "../pages/admin/report/storage/company/IndexPage";
import CompanyReportStorageDetailPage from "../pages/admin/report/storage/company/DetailPage";
import AdminReportStorageIndexPage from "../pages/admin/report/storage/admin/IndexPage";
import AdminReportStorageDetailPage from "../pages/admin/report/storage/admin/DetailPage";
import CompanyReportTransportIndexPage from "../pages/admin/report/transport/company/IndexPage";
import CompanyReportTransportCreatePage from "../pages/admin/report/transport/company/CreatePage";
import CarbonCopyIndexPage from "../pages/admin/carbon-copy/IndexPage";
import MaterialIndexPage from "../pages/admin/material/IndexPage";
import OfficialIndexPage from "../pages/admin/official/IndexPage";
import HomePage from "../pages/landing-page/home";
import BeritaPage from "../pages/landing-page/berita";
import ArticlePage from "../pages/landing-page/article";
import CompanyIndexPage from "../pages/admin/company/IndexPage";
import PeriodIndexPage from "../pages/admin/period/IndexPage";
import NewsIndexPage from '../pages/admin/cms/news/IndexPage'
import ArticleIndexPage from '../pages/admin/cms/article/IndexPage'
import DocumentIndexPage from '../pages/admin/cms/document/IndexPage'
import EventIndexPage from '../pages/admin/cms/event/IndexPage'
import PelaporanDashboard from "../pages/admin/report/PelaporanDashboard";
import IndexAdminStokB3 from "../pages/admin/stokB3/admin/IndexPage";
import IndexUserStokB3 from "../pages/admin/stokB3/user/IndexPage";

import MercuryMonitoringLandingPage from "../pages/landing-page/mercuryMonitoring";
import WilayahPertambanganRakyat from "../pages/admin/wpr/IndexPage";
import MercuryMonitoringIndex from "../pages/admin/merkuri/IndexPage";
import UnauthorizedPage from "../pages/admin/UnauthorizedPage";
import ProtectedRoute from "../services/protectedRoute";
import UserManagementPage from "../pages/admin/users/IndexPage";
import ProdusenPencarian from "../pages/admin/report/produsen/ProdusenPencarian";
import ProdusenGrafik from "../pages/admin/report/produsen/ProdusenGrafik";

import PenggunaanGrafik from "../pages/admin/report/use/graph/IndexPage";
import PenggunaanPencarian from "../pages/admin/report/use/filter/IndexPage";


export const ROOT_PATH = '/'
export const BERITA_PATH = '/berita'
export const ARTICLE_PATH = '/artikel'
export const MONITORING_MERCURY_PATH = '/pemantauan-merkuri'

export const LOGIN_PATH = '/masuk'
export const REGISTER_PATH = '/daftar'
export const FORGOT_PASSWORD_PATH = '/lupa-sandi/formulir'
export const RESET_PASSWORD_PATH = '/lupa-sandi/atur-ulang'

export const DASHBOARD_PATH = '/admin/dasbor'
export const PELAPORAN_DASHBOARD_PATH = '/admin/dasbor/pelaporan'

export const PELAPORAN_PENGGUNAAN_GRAFIK = '/admin/pelaporan/penggunaan/grafik'
export const PELAPORAN_PENGGUNAAN_PENCARIAN = '/admin/pelaporan/penggunaan/pencarian'

export const REGISTRATION_DASHBOARD_PATH = '/admin/registrasi-b3/dasbor'
export const REGISTRATION_INDEX_PATH = '/admin/registrasi-b3/daftar'
export const REGISTRATION_DETAIL_PATH = '/admin/registrasi-b3/daftar/:id'

export const RECOMENDATION_DASHBOARD_PATH = '/admin/rekomendasi-b3/dasbor'
export const RECOMENDATION_INDEX_PATH = '/admin/rekomendasi-b3/daftar'
export const RECOMENDATION_CREATE_PATH = '/admin/rekomendasi-b3/tambah'
export const RECOMENDATION_DETAIL_PATH = '/admin/rekomendasi-b3/daftar/:id'

export const NOTIFICATION_DASHBOARD_PATH = '/admin/notifikasi/dasbor'
export const NOTIFICATION_INDEX_PATH = '/admin/notifikasi/daftar'
export const NOTIFICATION_DETAIL_PATH = '/admin/notifikasi/daftar/:id'
export const NOTIFICATION_IMPORT_VERIFICATION_PATH = '/admin/notifikasi/draft-surat-kebenaran-impor/:notificationId'
export const NOTIFICATION_IMPORT_APPROVAL_PATH = '/admin/notifikasi/draft-surat-persetujuan-impor/:notificationId'
export const NOTIFICATION_IMPORT_EC_PATH = '/admin/notifikasi/draft-surat-explicit-consent/:notificationId'

export const ADMIN_REPORT_STORAGE = '/admin/pelaporan/penyimpanan-b3/daftar'
export const ADMIN_REPORT_STORAGE_DETAIL = '/admin/pelaporan/penyimpanan-b3/daftar/:id'
export const COMPANY_REPORT_STORAGE = '/pelaporan/penyimpanan-b3/daftar'
export const COMPANY_REPORT_STORAGE_DETAIL = '/pelaporan/penyimpanan-b3/daftar/:id'

export const REPORT_TRANSPORT_INDEX = '/admin/pelaporan/pengangkutan-b3/daftar'
export const REPORT_TRANSPORT_CREATE = '/pelaporan/pengangkutan-b3/buat/:applicationId'

export const REPORT_PRODUCER_INDEX = '/admin/pelaporan/produsen-b3'
export const PELAPORAN_PRODUSEN_PENCARIAN = '/admin/pelaporan/produsen-b3/pencarian'
export const PELAPORAN_PRODUSEN_GRAFIK = '/admin/pelaporan/produsen-b3/grafik'

export const CARBON_COPY_INDEX_PATH = '/admin/utama/tembusan'
export const MATERIAL_INDEX_PATH = '/admin/utama/bahan-b3'
export const OFFICIAL_INDEX_PATH = '/admin/utama/pejabat'
export const COMPANY_INDEX_PATH = '/admin/utama/perusahaan'
export const PERIOD_INDEX_PATH = '/admin/utama/periode'
export const WPR_INDEX_PATH = '/admin/utama/wpr'
export const MERKURI_MONITORING_INDEX_PATH = '/admin/utama/merkuri-monitoring'

export const CMS_NEWS_PATH = '/admin/cms/berita'
export const CMS_ARTICLE_PATH = '/admin/cms/artikel'
export const CMS_DOCUMENT_PATH = '/admin/cms/dokumen'
export const CMS_EVENT_PATH = '/admin/cms/event'

export const STOK_B3_INDEX_ADMIN_PATH = '/admin/utama/stok-b3'
export const STOK_B3_INDEX_USER_PATH = '/user/utama/stok-b3'

export const UNAUTHORIZED_PATH = '/unauthorized'

export const USERS_MANAGEMENT_INDEX_PATH = '/admin/user-management'

const router = createBrowserRouter([
    { path: "/", element: <HomePage/>,},
    { path: BERITA_PATH, element: <BeritaPage/>,},
    { path: ARTICLE_PATH, element: <ArticlePage/>,},
    { path: MONITORING_MERCURY_PATH, element: <MercuryMonitoringLandingPage/>,},
    {
        element: <RouteGuest />,
        children: [
            { path: LOGIN_PATH, element: <LoginPage /> },
            { path: REGISTER_PATH, element: <RegisterPage /> },
            { path: FORGOT_PASSWORD_PATH, element: <RequestPasswordResetPage /> },
            { path: RESET_PASSWORD_PATH, element: <PasswordResetPage /> },
        ],
    },
    {
        element: <AuthProvider />,
        children: [
            { path: UNAUTHORIZED_PATH, element: <UnauthorizedPage /> },
            { path: DASHBOARD_PATH, element: <ProtectedRoute allowedRoles={["Admin"]}><DashboardPage /></ProtectedRoute>  },

            { path: REGISTRATION_DASHBOARD_PATH, element: <RegistrationDashboardPage /> },
            { path: REGISTRATION_INDEX_PATH, element: <RegistrationIndexPage /> },
            { path: REGISTRATION_DETAIL_PATH, element: <RegistrationDetailPage /> },

            { path: RECOMENDATION_DASHBOARD_PATH, element: <RecomendationDashboardPage /> },
            { path: RECOMENDATION_INDEX_PATH, element: <RecomendationIndexPage /> },
            { path: RECOMENDATION_DETAIL_PATH, element: <RecomendationDetailPage /> },

            { path: NOTIFICATION_DASHBOARD_PATH, element: <NotificationDashboardPage /> },
            { path: NOTIFICATION_INDEX_PATH, element: <NotificationIndexPage /> },
            { path: NOTIFICATION_DETAIL_PATH, element: <NotificationDetailPage /> },
            { path: NOTIFICATION_IMPORT_VERIFICATION_PATH, element: <NotificationImportVerficationDraftPage /> },

            { path: NOTIFICATION_DASHBOARD_PATH, element: <NotificationDashboardPage />,},
            { path: NOTIFICATION_INDEX_PATH, element: <NotificationIndexPage />,},
            { path: NOTIFICATION_DETAIL_PATH, element: <NotificationDetailPage />,},
            { path: NOTIFICATION_IMPORT_VERIFICATION_PATH, element: <NotificationImportVerficationDraftPage />,},
            { path: NOTIFICATION_IMPORT_APPROVAL_PATH, element: <NotificationImportApprovalDraftPage />,},
            { path: NOTIFICATION_IMPORT_EC_PATH, element: <NotificationImportEcDraftPage />,},

            { path: COMPANY_REPORT_STORAGE, element: <CompanyReportStorageIndexPage />,},
            { path: COMPANY_REPORT_STORAGE_DETAIL, element: <CompanyReportStorageDetailPage />,},
            { path: ADMIN_REPORT_STORAGE, element: <AdminReportStorageIndexPage/>,},
            { path: ADMIN_REPORT_STORAGE_DETAIL, element: <AdminReportStorageDetailPage/>,},

            { path: REPORT_TRANSPORT_INDEX, element: <CompanyReportTransportIndexPage />},
            { path: REPORT_TRANSPORT_CREATE, element: <CompanyReportTransportCreatePage />},

            { path: CARBON_COPY_INDEX_PATH, element: <CarbonCopyIndexPage />, },
            { path: OFFICIAL_INDEX_PATH, element: <OfficialIndexPage />,},
            { path: MATERIAL_INDEX_PATH, element: <MaterialIndexPage />,},
            { path: COMPANY_INDEX_PATH, element: <CompanyIndexPage />,},
            { path: PERIOD_INDEX_PATH, element: <PeriodIndexPage />,},
  
            { path: CMS_NEWS_PATH, element: <NewsIndexPage /> },
            { path: CMS_ARTICLE_PATH, element: <ArticleIndexPage /> },
            { path: CMS_DOCUMENT_PATH, element: <DocumentIndexPage /> },
            { path: CMS_EVENT_PATH, element: <EventIndexPage /> },

            { path: PELAPORAN_DASHBOARD_PATH, element: <PelaporanDashboard />, },

            { path: PELAPORAN_PRODUSEN_PENCARIAN, element: <ProdusenPencarian />, },
            { path: PELAPORAN_PRODUSEN_GRAFIK, element: <ProdusenGrafik />, },

            { path: PELAPORAN_PENGGUNAAN_GRAFIK, element: <PenggunaanGrafik />, },
            { path: PELAPORAN_PENGGUNAAN_PENCARIAN, element: <PenggunaanPencarian />, },


            { path: STOK_B3_INDEX_ADMIN_PATH, element: <IndexAdminStokB3 />, },
            { path: STOK_B3_INDEX_USER_PATH, element: <IndexUserStokB3 />, },

            { path: WPR_INDEX_PATH, element: <WilayahPertambanganRakyat />,},
            { path: MERKURI_MONITORING_INDEX_PATH, element: < MercuryMonitoringIndex/>,},

            { path: USERS_MANAGEMENT_INDEX_PATH, element: < UserManagementPage/>,},
        ],
    },
])

export default router
