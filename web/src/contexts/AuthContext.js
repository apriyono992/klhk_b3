import { createContext } from "react";
import { fetchUserLogin } from "../services/api";
import useSWR from 'swr';
import Cookies from 'js-cookie'
import { Navigate, Outlet, useLocation } from "react-router-dom";

export const AuthContext = createContext();

export default function AuthProvider() {
    const location = useLocation()
    const fetcher = (...args) => fetchUserLogin(...args)
    const { data, isLoading, error } = useSWR('/auth/me', fetcher)
    
    if (error) {
        const axiosError = new CustomEvent('axiosError', { detail: error.response.statusText });
        window.dispatchEvent(axiosError)
    }

    return (
        <AuthContext.Provider value={{ data, isLoading }}>
            {
                !Cookies.get('accessToken') 
                    ? <Navigate to="/masuk" state={{ from: location }} replace />
                    : <Outlet/>
            }
        </AuthContext.Provider>
    )
}
