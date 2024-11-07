import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import RequestPasswordResetPage from "../pages/auth/RequestPasswordResetPage";
import PasswordResetPage from "../pages/auth/PasswordResetPage";
import DashboardPage from "../pages/admin/DashboardPage";
import RouteGuest from "../components/fragments/RouteGuest";
import AuthProvider from "../contexts/AuthContext";
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
import CarbonCopyIndexPage from "../pages/admin/carbon-copy/IndexPage";
import MaterialIndexPage from "../pages/admin/material/IndexPage";
import OfficialIndexPage from "../pages/admin/official/IndexPage";
import HomePage from "../pages/landing-page/home";
import BeritaPage from "../pages/landing-page/berita";
import ArticlePage from "../pages/landing-page/article";
import CompanyIndexPage from "../pages/admin/company/IndexPage";

export const ROOT_PATH = '/'
export const BERITA_PATH = '/berita'
export const ARTICLE_PATH = '/artikel'

export const LOGIN_PATH = '/masuk'
export const REGISTER_PATH = '/daftar'
export const FORGOT_PASSWORD_PATH = '/lupa-sandi/formulir'
export const RESET_PASSWORD_PATH = '/lupa-sandi/atur-ulang'

export const DASHBOARD_PATH = '/admin/dasbor'

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
export const NOTIFICATION_IMPORT_VERIFICATION_PATH = '/admin/notifikasi/draft-surat-kebenaran-impor/:id'

export const CARBON_COPY_INDEX_PATH = '/admin/utama/tembusan'
export const MATERIAL_INDEX_PATH = '/admin/utama/bahan-b3'
export const OFFICIAL_INDEX_PATH = '/admin/utama/pejabat'
export const COMPANY_INDEX_PATH = '/admin/utama/perusahaan'

const router = createBrowserRouter([
    { path: "/", element: <HomePage/>,},
    { path: BERITA_PATH, element: <BeritaPage/>,},
    { path: ARTICLE_PATH, element: <ArticlePage/>,},
    {
        element: <RouteGuest />,
        children: [
            { path: LOGIN_PATH, element: <LoginPage />, },
            { path: REGISTER_PATH, element: <RegisterPage />,},
            { path: FORGOT_PASSWORD_PATH, element: <RequestPasswordResetPage />,},
            { path: RESET_PASSWORD_PATH, element: <PasswordResetPage />,},
        ],
    },
    {
        element: <AuthProvider />,
        children: [
            { path: DASHBOARD_PATH, element: <DashboardPage />, },

            { path: REGISTRATION_DASHBOARD_PATH, element: <RegistrationDashboardPage />, },
            { path: REGISTRATION_INDEX_PATH, element: <RegistrationIndexPage />,},
            { path: REGISTRATION_DETAIL_PATH, element: <RegistrationDetailPage />,},

            { path: RECOMENDATION_DASHBOARD_PATH, element: <RecomendationDashboardPage />,},
            { path: RECOMENDATION_INDEX_PATH, element: <RecomendationIndexPage />,},
            { path: RECOMENDATION_DETAIL_PATH, element: <RecomendationDetailPage />,},

            { path: NOTIFICATION_DASHBOARD_PATH, element: <NotificationDashboardPage />,},
            { path: NOTIFICATION_INDEX_PATH, element: <NotificationIndexPage />,},
            { path: NOTIFICATION_DETAIL_PATH, element: <NotificationDetailPage />,},
            { path: NOTIFICATION_IMPORT_VERIFICATION_PATH, element: <NotificationImportVerficationDraftPage />,},

            { path: CARBON_COPY_INDEX_PATH, element: <CarbonCopyIndexPage />, },
            { path: OFFICIAL_INDEX_PATH, element: <OfficialIndexPage />,},
            { path: MATERIAL_INDEX_PATH, element: <MaterialIndexPage />,},
            { path: COMPANY_INDEX_PATH, element: <CompanyIndexPage />,},
            
        ],
    },
]);

export default router