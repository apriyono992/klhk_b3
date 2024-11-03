import { createContext } from "react";
import Cookies from 'js-cookie'
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { LOGIN_PATH } from "../services/routes";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export default function AuthProvider() {
    const location = useLocation()
    const jwtToken = Cookies.get('accessToken')
    const data = jwtDecode(jwtToken)

    return (
        <AuthContext.Provider value={{ data }}>
            {
                !Cookies.get('accessToken') 
                    ? <Navigate to={LOGIN_PATH} state={{ from: location }} replace />
                    : <Outlet/>
            }
        </AuthContext.Provider>
    )
}
