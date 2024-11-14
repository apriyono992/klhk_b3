import { Button, Input, Select, SelectItem, Textarea } from '@nextui-org/react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import RootAuth from '../../components/layouts/RootAuth';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { getFetcher, postFetcher, uploadPhoto } from '../../services/api';
import { useForm } from "react-hook-form";
import toast from 'react-hot-toast';
import { LOGIN_PATH } from '../../services/routes';
import useSWR from 'swr';
import { isResponseErrorObject } from '../../services/helpers';

export default function RegisterPage() {
    const [uploadStatus, setUpload] = useState({});
    const [isVisible, setIsVisible] = useState(false);
    const { register, handleSubmit, watch, formState: { errors, isSubmitting }, getValues, setValue } = useForm();
    const navigate = useNavigate();
    const provinceId = watch('provinceId');

    const { data: province } = useSWR('/location/provinces', getFetcher)
    const { data: regency } = useSWR(provinceId ? `/location/cities?provinceId=${provinceId}` : null, getFetcher)

    const handleFileUpload = async (event) => {
        try {
            const file = event.target.files[0];
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await uploadPhoto(formData);
                setUpload(response.data)
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        } catch (error) {
            console.log(error, 'error upload');
        }
    };

    const toggleVisibility = () => setIsVisible(!isVisible);

    async function onSubmit(data) {
        try {
            const { confirmPassword, attachments, ...newData } = data;
            const updatedData = {
                ...newData,
                idPhotoUrl: uploadStatus.path,
                rolesId: '5659845c-3af8-427d-9217-416576c0b56d'
            }

            await postFetcher('/auth/register', updatedData)
            toast.success('Berhasil membuat akun silahkan masuk!')

            navigate(LOGIN_PATH, { replace: true })
        } catch (error) {
            isResponseErrorObject(error.response.data.message)
                ? Object.entries(error.response.data.message).forEach(([key, value]) => {
                    toast.error(value)
                })
                : toast.error(error.response.data.message)

        }
    }

    return (
        <RootAuth>
            <div className="relative w-full flex flex-col p-5 md:p-24 m-5 lg:m-0 bg-white shadow-md lg:shadow-none rounded-xl lg:rounded-none">
                <div className="text-center lg:text-start">
                    <img src={logo} alt="Logo" className="size-20 mx-auto lg:mx-0"/>
                    <h3 className="font-bold text-2xl mt-5">Daftarkan Akun Disini</h3>
                    <div className="mt-4 flex items-center gap-1 justify-center lg:justify-start text-base">
                        <span className="text-center">Sudah Punya Akun?</span>
                        <Link to={LOGIN_PATH} className="text-primary hover:underline">Login Disini</Link>
                    </div>
                </div>

                <form className="pt-10 font-medium" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 mb-5">
                        <Input
                            {...register('fullName')}
                            color={errors.fullName ? 'danger' : 'default'}
                            isInvalid={errors.fullName}
                            errorMessage={errors.fullName && errors.fullName.message}
                            radius="sm"
                            label="Nama Lengkap"
                            labelPlacement="outside"
                            type="text"
                            size="md"
                            placeholder='Masukan nama lengkap'
                        />
                        <Input
                            {...register('email')}
                            color={errors.email ? 'danger' : 'default'}
                            isInvalid={errors.email}
                            errorMessage={errors.email && errors.email.message}
                            radius="sm"
                            label="Email"
                            labelPlacement="outside"
                            type="email"
                            size="md"
                            placeholder='Masukan email'
                        />
                        <Input
                            {...register('phoneNumber')}
                            color={errors.phoneNumber ? 'danger' : 'default'}
                            isInvalid={errors.phoneNumber}
                            errorMessage={errors.phoneNumber && errors.phoneNumber.message}
                            radius="sm"
                            label="Telepon"
                            labelPlacement="outside"
                            type="text"
                            size="md"
                            placeholder='Masukan telepon'
                        />
                        <Select
                            {...register('provinceId', { required: 'Province is required' })}
                            color={errors.provinceId ? 'danger' : 'default'}
                            isInvalid={errors.provinceId}
                            errorMessage={errors.provinceId && errors.provinceId.message}
                            radius="sm"
                            label="Provinsi"
                            labelPlacement="outside"
                            size="md"
                            placeholder='Pilih provinsi'
                            onChange={(e) => setValue('provinceId', e.target.value)}
                        >
                            {province?.map(item => (
                                <SelectItem key={item.id}>{item.name}</SelectItem>
                            ))}
                        </Select>
                        <Select
                            {...register('cityId', { required: 'City is required' })}
                            color={errors.cityId ? 'danger' : 'default'}
                            isInvalid={errors.cityId}
                            errorMessage={errors.cityId && errors.cityId.message}
                            radius="sm"
                            label="Kota / Kabupaten"
                            labelPlacement="outside"
                            size="md"
                            placeholder='Pilih kota / kabupaten'
                        >
                            {regency?.map(it => (
                                <SelectItem key={it.id} value={it.id}>{it.name}</SelectItem>
                            ))}
                        </Select>
                    </div>
                    <Textarea
                        {...register('address', { required: "address is required" })}
                        color={errors.address ? 'danger' : 'default'}
                        isInvalid={errors.address}
                        errorMessage={errors.address && errors.address.message}
                        radius="sm"
                        label="Alamat"
                        labelPlacement="outside"
                        fullWidth
                        disableAutosize
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 mt-5 mb-5">
                        <Input
                            {...register('idNumber', { required: "idNumber is required" })}
                            color={errors.idNumber ? 'danger' : 'default'}
                            isInvalid={errors.idNumber}
                            errorMessage={errors.idNumber && errors.idNumber.message}
                            radius="sm"
                            label="Nomor KTP"
                            labelPlacement="outside"
                            type="text"
                            size="md"
                            placeholder='Masukan nomor ktp'
                        />
                        <Input
                            {...register('attachments', { required: "attachments is required" })}
                            color={errors.attachments ? 'danger' : 'default'}
                            isInvalid={errors.attachments}
                            errorMessage={errors.attachments && errors.attachments.message}
                            radius="sm"
                            label="File KTP"
                            labelPlacement="outside"
                            type="file"
                            size="md"
                            onChange={handleFileUpload}
                        />
                        <Input
                            {...register('password', { required: "Password is required"})}
                            color={errors.password ? 'danger' : 'default'}
                            isInvalid={errors.password}
                            errorMessage={errors.password && errors.password.message}
                            radius="sm"
                            className="pb-5"
                            type={ isVisible ? "text" : "password" }
                            size="md"
                            label="Password"
                            labelPlacement="outside"
                            placeholder='*********'
                            endContent={
                                <Button size='sm' isIconOnly onClick={ toggleVisibility }>
                                    { isVisible ? <EyeSlashIcon className="size-4" /> : <EyeIcon className="size-4" /> }
                                </Button>
                            }
                        />
                        <Input
                            {...register('confirmPassword', {
                            required: "Confirm Password is required",
                            validate: (value) =>
                                value === getValues('password') || "Password do not match"
                            })}
                            color={errors.confirmPassword ? 'danger' : 'default'}
                            isInvalid={errors.confirmPassword}
                            errorMessage={errors.confirmPassword && errors.confirmPassword.message}
                            radius="sm"
                            label="Konfirmasi Password"
                            labelPlacement="outside"
                            type={ isVisible ? "text" : "password" }
                            size="md"
                            placeholder='*********'
                        />
                    </div>
                    <Button isLoading={isSubmitting} isDisabled={isSubmitting} type='submit' radius="sm" color="primary" size="md" className="w-full">Daftar</Button>
                </form>
            </div>
        </RootAuth>
    )
};
