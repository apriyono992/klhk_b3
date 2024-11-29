import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Divider,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Tab,
    Tabs,
    Avatar,
} from '@nextui-org/react';
import RootAdmin from '../../../components/layouts/RootAdmin';
import { useState } from 'react';
import { useForm, Controller} from 'react-hook-form';
import { BASE_URL, putFetcher } from '../../../services/api';
import axios from 'axios';

import toast from "react-hot-toast";
import useSWR, { mutate } from 'swr';
import useAuth from '../../../hooks/useAuth';

export default function ProfilePage() {
    const { user, roles } = useAuth(); // Data userAuth untuk detail pengguna dan role
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    const { register, handleSubmit, watch, control, reset, formState: { errors, isSubmitting } } = useForm();

    const [initialValues, setInitialValues] = useState({
        fullName: user.fullName,
        oldPassword: undefined,
        password: undefined,
        confirmPassword: undefined,
    })
    const passwordValue = watch("password"); // Pantau perubahan password baru
    // Cek jika passwordValue tidak undefined, null, atau string kosong
    const isPasswordProvided = passwordValue !== undefined && passwordValue !== null && passwordValue.trim() !== "";
    console.log('isPasswordProvided', isPasswordProvided, passwordValue);
    const { data: companies, isLoading: isLoadingCompanies } = useSWR(
        `${BASE_URL}/api/user/companies`,
        (url) => axios.get(url).then((res) => res.data)
    );

    const onSubmit = async (data) => {
        try {
            console.log("Submit data:", data); // Debug data yang dikirim
            await putFetcher('/api/users/update-profile',user.id, data);
            toast.success('Profil berhasil diperbarui!');
            setIsOpen(false);
            mutate();
            reset();
        } catch (error) {
            toast.error(
                'Terjadi kesalahan saat memperbarui profil'
            );
        }
    };

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    return (
        <RootAdmin>
            <Card className="w-full mt-3" radius="sm">
                <CardHeader>
                    <p className="text-md">Profil Pengguna</p>
                </CardHeader>
                <Divider />
                <CardBody className="p-5">
                    <div className="flex justify-between items-center mb-4">
                        <p>Perbarui informasi profil Anda.</p>
                        <Button onPress={openModal} color="primary">
                            Perbarui Profil
                        </Button>
                    </div>
                    <Tabs
                        className="mt-4"
                        aria-label="Profil dan Perusahaan"
                        selectedIndex={activeTab}
                        onSelectionChange={(index) => setActiveTab(index)}
                    >
                        {/* Tab Profil */}
                        <Tab key="profile" title="Profil">
                            <div className="p-4 flex gap-4 items-start">
                                {/* Avatar */}
                                <Avatar
                                    src={user.idPhotoUrl || `https://ui-avatars.com/api/?name=${user.fullName}`}
                                    alt={user.fullName}
                                    size="lg"
                                />
                                {/* Detail Pengguna */}
                                <div>
                                    <p className="text-lg font-semibold">{user.fullName}</p>
                                    <p className="text-sm text-gray-500">Email: {user.email}</p>
                                    <p className="text-sm text-gray-500">Telepon: {user.phoneNumber}</p>
                                    <p className="text-sm text-gray-500">Alamat: {user.address || '-'}</p>
                                    <p className="text-sm text-gray-500">Role: {roles.map(role => role.name).join(', ')}</p>
                                    <p className="text-sm text-gray-500">Status: {user.isActive ? 'Aktif' : 'Tidak Aktif'}</p>
                                </div>
                            </div>
                        </Tab>

                        {/* Tab Daftar Perusahaan */}
                        <Tab key="companies" title="Daftar Perusahaan">
                            <div className="p-4">
                                {isLoadingCompanies ? (
                                    <p>Loading...</p>
                                ) : companies?.length ? (
                                    <ul>
                                        {companies.map((company) => (
                                            <li key={company.id} className="mb-2">
                                                <p className="text-sm font-semibold">{company.name}</p>
                                                <p className="text-sm text-gray-600">{company.address}</p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-gray-500">Tidak ada perusahaan yang terdaftar.</p>
                                )}
                            </div>
                        </Tab>
                    </Tabs>
                </CardBody>
            </Card>

            {/* Modal for Updating Profile */}
            <Modal
                size="md"
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                onClose={closeModal}
                isDismissable={false}
                isKeyboardDismissDisabled={false}
            >
                <ModalContent>
                    <ModalHeader>Perbarui Profil</ModalHeader>
                    <ModalBody>
                    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                            {/* Nama */}
                            <Controller
                                name="fullName"
                                control={control}
                                defaultValue={initialValues.fullName}
                                rules={{
                                    required: "Nama wajib diisi",
                                }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label="Nama"
                                        placeholder="Masukkan Nama"
                                        isInvalid={errors.name}
                                        errorMessage={errors.name && errors.name.message}
                                    />
                                )}
                            />

                             {/* Password Lama */}
                             <Controller
                                name="oldPassword"
                                control={control}
                                defaultValue={initialValues.oldPassword}
                                rules={{
                                    required: isPasswordProvided || false,
                                }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label="Password Lama"
                                        placeholder="Masukkan Password Lama"
                                        type="password"
                                        isInvalid={errors.oldPassword}
                                        errorMessage={errors.oldPassword && errors.oldPassword.message}
                                    />
                                )}
                            />

                            {/* Password Baru */}
                            <Controller
                                name="password"
                                control={control}
                                defaultValue={initialValues.password}
                                rules={{
                                    minLength: {
                                        value: 8,
                                        message: "Password harus terdiri dari minimal 8 karakter.",
                                    },
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                                        message: "Password harus mengandung huruf besar, huruf kecil, dan angka.",
                                    },
                                }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label="Password Baru"
                                        placeholder="Masukkan Password Baru"
                                        type="password"
                                        isInvalid={errors.password}
                                        errorMessage={errors.password && errors.password.message}
                                    />
                                )}
                            />

                            {/* Konfirmasi Password */}
                            <Controller
                                name="confirmPassword"
                                control={control}
                                defaultValue={initialValues.confirmPassword}
                                rules={{
                                    validate: (value) =>
                                        isPasswordProvided
                                            ? value === passwordValue || "Password tidak cocok."
                                            : undefined,
                                }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label="Konfirmasi Password"
                                        placeholder="Konfirmasi Password Baru"
                                        type="password"
                                        isDisabled={!isPasswordProvided}
                                        isInvalid={errors.confirmPassword}
                                        errorMessage={errors.confirmPassword && errors.confirmPassword.message}
                                    />
                                )}
                            />

                            {/* Tombol Simpan */}
                            <div className="flex justify-end gap-2">
                                <Button
                                    type="submit"
                                    isLoading={isSubmitting}
                                    isDisabled={isSubmitting}
                                    color="primary"
                                >
                                    Simpan
                                </Button>
                                <Button
                                    type="button"
                                    onPress={() => reset(initialValues)}
                                    color="danger"
                                    variant="faded"
                                >
                                    Reset
                                </Button>
                            </div>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </RootAdmin>
    );
}
