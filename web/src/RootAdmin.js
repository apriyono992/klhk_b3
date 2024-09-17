import Sidebar from "./components/fragments/admin/Sidebar";
import React from "react";
import Header from "./components/fragments/admin/Header";
import Footer from "./components/fragments/admin/Footer";


export default function RootAdmin({ children }) {
    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content bg-default">
                <div className="flex flex-col justify-between min-h-screen">
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
