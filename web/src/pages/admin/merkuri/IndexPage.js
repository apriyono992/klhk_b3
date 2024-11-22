import { Button, Card, CardBody, CardHeader, Divider, Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { PlusIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import useSWR from "swr";
import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import CustomDataGrid from "../../../components/elements/CustomDataGrid";
import ControlledReactSelect from "../../../components/elements/ControlledReactSelect";
import ControlledInput from "../../../components/elements/ControlledInput";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import toast from "react-hot-toast";
import RootAdmin from "../../../components/layouts/RootAdmin";
import ModalAlert from "../../../components/elements/ModalAlert";
import { getFetcher, getSelectLocationsFetcher, postMultipartFetcher, deleteFetcher, getSelectJenisSampleFetcher } from "../../../services/api";

export default function MercuryMonitoringIndex() {
    const { control, handleSubmit, reset, watch, setValue, formState: { isSubmitting } } = useForm();
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [photos, setPhotos] = useState([{ id: Date.now(), file: null }]);
    const [dataProvinces, setDataProvinces] = useState([]);
    const [dataRegencies, setDataRegencies] = useState([]);
    const [dataDistricts, setDataDistricts] = useState([]);
    const [dataVillages, setDataVillages] = useState([]);
    const [dataJenisSampel, setDataJenisSampel] = useState([]);
    const [isOpenModalForm, setIsOpenModalForm] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const { data, isLoading, mutate } = useSWR(
        `/api/mercury-monitoring/search-mercury-monitoring`,
        getFetcher
    );
    const [keteranganData, setKeteranganData] = useState('');
    const [deletePhotoIds, setDeletePhotoIds] = useState([]);

    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

    const [isOpenModalAlert, setIsOpenModalAlert] = useState(false);
    const [deleteId, setDeleteId] = useState(null);


    const selectedProvince = watch("provinceId");
    const selectedRegency = watch("regencyId");
    const selectedDistrict = watch("districtId");

    // Fetch Data Jenis Sampel
    const fetchJenisSampel = async () => {
        const jenisSampel = await getSelectJenisSampleFetcher(`/api/jenis-sample`);
        setDataJenisSampel(jenisSampel || []);
        console.log(jenisSampel);
    };

    // Fungsi untuk fetch data provinsi
    const fetchProvinces = async () => {
        try {
            const data = await getSelectLocationsFetcher(`/api/location/provinces`);
            setDataProvinces(data || []);
            // Reset data lainnya
            setDataRegencies([]);
            setDataDistricts([]);
            setDataVillages([]);
        } catch (error) {
            console.error('Error fetching provinces:', error);
        }
    };

    // Fungsi untuk fetch data kabupaten/kota
    const fetchRegencies = async (provinceId) => {
        try {
            if (!provinceId) {
                setDataRegencies([]);
                setDataDistricts([]);
                setDataVillages([]);
                return;
            }

            const data = await getSelectLocationsFetcher(`/api/location/cities?provinceId=${provinceId}`);
            setDataRegencies(data || []);
            // Reset data district dan village
            setDataDistricts([]);
            setDataVillages([]);
        } catch (error) {
            console.error('Error fetching regencies:', error);
        }
    };

    // Fungsi untuk fetch data kecamatan
    const fetchDistricts = async (regencyId) => {
        try {
            if (!regencyId) {
                setDataDistricts([]);
                setDataVillages([]);
                return;
            }

            const data = await getSelectLocationsFetcher(`/api/location/districts?regencyId=${regencyId}`);
            setDataDistricts(data || []);
            // Reset data village
            setDataVillages([]);
        } catch (error) {
            console.error('Error fetching districts:', error);
        }
    };

    // Fungsi untuk fetch data desa/kelurahan
    const fetchVillages = async (districtId) => {
        try {
            if (!districtId) {
                setDataVillages([]);
                return;
            }

            const data = await getSelectLocationsFetcher(`/api/location/villages?districtId=${districtId}`);
            setDataVillages(data || []);
        } catch (error) {
            console.error('Error fetching villages:', error);
        }
    };


    // Reset Form
    const resetForm = () => {
        reset();
        setPhotos([]);
        setKeteranganData('');
        setDataRegencies([]);
        setDataDistricts([]);
        setDataVillages([]);
        setIsEdit(false);
        setSelectedRow(null);
    };
    useEffect(() => {
        fetchProvinces();
        fetchJenisSampel();
    }, []);

    // Watch Changes for Location Reset
    useEffect(() => {
        if (selectedProvince) {
            setValue("regencyId", null);
            setValue("districtId", null);
            setValue("villageId", null);
            fetchRegencies(selectedProvince);
        }
    }, [selectedProvince]);

    useEffect(() => {
        if (selectedRegency) {
            setValue("districtId", null);
            setValue("villageId", null);
            fetchDistricts(selectedRegency);
        }
    }, [selectedRegency]);

    useEffect(() => {
        if (selectedDistrict) {
            setValue("villageId", null);
            fetchVillages(selectedDistrict);
        }
    }, [selectedDistrict]);

    // Edit Data
    const onClickEdit = async (row) => {
        setIsEdit(true);
        setSelectedRow(row);
        setIsOpenModalForm(true);
    
        try {
            const detailData = await getFetcher(`/api/mercury-monitoring/${row.id}`);
    
            // Set value field secara manual
            setValue("jenisSampelId", detailData.jenisSampelId || null);
            setValue("sumberData", detailData.sumberData || '');
            setValue("tahunPengambilan", detailData.tahunPengambilan || '');
            setValue("hasilKadar", detailData.hasilKadar || '');
            setValue("satuan", detailData.satuan || '');
            setValue("tingkatKadar", detailData.tingkatKadar || '');
            setValue("konsentrasi", detailData.konsentrasi || '');
            setValue("keterangan", detailData.keterangan || '');
            setValue("provinceId", detailData.provinceId || null);
            setValue("regencyId", detailData.regencyId || null);
            setValue("districtId", detailData.districtId || null);
            setValue("villageId", detailData.villageId || null);
            setValue("latitude", detailData.latitude || '');
            setValue("longitude", detailData.longitude || '');
    
            // Set data tambahan seperti foto dan keterangan
            setPhotos(detailData.photos || []);
            setKeteranganData(detailData.keterangan || '');
    
            // Mengisi dropdown lokasi
            await fetchRegencies(detailData?.location?.provinceId);
            await fetchDistricts(detailData?.location?.regencyId);
            await fetchVillages(detailData?.location?.districtId);
 
        } catch (error) {
            toast.error("Gagal mengambil data.");
        }
    };    

    // Submit Form
    const onSubmitForm = async (formData) => {
        try {
            const formDataToSend = new FormData();

            const dtoProperties = [
                'sumberData',
                'jenisSampelId',
                'hasilKadar',
                'satuan',
                'tingkatKadar',
                'konsentrasi',
                'keterangan',
                'tahunPengambilan',
                'provinceId',
                'regencyId',
                'districtId',
                'villageId',
                'latitude',
                'longitude'
            ];

            // Tambahkan data form (input teks, select, dll.) ke FormData
            Object.entries(formData).forEach(([key, value]) => {
                // Hanya menambahkan jika value tidak kosong
                if (value !== null && value !== undefined && value !== '' && key !== 'polygon' && dtoProperties.includes(key)) {
                    formDataToSend.append(key, value);
                }
            });
            const endpoint = isEdit ? `/api/mercury-monitoring/update/${selectedRow.id}` : `/api/mercury-monitoring`;
            // Tambahkan foto yang diunggah ke FormData
            photos.forEach((photo, index) => {
                if (photo.file) {
                    formDataToSend.append(`photos`, photo.file);
                }
            });
            
            if(isEdit){
                // Tambahkan ID foto yang dihapus
                deletePhotoIds.forEach((id) => {
                    formDataToSend.append('deletePhotoIds', id);
                });
            }
            await postMultipartFetcher(endpoint, formDataToSend);
            toast.success(isEdit ? "Data berhasil diperbarui." : "Data berhasil ditambahkan.");
            resetForm();
            setIsOpenModalForm(false);
            mutate();
        } catch (error) {
            console.log(error);
            toast.error("Gagal menyimpan data.");
        }
    };

    const columns = useMemo(() => [
        { field: 'jenisSampelType', headerName: 'Kode Jenis', flex: 1, renderCell: (params) => params?.row?.jenisSampel?.jenisSampelType?.deskripsi || '-' },
        { field: 'jenisSampel', headerName: 'Jenis Sampel', flex: 1, renderCell: (params) => params?.row?.jenisSampel?.deskripsi || '-' },
        {
            field: 'tahunPengambilan',
            headerName: 'Tanggal Pengambilan',
            flex: 1,
            renderCell: (params) => {
                const date = params?.row?.tahunPengambilan;
                if (!date) return '-';
        
                // Format Date-Time menggunakan Intl.DateTimeFormat
                const formattedDate = new Intl.DateTimeFormat('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                }).format(new Date(date));
        
                return formattedDate;
            },
        },        
        { field: 'hasilKadar', headerName: 'Hasil Kadar', flex: 1, renderCell: (params) => params?.row?.hasilKadar || '-' },
        { field: 'satuan', headerName: 'Satuan', flex: 1, renderCell: (params) => params?.row?.satuan || '-' },
        {
            field: 'province',
            headerName: 'Provinsi',
            flex: 1,
            renderCell: (params) => params?.row?.location?.province?.name || '-',
        },
        {
            field: 'regency',
            headerName: 'Kabupaten/Kota',
            flex: 1,
            renderCell: (params) => params?.row?.location?.regency?.name || '-',
        },
        {
            field: 'district',
            headerName: 'Kecamatan',
            flex: 1,
            renderCell: (params) => params?.row?.location?.district?.name || '-',
        },
        {
            field: 'village',
            headerName: 'Desa/Kelurahan',
            flex: 1,
            renderCell: (params) => params?.row?.location?.village?.name || '-',
        },
        {
            field: 'actions',
            headerName: 'Aksi',
            flex: 1,
            renderCell: (params) => (
                <div className="flex gap-2">
                    <Button
                        color="primary"
                        isIconOnly
                        size="sm"
                        onPress={() => onClickEdit(params?.row)}
                    >
                        <PencilSquareIcon className="size-4" />
                    </Button>
                    <Button
                        color="danger"
                        isIconOnly
                        size="sm"
                        onPress={() => onClickDelete(params?.row?.id)}
                    >
                        <TrashIcon className="size-4" />
                    </Button>
                </div>
            ),
        },
    ], []);
    
        

        const onClickDelete = (id) => {
            setDeleteId(id);
            setIsOpenModalAlert(true);
        };
        
        const onSubmitDelete = async () => {
            try {
                await deleteFetcher(`/api/mercury-monitoring/${deleteId}`);
                toast.success("Data berhasil dihapus.");
                mutate(); // Refresh data setelah penghapusan
            } catch (error) {
                toast.error("Gagal menghapus data.");
            } finally {
                setIsOpenModalAlert(false);
                setDeleteId(null);
            }
        };
        

        // Fungsi untuk menambahkan input foto baru
        const handleAddPhoto = () => {
            setPhotos([...photos, { id: Date.now(), file: null }]);
        };
    
        // Fungsi untuk mengubah file foto
        const handlePhotoChange = (id, file) => {
            setPhotos(
                photos.map((photo) =>
                    photo.id === id ? { ...photo, file } : photo
                )
            );
            checkPhotoValidity();
        };
        
        // Fungsi untuk menghapus input foto
        const handleRemovePhoto = (id,  isExistingPhoto = false) => {
            // Jika foto adalah foto existing (memiliki URL), tambahkan ID ke deletePhotoIds
            if (isExistingPhoto) {
                setDeletePhotoIds((prev) => [...prev, id]);
            }
        
            // Hapus foto dari daftar photos
            setPhotos(photos.filter((photo) => photo.id !== id));
            checkPhotoValidity();
        };

         // Fungsi untuk memeriksa apakah minimal satu foto telah diunggah
        const checkPhotoValidity = () => {
            const hasPhoto = photos.some((photo) => photo.file !== null);
            setIsSubmitDisabled(!hasPhoto);
        };

        // Menghitung data yang akan ditampilkan berdasarkan page dan pageSize
        const paginatedData = useMemo(() => {
            if (!data?.data) return [];
            const startIndex = page * pageSize;
            const endIndex = startIndex + pageSize;
            return data.data.slice(startIndex, endIndex);
        }, [data, page, pageSize]);


    return (
        <RootAdmin>
            <Card>
                <CardHeader className="flex justify-between items-center">
                    <p>Daftar Hasil Pemantauan Merkuri</p>
                    <Button onPress={() => { setIsOpenModalForm(true); resetForm(); }} startContent={<PlusIcon />}>Tambah</Button>
                </CardHeader>
                <Divider />
                <CardBody>
                <CustomDataGrid
                    data={paginatedData}
                    rowCount={data?.data?.length || 0} // Menggunakan total data
                    isLoading={isLoading}
                    columns={columns}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    page={page}
                    setPage={setPage}
                />
                </CardBody>
            </Card>

            <ModalAlert
                isOpen={isOpenModalAlert}
                onOpenChange={setIsOpenModalAlert}
                onSubmit={onSubmitDelete}
                icon="danger"
                heading="Hapus Data"
                description="Apakah Anda yakin ingin menghapus data ini? Aksi ini tidak dapat dibatalkan."
                buttonSubmitText="Hapus"
            />

            <Modal isOpen={isOpenModalForm} onOpenChange={setIsOpenModalForm}>
                <ModalContent style={{ maxWidth: "800px" }}>
                    <ModalHeader>{isEdit ? "Edit Data" : "Tambah Data"}</ModalHeader>
                    <ModalBody className="overflow-y-auto max-h-[80vh]">
                        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
                            {/* Jenis Sampel */}
                            <ControlledReactSelect
                                label="Jenis Sampel"
                                name="jenisSampelId"
                                control={control}
                                options={dataJenisSampel}
                                placeholder="Pilih Jenis Sampel"
                                required
                            />

                            {/* Sumber Data */}
                            <ControlledInput
                                label="Sumber Data"
                                name="sumberData"
                                control={control}
                                placeholder="Masukkan Sumber Data"
                                required
                            />

                            {/* Tanggal Pengambilan */}
                            <ControlledInput
                                label="Tanggal Pengambilan"
                                name="tahunPengambilan"
                                control={control}
                                type="date"
                                placeholder="Pilih Tanggal Pengambilan"
                                required
                            />

                            {/* Hasil Kadar dan Satuan */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <ControlledInput
                                    label="Hasil Kadar"
                                    name="hasilKadar"
                                    control={control}
                                    type="number"
                                    placeholder="Masukkan Hasil Kadar"
                                    required
                                />
                                <ControlledInput
                                    label="Satuan"
                                    name="satuan"
                                    control={control}
                                    placeholder="Masukkan Satuan"
                                    required
                                />
                            </div>

                            {/* Tingkat Kadar */}
                            <ControlledReactSelect
                                label="Tingkat Kadar"
                                name="tingkatKadar"
                                control={control}
                                options={[
                                    { value: "Diatas BML", label: "Diatas BML" },
                                    { value: "Dibawah BML", label: "Dibawah BML" },
                                ]}
                                placeholder="Pilih Tingkat Kadar"
                                required
                            />

                            {/* Konsentrasi */}
                            <ControlledInput
                                label="Konsentrasi"
                                name="konsentrasi"
                                control={control}
                                placeholder="Masukkan Konsentrasi"
                                required
                                className="mt-10"
                            />

                            {/* Keterangan */}
                            <div className="mb-10">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Keterangan</label>
                                <ReactQuill
                                    value={keteranganData}
                                    onChange={(value) => setKeteranganData(value)}
                                    placeholder="Masukkan Keterangan"
                                    className="h-32"
                                />
                            </div>
                            
                            {/* Lokasi */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <ControlledReactSelect
                                    key={`province-select-${watch("provinceId")}`}
                                    label="Provinsi"
                                    name="provinceId"
                                    control={control}
                                    options={dataProvinces}
                                    placeholder="Pilih Provinsi"
                                    required
                                />
                                <ControlledReactSelect
                                    key={`regency-select-${watch("regencyId")}-${watch("provinceId")}`}
                                    label="Kabupaten/Kota"
                                    name="regencyId"
                                    control={control}
                                    options={dataRegencies}
                                    placeholder="Pilih Kabupaten/Kota"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <ControlledReactSelect
                                    key={`district-select-${watch("districtId")}-${watch("regencyId")}`}
                                    label="Kecamatan"
                                    name="districtId"
                                    control={control}
                                    options={dataDistricts}
                                    placeholder="Pilih Kecamatan"
                                    required
                                />
                                <ControlledReactSelect
                                    key={`village-select-${watch("villageId")}-${watch("districtId")}`}
                                    label="Desa/Kelurahan"
                                    name="villageId"
                                    control={control}
                                    options={dataVillages}
                                    placeholder="Pilih Desa/Kelurahan"
                                    required
                                />
                            </div>

                            {/* Longitude dan Latitude */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <ControlledInput
                                    label="Longitude"
                                    name="longitude"
                                    control={control}
                                    type="number"
                                    placeholder="Masukkan Longitude"
                                />
                                <ControlledInput
                                    label="Latitude"
                                    name="latitude"
                                    control={control}
                                    type="number"
                                    placeholder="Masukkan Latitude"
                                />
                            </div>

                                                        {/* Upload Foto */}
                                {/* Hanya tampil saat menambah data (isEdit === false) */}
                            {!isEdit && (
                                <div className="mb-8">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Unggah Foto (Minimal 1 Foto)
                                    </label>
                                    {photos.map((photo, index) => (
                                        <div key={photo.id} className="flex items-center gap-4 mb-4">
                                            {photo.url ? (
                                                <img
                                                    src={photo.url}
                                                    alt="Existing Photo"
                                                    className="w-20 h-20 object-cover rounded-md"
                                                />
                                            ) : (
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handlePhotoChange(photo.id, e.target.files[0])}
                                                    className="block w-full text-sm text-gray-500
                                                        file:mr-4 file:py-2 file:px-4
                                                        file:rounded-full file:border-0
                                                        file:text-sm file:font-semibold
                                                        file:bg-primary-100 file:text-primary-700
                                                        hover:file:bg-primary-200"
                                                />
                                            )}
                                            <Button
                                                color="danger"
                                                isIconOnly
                                                size="sm"
                                                onPress={() => handleRemovePhoto(photo.id, !!photo.url)}
                                            >
                                                <TrashIcon className="size-4" />
                                            </Button>
                                        </div>
                                    ))}

                                    <Button
                                        type="button"
                                        size="sm"
                                        color="primary"
                                        onPress={handleAddPhoto}
                                        className="mt-2"
                                    >
                                        Tambah Foto
                                    </Button>
                                </div>
                            )}


                        {/* Tombol Submit */}
                        <div className="flex justify-end mb-6">
                                <Button
                                    type="submit"
                                    color="primary"
                                    size="sm"
                                    disabled={isSubmitDisabled || isSubmitting}
                                    isLoading={isSubmitting}
                                    className={`w-full transition-all duration-300 ${
                                        isSubmitDisabled
                                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed hover:bg-gray-300'
                                            : 'primary-600 text-white hover:primary-700'
                                    }`}
                                >
                                    {isEdit ? 'Simpan' : 'Tambah'}
                                </Button>
                            </div>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>

        </RootAdmin>
    );
}
