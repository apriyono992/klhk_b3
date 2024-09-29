import Sidebar from "./components/fragments/admin/Sidebar";
import React, { useEffect } from "react";
import Header from "./components/fragments/admin/Header";
import Footer from "./components/fragments/admin/Footer";
import toast, { Toaster } from 'react-hot-toast';

export default function RootAdmin({ children }) {
    useEffect(() => {
        const axiosError = (event) => toast.error(`Error response : ${event.detail}`);
        window.addEventListener('axiosError', axiosError);
    
        return () => {
            window.removeEventListener('axiosError', axiosError);
        };
    }, []);
    

    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content bg-default">
                <div className="flex flex-col justify-between min-h-screen">
                    <Toaster position="top-right" reverseOrder={false} />
                    <Header />

                    <div className="w-full flex-1 p-5">
                        { children }
                    </div>

                    <Footer />
                </div>
            </div>
            
            <Sidebar/>
        </div>
    )
};
