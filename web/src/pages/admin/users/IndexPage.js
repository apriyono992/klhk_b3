import React, { useMemo, useEffect } from "react";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Divider,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
} from "@nextui-org/react";
import { PlusIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../../contexts/AuthContext";
import useSWR from "swr";
import { useForm } from "react-hook-form";
import CustomDataGrid from "../../../components/elements/CustomDataGrid";
import ControlledReactSelect from "../../../components/elements/ControlledReactSelect";
import ControlledInput from "../../../components/elements/ControlledInput";
import toast from "react-hot-toast";
import ModalAlert from "../../../components/elements/ModalAlert";
import { getFetcher, postFetcher, deleteFetcher } from "../../../services/api";
import { getSelectFetcher } from "../../../services/api";
import RootAdmin from "../../../components/layouts/RootAdmin";
import RoleAccess from "../../../enums/roles";

export default function UserManagementPage() {
    const { user, roles } = useAuth(); // Ambil informasi user dan roles dari AuthContext
    const isSuperAdmin = roles.includes(RoleAccess.SUPER_ADMIN); // Cek apakah user adalah Super Admin
    const { data: allCompanies } = useSWR(
        isSuperAdmin
            ? `/api/company/search-company` // Jika Super Admin, fetch semua perusahaan
            : `/api/company/search-company?ids=${user.companies.map((company) => company.id).join(",")}`, // Jika bukan Super Admin, fetch perusahaan sesuai IDs
        getSelectFetcher
    );



    // Data perusahaan yang difilter
    const filteredCompanies = useMemo(() => allCompanies || [], [allCompanies]);

    // Fetch data pengguna
    const { data: users, isLoading, mutate } = useSWR(`/api/users/search-users`, getFetcher);

    const { control, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm();

    const [isEdit, setIsEdit] = React.useState(false);
    const [selectedRow, setSelectedRow] = React.useState(null);
    const [isOpenModalForm, setIsOpenModalForm] = React.useState(false);
    const [isOpenModalAlert, setIsOpenModalAlert] = React.useState(false);
    const [deleteId, setDeleteId] = React.useState(null);

    // Reset Form
    const resetForm = () => {
        reset();
        setIsEdit(false);
        setSelectedRow(null);
    };

    // Edit User
    const onClickEdit = (row) => {
        setIsEdit(true);
        setSelectedRow(row);
        setIsOpenModalForm(true);

        // Isi form dengan data user yang dipilih
        setValue("fullName", row.fullName || "");
        setValue("email", row.email || "");
        setValue("phoneNumber", row.phoneNumber || "");
        setValue("address", row.address || "");
        setValue("roles", row.roles?.map((role) => role.roleId) || []);
        setValue("companies", row.companies?.map((company) => company.companyId) || []);
    };

    const onSubmitForm = async (formData) => {
        try {
            const endpoint = isEdit
                ? `/api/users/update-user/${selectedRow.id}`
                : `/api/users`;
    
            const payload = {
                fullName: formData.fullName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                address: formData.address,
                password: formData.password,
                rolesIds: formData.roles?.map((roleId) => (roleId )),
                companyIds: formData.companies?.map((companyId) => (companyId ))
            };
    
            // Tambahkan password hanya jika ada input
            if (formData.password) {
                payload.password = formData.password;
            }
    
            await postFetcher(endpoint, payload);
            toast.success(isEdit ? "Pengguna berhasil diperbarui." : "Pengguna berhasil ditambahkan.");
            resetForm();
            setIsOpenModalForm(false);
            mutate();
        } catch (error) {
            console.error(error);
            toast.error("Gagal menyimpan data.");
        }
    };

    // Delete User
    const onClickDelete = (id) => {
        setDeleteId(id);
        setIsOpenModalAlert(true);
    };

    const onSubmitDelete = async () => {
        try {
            await deleteFetcher(`/api/user-management/${deleteId}`);
            toast.success("Pengguna berhasil dihapus.");
            mutate();
        } catch (error) {
            toast.error("Gagal menghapus data.");
        } finally {
            setIsOpenModalAlert(false);
            setDeleteId(null);
        }
    };

    // Kolom DataGrid
    const columns = useMemo(() => [
        { field: "fullName", headerName: "Nama Lengkap", flex: 1 },
        { field: "email", headerName: "Email", flex: 1 },
        { field: "phoneNumber", headerName: "Nomor Telepon", flex: 1 },
        { field: "address", headerName: "Alamat", flex: 1 },
        {
            field: "roles",
            headerName: "Peran",
            flex: 1,
            renderCell: (params) =>
                params?.row?.roles?.map((role) => role.role?.name).join(", ") || "-",
        },
        {
            field: "companies",
            headerName: "Perusahaan",
            flex: 1,
            renderCell: (params) =>
                params?.row?.companies?.map((company) => company.company?.name).join(", ") || "-",
        },
        {
            field: "actions",
            headerName: "Aksi",
            flex: 1,
            renderCell: (params) => (
                <div className="flex gap-2">
                    <Button color="primary" isIconOnly size="sm" onPress={() => onClickEdit(params?.row)}>
                        <PencilSquareIcon className="size-4" />
                    </Button>
                    <Button color="danger" isIconOnly size="sm" onPress={() => onClickDelete(params?.row?.id)}>
                        <TrashIcon className="size-4" />
                    </Button>
                </div>
            ),
        },
    ], []);

    const ignoredRoles = [RoleAccess.SUPER_ADMIN];

    return (
        <RootAdmin>
                    <div>
            <Card>
                <CardHeader className="flex justify-between items-center">
                    <p>Daftar Pengguna</p>
                    <Button onPress={() => { setIsOpenModalForm(true); resetForm(); }} startContent={<PlusIcon />}>
                        Tambah Pengguna
                    </Button>
                </CardHeader>
                <Divider />
                <CardBody>
                    <CustomDataGrid
                        data={users?.data || []}
                        rowCount={users?.total || 0}
                        isLoading={isLoading}
                        columns={columns}
                    />
                </CardBody>
            </Card>

            <ModalAlert
                isOpen={isOpenModalAlert}
                onOpenChange={setIsOpenModalAlert}
                onSubmit={onSubmitDelete}
                icon="danger"
                heading="Hapus Pengguna"
                description="Apakah Anda yakin ingin menghapus data ini? Aksi ini tidak dapat dibatalkan."
                buttonSubmitText="Hapus"
            />

            <Modal isOpen={isOpenModalForm} onOpenChange={setIsOpenModalForm}>
                <ModalContent>
                    <ModalHeader>{isEdit ? "Edit Pengguna" : "Tambah Pengguna"}</ModalHeader>
                    <ModalBody>
                        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
                            <ControlledInput
                                label="Nama Lengkap"
                                name="fullName"
                                control={control}
                                placeholder="Masukkan Nama Lengkap"
                                required
                            />
                            <ControlledInput
                                label="Email"
                                name="email"
                                control={control}
                                type="email"
                                placeholder="Masukkan Email"
                                required
                            />
                            <ControlledInput
                                label="Nomor Telepon"
                                name="phoneNumber"
                                control={control}
                                placeholder="Masukkan Nomor Telepon"
                                required
                            />
                            <ControlledInput
                                label="Alamat"
                                name="address"
                                control={control}
                                placeholder="Masukkan Alamat"
                                required
                            />

                            <ControlledInput
                                label="Password Baru"
                                name="password"
                                control={control}
                                type="password"
                                placeholder="Masukkan Password Baru (Opsional)"
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
                            />

                            <ControlledInput
                                label="Konfirmasi Password"
                                name="confirmPassword"
                                control={control}
                                type="password"
                                placeholder="Konfirmasi Password Baru"
                                rules={{
                                    validate: (value) =>
                                        value === watch("password") || "Password tidak cocok.",
                                }}
                            />
                                <ControlledReactSelect
                                    label="Peran"
                                    name="roles"
                                    control={control}
                                    options={Object.entries(RoleAccess)
                                        .filter(([key]) => key !== 'SUPER_ADMIN') // Abaikan SUPER_ADMIN
                                        .map(([key, value]) => ({
                                            value: value, // Gunakan key sebagai value
                                            label: value, // Gunakan value sebagai label
                                        }))}
                                    isMulti
                                    placeholder="Pilih Peran"
                                    defaultValue={selectedRow?.roles?.map((role) => ({
                                        value: role.name, // Pastikan role.name sesuai dengan key di RolesAccess
                                        label: RoleAccess[role.name], // Cocokkan label dari RolesAccess
                                    }))}
                                />
                            <ControlledReactSelect
                                label="Perusahaan"
                                name="companies"
                                control={control}
                                options={filteredCompanies.map((company) => ({
                                    value: company.value,
                                    label: company.label,
                                }))}
                                isMulti
                                placeholder="Pilih Perusahaan"
                            />
                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    color="primary"
                                    size="sm"
                                    isLoading={isSubmitting}
                                    disabled={isSubmitting}
                                >
                                    {isEdit ? "Simpan Perubahan" : "Tambah Pengguna"}
                                </Button>
                            </div>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
        </RootAdmin>

    );
}
