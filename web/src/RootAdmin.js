import { Outlet } from "react-router-dom";
import Sidebar from "./components/fragments/admin/Sidebar";
import React from "react";
import Header from "./components/fragments/admin/Header";
import Footer from "./components/fragments/admin/Footer";


export default function RootAdmin() {
    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content bg-default">
                <div className="flex flex-col justify-between min-h-screen">
                    <Header />

                    <div className="w-full flex-1 p-5">
                        <Outlet/>
                    </div>

                    <Footer />
                </div>
            </div>
            <div className="z-50 drawer-side">
                <label htmlFor="my-drawer" className="drawer-overlay"></label>
                <Sidebar/>
            </div>
        </div>
    )
};
