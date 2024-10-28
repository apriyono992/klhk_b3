import { Link } from "react-router-dom";
import RootAuth from "../../components/layouts/RootAuth";
import { Button, Input } from "@nextui-org/react";
import { ArrowLeftIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import logo from '../../assets/images/logo.png';
import { LOGIN_PATH } from "../../services/routes";

export default function RequestPasswordResetPage() {
    return (
        <RootAuth>
            <div className="relative w-full flex flex-col p-5 md:p-24 m-5 lg:m-0 bg-white shadow-md lg:shadow-none rounded-xl lg:rounded-none">
                <div className="text-center lg:text-start">
                    <img src={logo} alt="Logo" className="size-20 mx-auto lg:mx-0"/>
                    <h3 className="font-bold text-2xl mt-5">Lupa Password</h3>
                    <p className="text-base">Masukan email yang sudah terdaftar di sistem untuk dikirim link ganti password</p>
                </div>
                <form className="pt-10 font-medium">
                    <Input radius="sm" className="pb-5" type="email" size="lg" placeholder="Email" startContent={<EnvelopeIcon className="size-5" />} />
                    <Button radius="sm" color="primary" size="lg" className="w-full">Kirim Link</Button>
                </form>
                <div className="mt-4 flex items-center gap-1 justify-center text-primary hover:underline">
                    <ArrowLeftIcon className="size-4"/>
                    <Link to={LOGIN_PATH} className="">Kembali ke halaman login</Link>
                </div>
            </div>
        </RootAuth>
    )
};
