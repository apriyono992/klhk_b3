
import { useCallback, useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import Header from '../fragments/admin/Header';
import Sidebar from '../fragments/admin/Sidebar';

export default function RootAdmin({ children }) {
    const [isOpenSidebar, setIsOpenSidebar] = useState(false);

    const handleOpenSidebar = useCallback(() => {
        setIsOpenSidebar((prev) => !prev);
    }, []);

    return (
        <>
            <Toaster
                toastOptions={{
                    duration: 5000,
                }}
            />

            <Sidebar isOpenSidebar={isOpenSidebar} setIsOpenSidebar={setIsOpenSidebar} />
            <Header onOpenSidebar={handleOpenSidebar} />

            <div className="min-h-screen px-4 py-20 lg:ml-72 bg-default">
                { children }
            </div>
        </>
    )
};
