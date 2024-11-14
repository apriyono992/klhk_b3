import { Button, Input } from "@nextui-org/react";
import RootAuth from "../../components/layouts/RootAuth";
import logo from '../../assets/images/logo.png';
import { EnvelopeIcon, EyeIcon, EyeSlashIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../../services/api";
import { LOGIN_PATH } from "../../services/routes";

export default function PasswordResetPage() {
    const [error, setError] = useState("")
    const { register, handleSubmit, formState: { errors, isSubmitting }, getValues} = useForm()
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();
    const toggleVisibility = () => setIsVisible(!isVisible);

    async function onSubmit(data) {
        setError("")
        const { confirmPassword, ...newData } = data;
        const response = await resetPassword(newData)
        
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
                    <h3 className="font-bold text-2xl mt-5">Reset Password</h3>
                    <p className="text-base">Masukan password baru</p>
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
                        errorMessage={errors.email && errors.email.message}
                    />
                    <Input
                        {...register('newPassword', { required: "New Password is required"})}
                        color={errors.newPassword ? 'danger' : 'default'}
                        isInvalid={errors.newPassword}
                        errorMessage={errors.newPassword && errors.newPassword.message} 
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
                    <Input 
                        {...register('confirmPassword', { 
                            required: "Confirm Password is required",
                            validate: (value) => 
                                value === getValues('newPassword') || "Password do not match"
                        })}
                        color={errors.confirmPassword ? 'danger' : 'default'}
                        isInvalid={errors.confirmPassword}
                        errorMessage={errors.confirmPassword && errors.confirmPassword.message}
                        radius="sm" 
                        className="pb-5" 
                        type={ isVisible ? "text" : "password" } 
                        size="lg" 
                        placeholder="Konfirmasi Password" 
                        startContent={<LockClosedIcon className="size-5" />}
                    />

                    <Button isLoading={isSubmitting} isDisabled={isSubmitting} type='submit' radius="sm" color="primary" size="lg" className="w-full">Kirim Link</Button>
                </form>
            </div>
        </RootAuth>
    )
};
