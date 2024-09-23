import { EnvelopeIcon, EyeIcon, EyeSlashIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { Button, Checkbox, Input } from '@nextui-org/react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import RootAuth from "../../RootAuth";
import { useState } from "react";

export default function LoginPage() {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);
    return (
        <RootAuth>
            <div className="relative w-full flex flex-col p-5 md:p-24 m-5 lg:m-0 bg-white shadow-md lg:shadow-none rounded-xl lg:rounded-none">
                <div className="text-center lg:text-start">
                    <img src={logo} alt="Logo" className="size-20 mx-auto lg:mx-0"/>
                    <h3 className="font-bold text-2xl mt-5">Masukan Akun Anda</h3>
                    <p className="text-base">Sistem Informasi Tata Kelola dan Perizinan Bahan Berbahaya dan Beracun</p>
                </div>
                <form className="pt-10 font-medium">
                    <Input radius="sm" className="pb-5" type="email" size="lg" placeholder="Email" startContent={<EnvelopeIcon className="size-5" />} required />
                    <Input 
                        radius="sm" 
                        className="pb-5" 
                        type={ isVisible ? "text" : "password" }
                        size="lg" 
                        placeholder="Password" 
                        startContent={<LockClosedIcon className="size-5" />}
                        endContent={
                            <Button isIconOnly onClick={ toggleVisibility }>
                                { isVisible ? <EyeSlashIcon className="size-5" /> : <EyeIcon className="size-5" /> }
                            </Button>
                        }
                        required 
                    />
                            
                    <div className="flex items-center justify-between pb-10">
                        <Checkbox radius="sm" defaultSelected size="md">Ingat Saya</Checkbox>
                        <Link to="/forgot-password/request" className="hover:underline">Lupa Password?</Link>
                    </div>
                    <Button radius="sm" color="primary" size="lg" className="w-full text-lg">Masuk</Button>
                </form>
                <div className="mt-4 flex items-center gap-1 justify-center">
                    <span className="text-center">Belum Punya Akun?</span>
                    <Link to="/register" className="text-primary hover:underline">Daftar Disini</Link>
                </div>
            </div>
        </RootAuth>
    )
};
