import { createContext } from "react";
import Cookies from 'js-cookie';
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { LOGIN_PATH } from "../services/routes";
import { jwtDecode } from "jwt-decode"; // Pastikan import jwtDecode tidak menggunakan destructure

export const AuthContext = createContext();

export default function AuthProvider() {
    const location = useLocation();
    const jwtToken = Cookies.get('accessToken');
    let data = null;

    // Validasi token sebelum decode
    if (jwtToken && jwtToken.split('.').length === 3) {
        try {
            data = jwtDecode(jwtToken);
        } catch (error) {
            console.error("Failed to decode token:", error);
            data = null;
        }
    }

    // Jika tidak ada token atau gagal decode, arahkan ke halaman login
    if (!data) {
        return <Navigate to={LOGIN_PATH} state={{ from: location }} replace />;
    }

    return (
        <AuthContext.Provider value={{ data }}>
            <Outlet />
        </AuthContext.Provider>
    );
}
