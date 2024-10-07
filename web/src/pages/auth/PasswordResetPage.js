import { Button, Input } from "@nextui-org/react";
import RootAuth from "../../components/layouts/RootAuth";
import logo from '../../assets/images/logo.png';
import { EnvelopeIcon, EyeIcon, EyeSlashIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function PasswordResetPage() {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    return (
        <RootAuth>
            <div className="relative w-full flex flex-col p-5 md:p-24 m-5 lg:m-0 bg-white shadow-md lg:shadow-none rounded-xl lg:rounded-none">
                <div className="text-center lg:text-start">
                    <img src={logo} alt="Logo" className="size-20 mx-auto lg:mx-0"/>
                    <h3 className="font-bold text-2xl mt-5">Reset Password</h3>
                    <p className="text-base">Masukan password baru</p>
                </div>
                <form className="pt-10 font-medium">
                    <Input radius="sm" className="pb-5" type="email" size="lg" placeholder="Email" startContent={<EnvelopeIcon className="size-5" />} isReadOnly />
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
                    />
                    <Input radius="sm" className="pb-5" type={ isVisible ? "text" : "password" } size="lg" placeholder="Konfirmasi Password" startContent={<LockClosedIcon className="size-5" />} />

                    <Button radius="sm" color="primary" size="lg" className="w-full">Kirim Link</Button>
                </form>
            </div>
        </RootAuth>
    )
};
