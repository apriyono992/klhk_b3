import logo from '../../assets/images/logo.png';
import RootAuth from "../../components/layouts/RootAuth";
import { EnvelopeIcon, EyeIcon, EyeSlashIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { Button, Checkbox, Input } from '@nextui-org/react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from "react";
import { useForm } from "react-hook-form"
import { login } from "../../services/api";
import Cookies from 'js-cookie'
import { DASHBOARD_PATH, FORGOT_PASSWORD_PATH, REGISTER_PATH } from '../../services/routes';

export default function LoginPage() {
    const [isVisible, setIsVisible] = useState(false);
    const [error, setError] = useState("")
    const { register, handleSubmit, formState: { errors, isSubmitting }, } = useForm()
    const navigate = useNavigate();

    function toggleVisibility() {
        setIsVisible(!isVisible);
    }
    
    async function onSubmit(data) {
        setError("")
        data.expiresInMins = 1
        data.clientId = "klhk-974f693f-9dcf-4b3a-b76e-eaee0da0c3a9"
        data.clientSecret= "56f3bd572037efc90b74b08f8eb3db8fa4fb28ed47270f87279613b529b225d1"
        const response = await login(data)
        
        if (response.status === 200) {
            Cookies.set('accessToken', response.data.accessToken, { expires: 0.5, secure: true, sameSite: 'strict' });
            Cookies.set('refreshToken', response.data.refreshToken, { expires: 0.5, secure: true, sameSite: 'strict' });
            
            navigate(DASHBOARD_PATH, { replace: true })
        }
        return setError(response.data.message)
    }

    return (
        <RootAuth>
            <div className="relative w-full flex flex-col p-5 md:p-24 m-5 lg:m-0 bg-white shadow-md lg:shadow-none rounded-xl lg:rounded-none">
                <div className="text-center lg:text-start pb-7">
                    <img src={logo} alt="Logo" className="size-20 mx-auto lg:mx-0"/>
                    <h3 className="font-bold text-2xl mt-5">Masukan Akun Anda</h3>
                    <p className="text-base">Sistem Informasi Tata Kelola dan Perizinan Bahan Berbahaya dan Beracun</p>
                </div>
                { error && <span className="text-danger">{ error }</span> }
                <form className="pt-3 font-medium" onSubmit={handleSubmit(onSubmit)}>
                    <Input 
                        {...register('email', { required: "Email is required" })} 
                        radius="sm" 
                        className="pb-5" 
                        type="text" 
                        size="lg"
                        color={errors.email ? 'danger' : 'default'} 
                        placeholder="Email" 
                        startContent={<EnvelopeIcon className="size-5" />}  
                        isInvalid={errors.email} 
                        errorMessage={errors.email && errors.email.message} 
                    />
                    <Input
                        {...register('password', { required: "Password is required" })}
                        radius="sm" 
                        className="pb-5" 
                        type={ isVisible ? "text" : "password" }
                        size="lg"
                        color={errors.password ? 'danger' : 'default'}  
                        placeholder="Password" 
                        startContent={<LockClosedIcon className="size-5" />}
                        endContent={
                            <Button isIconOnly onClick={ toggleVisibility }>
                                { isVisible ? <EyeSlashIcon className="size-5" /> : <EyeIcon className="size-5" /> }
                            </Button>
                        }
                        isInvalid={errors.password} 
                        errorMessage={errors.password && errors.password.message} 
                    />
                            
                    <div className="flex items-center justify-between pb-10">
                        <Checkbox
                            {...register('remember')} 
                            radius="sm" 
                            size="md"
                        >
                            Ingat Saya
                        </Checkbox>
                        <Link to={FORGOT_PASSWORD_PATH} className="hover:underline">Lupa Password?</Link>
                    </div>
                    <Button isLoading={isSubmitting} isDisabled={isSubmitting} type='submit' radius="sm" color="primary" className="w-full text-lg py-5">Masuk</Button>
                </form>
                <div className="mt-4 flex items-center gap-1 justify-center">
                    <span className="text-center">Belum Punya Akun?</span>
                    <Link to={REGISTER_PATH} className="text-primary hover:underline">Daftar Disini</Link>
                </div>
            </div>
        </RootAuth>
    )
};
