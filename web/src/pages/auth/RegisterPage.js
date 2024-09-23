import { Button, Input, Select, SelectItem, Textarea } from '@nextui-org/react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import RootAuth from '../../RootAuth';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function RegisterPage() {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    return(
        <RootAuth>
            <div className="relative w-full flex flex-col p-5 md:p-24 m-5 lg:m-0 bg-white shadow-md lg:shadow-none rounded-xl lg:rounded-none">
                <div className="text-center lg:text-start">
                    <img src={logo} alt="Logo" className="size-20 mx-auto lg:mx-0"/>
                    <h3 className="font-bold text-2xl mt-5">Daftarkan Akun Disini</h3>
                    <div className="mt-4 flex items-center gap-1 justify-center lg:justify-start text-base">
                        <span className="text-center">Sudah Punya Akun?</span>
                        <Link to="/login" className="text-primary hover:underline">Login Disini</Link>
                    </div>
                </div>
                <form className="pt-10 font-medium">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 mb-5">
                        <Input radius="sm" label="Nama Lengkap" labelPlacement="outside" type="text" size="md" placeholder='Masukan nama lengkap' isRequired/>
                        <Input radius="sm" label="Email" labelPlacement="outside" type="email" size="md" placeholder='Masukan email' isRequired/>
                        <Input radius="sm" label="Telepon" labelPlacement="outside" type="text" size="md" placeholder='Masukan telepon' isRequired />
                        <Select radius="sm" label="Provinsi" labelPlacement="outside" size="md" placeholder='Pilih provinsi' isRequired>
                            <SelectItem key="1">Jakarta</SelectItem>
                        </Select>
                        <Select radius="sm" label="Kabupaten" labelPlacement="outside" size="md" placeholder='Pilih kabupaten' isRequired>
                                <SelectItem key="1">Jakarta Barat</SelectItem>
                        </Select>
                    </div>
                    <Textarea radius="sm" label="Alamat" labelPlacement="outside" fullWidth disableAutosize isRequired />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 mt-5 mb-5">
                        <Input radius="sm" label="Nomor KTP" labelPlacement="outside" type="text" size="md" placeholder='Masukan nomor ktp' isRequired />
                        <Input radius="sm" label="File KTP" labelPlacement="outside" type="file" size="md" isRequired />
                        <Input 
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
                        <Input radius="sm" label="Konfirmasi Password" labelPlacement="outside" type={ isVisible ? "text" : "password" } size="md" placeholder='*********' isRequired />
                    </div>
                    <Button radius="sm" color="primary" size="md" className="w-full">Daftar</Button>
                </form>
            </div>
        </RootAuth>
    )
};
