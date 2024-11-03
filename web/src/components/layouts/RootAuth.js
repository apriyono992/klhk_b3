import { PhoneIcon, EnvelopeIcon, MapPinIcon } from "@heroicons/react/24/outline";
import banner from '../../assets/banner/bg-auth.png';
import { Toaster } from "react-hot-toast";

export default function RootAuth({ children }) {
    return (
        <>
            <Toaster
                toastOptions={{
                    duration: 5000,
                }}
            />
            <div className="fixed lg:hidden w-full h-1/3 bg-primary rounded-br-2xl rounded-bl-2xl"></div>
            <div className="hidden lg:flex flex-col fixed min-h-screen max-h-screen w-1/2 justify-between bg-default">
                <img alt="bg-login" className='w-full lg:w-1/2 object-cover fixed left-0 top-1/2 transform -translate-y-1/2 opacity-20' src={banner} />
                <div className="px-7 py-4 flex flex-wrap items-center gap-5 text-xs font-medium text-gray-600">
                    <div className="flex items-center gap-1">
                        <PhoneIcon className="size-3"/>
                        <span className="mt-0.5">021-8517183</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <EnvelopeIcon className="size-4"/>
                        <span className="mt-0.5">klhupt@gmail.com</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <MapPinIcon className="size-4"/>
                        <span className="mt-0.5">Jl. D.I. Panjaitan, Kebon Nanas, Jakarta 13410, Indonesia</span>
                    </div>
                </div>
                <div className="z-10 w-5/6 flex-col items-start px-10">
                    <h2 className="text-4xl font-extrabold text-primary pt-10">Kementrian Lingkungan Hidup dan Kehutanan</h2>
                    <p className="text-base mt-6 text-gray-700 uppercase font-medium">Mewujudkan pelayanan perizinan yang prima di bidang pengelolaan barang berbahaya dan beracun</p>
                </div>
                <div className="px-7 py-4 w-11/12 flex items-center gap-10 bg-white rounded-se-3xl">
                    <span className="flex items-center gap-1 text-xs font-medium text-gray-600">
                        Copyright © {new Date().getFullYear()} Kementerian Lingkungan Hidup dan Kehutanan RI - All right reserved
                    </span>
                </div>
            </div>
            <div className="w-full min-h-screen flex flex-col lg:flex-row justify-center bg-default lg:bg-white">
                <div className="w-full lg:w-1/2"></div>
                <div className="w-full lg:w-1/2 flex items-center justify-center">
                    { children }
                </div>
            </div>
        </>
    )
};
