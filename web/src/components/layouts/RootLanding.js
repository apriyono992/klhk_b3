
import { useCallback, useEffect, useState } from "react";
import HeaderLanding from "../fragments/landing/Header";

export default function RootAdmin({ children }) {
    const [isOpenSidebar, setIsOpenSidebar] = useState(false);

    const handleOpenSidebar = useCallback(() => {
        setIsOpenSidebar(true);
    }, []);
    

    return (
        <>
            <HeaderLanding onOpenSidebar={handleOpenSidebar} />

            <div className="min-h-screen pt-20 bg-default">
                { children }
            </div>
        </>
    )
};
