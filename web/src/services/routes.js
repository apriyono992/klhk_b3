import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import RequestPasswordResetPage from "../pages/auth/RequestPasswordResetPage";
import PasswordResetPage from "../pages/auth/PasswordResetPage";
import DashboardPage from "../pages/admin/DashboardPage";
import RouteGuest from "../components/fragments/RouteGuest";
import RouteGuard from "../components/fragments/RouteGuard";
import AuthProvider from "../contexts/AuthContext";

const router = createBrowserRouter([
    {
        path: "/",
        element: <div className='min-h-screen'>Halaman Landing Page</div>,
    },
    {
        element: <RouteGuest />,
        children: [
            {
                path: "/login",
                element: <LoginPage />,
            },
            {
                path: "/register",
                element: <RegisterPage />,
            },
            {
                path: "/forgot-password/request",
                element: <RequestPasswordResetPage />,
            },
            {
                path: "/forgot-password/reset",
                element: <PasswordResetPage />,
            },
        ],
    },
    {
        element: <RouteGuard />,
        children: [
            {
                element: <AuthProvider />,
                children: [
                    {
                        path: "/admin/dashboard",
                        element: <DashboardPage />,
                    },
                ],
            },
        ],
    },
]);

export default router