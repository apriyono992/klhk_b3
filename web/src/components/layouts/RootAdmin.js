
import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import Header from '../fragments/admin/Header';
import Sidebar from '../fragments/admin/Sidebar';

export default function RootAdmin({ children }) {
    const [isOpenSidebar, setIsOpenSidebar] = useState(false);

    function handleOpenSidebar() {
        setIsOpenSidebar(!isOpenSidebar);
    }

    useEffect(() => {
        const axiosError = (event) => toast.error(`Error response : ${event.detail}`);
        window.addEventListener('axiosError', axiosError);
    
        return () => {
            window.removeEventListener('axiosError', axiosError);
        };
    }, []);
    

    return (
        <>
            <Toaster/>

            <Sidebar isOpenSidebar={isOpenSidebar} setIsOpenSidebar={setIsOpenSidebar} />
            <Header onOpenSidebar={handleOpenSidebar} />

            <div className="min-h-screen px-4 py-20 lg:ml-72 bg-default">
                { children }
            </div>
        </>
    )
};
