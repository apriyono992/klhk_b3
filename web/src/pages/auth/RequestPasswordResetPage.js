import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import RootAuth from "../../components/layouts/RootAuth";
import { Button, Input } from "@nextui-org/react";
import { ArrowLeftIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form"
import logo from '../../assets/images/logo.png';
import { LOGIN_PATH } from "../../services/routes";
import { forgotPassword } from "../../services/api";

export default function RequestPasswordResetPage() {
    const [error, setError] = useState("")
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting }, } = useForm()

    async function onSubmit(data) {
        setError("")
        const response = await forgotPassword(data)
        
        if (response.status === 201) {
            navigate(LOGIN_PATH, { replace: true })
        }
        return setError(response.data.message)
    }

    return (
        <RootAuth>
            <div className="relative w-full flex flex-col p-5 md:p-24 m-5 lg:m-0 bg-white shadow-md lg:shadow-none rounded-xl lg:rounded-none">
                <div className="text-center lg:text-start">
                    <img src={logo} alt="Logo" className="size-20 mx-auto lg:mx-0"/>
                    <h3 className="font-bold text-2xl mt-5">Lupa Password</h3>
                    <p className="text-base">Masukan email yang sudah terdaftar di sistem untuk dikirim link ganti password</p>
                </div>
                { error && <span className="text-danger">{ error }</span> }
                <form className="pt-10 font-medium" onSubmit={handleSubmit(onSubmit)}>
                    <Input 
                        {...register('email', { required: "Email is required" })}
                        radius="sm" 
                        className="pb-5" 
                        type="email" 
                        size="lg" 
                        placeholder="Email" 
                        startContent={<EnvelopeIcon className="size-5" />} 
                        color={errors.email ? 'danger' : 'default'} 
                        isInvalid={errors.email} 
                        errorMessage={errors.email && errors.email.message} />
                    <Button isLoading={isSubmitting} isDisabled={isSubmitting} type='submit' radius="sm" color="primary" size="lg" className="w-full">Kirim Link</Button>
                </form>
                <div className="mt-4 flex items-center gap-1 justify-center text-primary hover:underline">
                    <ArrowLeftIcon className="size-4"/>
                    <Link to={LOGIN_PATH} className="">Kembali ke halaman login</Link>
                </div>
            </div>
        </RootAuth>
    )
};
