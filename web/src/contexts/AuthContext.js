import { createContext } from "react";
import { authStateFetcher } from "../services/api";
import useSWR from 'swr';
import Cookies from 'js-cookie'
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { LOGIN_PATH } from "../services/routes";

export const AuthContext = createContext();

export default function AuthProvider() {
    const location = useLocation()
    const fetcher = (...args) => authStateFetcher(...args)
    const { data, isLoading, error } = useSWR('/auth/me', fetcher, { revalidateOnFocus: true})
    
    if (error) {
        const axiosError = new CustomEvent('axiosError', { detail: error.response.statusText });
        window.dispatchEvent(axiosError)
    }

    return (
        <AuthContext.Provider value={{ data, isLoading }}>
            {
                !Cookies.get('accessToken') 
                    ? <Navigate to={LOGIN_PATH} state={{ from: location }} replace />
                    : <Outlet/>
            }
        </AuthContext.Provider>
    )
}
