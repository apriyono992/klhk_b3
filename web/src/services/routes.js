import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import RequestPasswordResetPage from "../pages/auth/RequestPasswordResetPage";
import PasswordResetPage from "../pages/auth/PasswordResetPage";
import DashboardPage from "../pages/admin/DashboardPage";
import RouteGuest from "../components/fragments/RouteGuest";
import AuthProvider from "../contexts/AuthContext";
import RegistrationIndexPage from "../pages/admin/registration/IndexPage";
import RegistrationDetailPage from "../pages/admin/registration/DetailPage";
import RecomendationIndexPage from "../pages/admin/recomendation/IndexPage";
import RecomendationCreatePage from "../pages/admin/recomendation/CreatePage";
import CarbonCopyIndexPage from "../pages/admin/carbon-copy/IndexPage";
import MaterialIndexPage from "../pages/admin/material/IndexPage";
import OfficialIndexPage from "../pages/admin/official/IndexPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <div className='min-h-screen'>Halaman Landing Page</div>,
    },
    {
        element: <RouteGuest />,
        children: [
            {
                path: "/masuk",
                element: <LoginPage />,
            },
            {
                path: "/daftar",
                element: <RegisterPage />,
            },
            {
                path: "/lupa-sandi/formulir",
                element: <RequestPasswordResetPage />,
            },
            {
                path: "/lupa-sandi/atur-ulang",
                element: <PasswordResetPage />,
            },
        ],
    },
    {
        element: <AuthProvider />,
        children: [
            {
                path: "/admin/dasbor",
                element: <DashboardPage />,
            },
            {
                path: "/admin/registrasi-b3",
                element: <RegistrationIndexPage />,
            },
            {
                path: "/admin/registrasi-b3/:id",
                element: <RegistrationDetailPage />,
            },
            {
                path: "/admin/rekomendasi-b3",
                element: <RecomendationIndexPage />,
            },
            {
                path: "/admin/rekomendasi-b3/tambah",
                element: <RecomendationCreatePage />,
            },
            {
                path: "/admin/utama/tembusan",
                element: <CarbonCopyIndexPage />,
            },
            {
                path: "/admin/utama/pejabat",
                element: <OfficialIndexPage />,
            },
            {
                path: "/admin/utama/bahan-b3",
                element: <MaterialIndexPage />,
            },
            
        ],
    },
]);

export default router