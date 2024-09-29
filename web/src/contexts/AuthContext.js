import { createContext } from "react";
import { fetchUserLogin } from "../services/api";
import useSWR from 'swr';
import { Outlet } from "react-router-dom";

export const AuthContext = createContext();

export default function AuthProvider() {

    const fetcher = (...args) => fetchUserLogin(...args)
    const { data, isLoading, error } = useSWR('/auth/me', fetcher)
    
    if (error) {
        const axiosError = new CustomEvent('axiosError', { detail: error.response.statusText });
        window.dispatchEvent(axiosError)
    }

    return (
        <AuthContext.Provider value={{ data, isLoading }}>
            <Outlet/>
        </AuthContext.Provider>
    )
}
