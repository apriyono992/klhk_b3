import { Button, Card, CardBody, CardHeader, Divider, Chip, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea } from "@nextui-org/react";
import { EyeIcon, ArrowPathIcon, PlusIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import useSWR from "swr";
import { getFetcher, postFetcher,getSelectFetcher, getSelectLocationsFetcher, postMultipartFetcher, deleteFetcher } from "../../../services/api";
import RootAdmin from "../../../components/layouts/RootAdmin";
import useCustomNavigate from "../../../hooks/useCustomNavigate";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import CustomDataGrid from "../../../components/elements/CustomDataGrid";
import ControlledReactSelect from "../../../components/elements/ControlledReactSelect";
import ControlledInput from "../../../components/elements/ControlledInput";
import NomalInput from "../../../components/elements/NomalInput";
import ModalAlert from "../../../components/elements/ModalAlert";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import toast from "react-hot-toast";
import { InputNumberInterval } from "../../../components/elements/filterBetweenNumber";
import { InputSelect } from "../../../components/elements/filterSelect";
import { InputTimeRange } from "../../../components/elements/fitlerDateTimeRange";
import {createMultiSelectFilterOperator } from "../../../components/elements/filterCheckboxList";



export default function IndexPage() {
    const [page, setPage] = useState(0);
    const [photos, setPhotos] = useState([{ id: Date.now(), file: null }]);
    const [pageSize, setPageSize] = useState(10);
    const { data, isLoading, mutate } = useSWR(`/api/wpr/search?returnAll=true`, getFetcher, {
        onSuccess: (data) => {
            setAllData(data?.data || []);
            setFilteredData(data?.data || []);
        },
    });
    const { getAdminDetailPath } = useCustomNavigate();
    const [polygonData, setPolygonData] = useState('');
    const [keteranganData, setKeteranganData] = useState('');   
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [deletePhotoIds, setDeletePhotoIds] = useState([]);
    const [allData, setAllData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [provinceOptions, setProvinceOptions] = useState([]);
    const [regencyOptions, setRegencyOptions] = useState([]);
    const [districtOptions, setDistrictOptions] = useState([]);
    const [villageOptions, setVillageOptions] = useState([]);
    const [statusOptions, setStatusOptions] = useState([]);
    const [provinsiFilterOptions, setProvinsiFilterOptions] = useState([]);
    const [kabupatenFilterOptions, setKabupatenFilterOptions] = useState([]);
    const [kecamatanFilterOptions, setKecamatanFilterOptions] = useState([]);
    const [desaFilterOptions, setDesaFilterOptions] = useState([]);

    const { 
        control, 
        register, 
        handleSubmit, 
        reset, 
        watch, 
        getValues, 
        setValue,
        formState: { errors, isSubmitting, dirtyFields } 
    } = useForm({
        defaultValues: {
            provinceId: '',
            regencyId: '',
            districtId: '',
            villageId: '',
            keterangan: '',
            longitude: '',
            latitude: '',
            luasWilayah: '',
            polygon:'',
        },
    });

    const selectedProvince = watch("provinceId");
    const selectedRegency = watch("regencyId");
    const selectedDistrict = watch("districtId");

    // Mengamati perubahan input wajib
    const watchedValues = watch([
        'provinceId',
        'regencyId',
        'districtId',
        'villageId',
        'luasWilayah',
        'polygon',
        'tahunPengambilan'
    ]);

    const [isEdit, setIsEdit] = useState(false);
    const [isOpenModalForm, setIsOpenModalForm] = useState(false);
    const [isOpenModalAlert, setIsOpenModalAlert] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const onOpenModalForm = () => setIsOpenModalForm(true);
    const onCloseForm = () => {
        if (isEdit) {
            reset(); // Reset form hanya jika sedang dalam mode edit
        }
    
        setPolygonData(''); // Reset data polygon
        setKeteranganData(''); // Reset data keterangan
        setPhotos([]); // Reset daftar foto
        setIsEdit(false); // Kembali ke mode tambah
        setSelectedRow(null); // Hapus row yang dipilih
        setIsOpenModalForm(false); // Tutup modal form
    };

    const resetForm = () => {
        reset(); // Reset form dari react-hook-form
        setPolygonData(''); // Reset data polygon
        setKeteranganData(''); // Reset data keterangan
        setPhotos([]); // Reset daftar foto
        setIsEdit(false); // Kembali ke mode tambah
        setSelectedRow(null); // Hapus row yang dipilih
    };

    const onOpenModalAlert = () => setIsOpenModalAlert(true);
    const onCloseModalAlert = () => setIsOpenModalAlert(false);

    const onClickEdit = async (row) => {
        try {
            setIsEdit(true);
            setSelectedRow(row);
    
            // Ambil detail data berdasarkan ID
            const detailData = await getFetcher(`/api/wpr/find/${row.id}`);
            console.log('Detail Data:', detailData.tahunPengambilan);
    
            // Mengisi nilai form secara manual dengan `setValue`
            setValue('sumberData', detailData?.sumberData || '');
            setValue('keterangan', detailData?.keterangan || '');
            const formattedDate = detailData?.tahunPengambilan
            ? new Date(detailData.tahunPengambilan).toISOString().split('T')[0]
            : '';
            setValue('tahunPengambilan', formattedDate);
            setValue('status', detailData?.status || '');
            setValue('luasWilayah', detailData?.luasWilayah || '');
            setValue('provinceId', detailData?.location?.provinceId || '');
            setValue('regencyId', detailData?.location?.regencyId || '');
            setValue('districtId', detailData?.location?.districtId || '');
            setValue('villageId', detailData?.location?.villageId || '');
            setValue('latitude', detailData?.latitude || '');
            setValue('longitude', detailData?.longitude || '');
    
            // Set nilai keterangan dan polygon
            setKeteranganData(detailData.keterangan || '');
            setPolygonData(detailData.polygon || '', null, 2);
            
            setValue('polygon', detailData.polygon);
    
            // Mengisi dropdown lokasi
            await fetchRegencies(detailData?.location?.provinceId);
            await fetchDistricts(detailData?.location?.regencyId);
            await fetchVillages(detailData?.location?.districtId);
    
            // Set foto yang sudah ada
            if (detailData.photos && detailData.photos.length > 0) {
                const existingPhotos = detailData.photos.map((url) => ({ id: Date.now(), file: null, url }));
                setPhotos(existingPhotos);
                
                checkPhotoValidity();
            }
    
            // Buka modal form edit
            onOpenModalForm();
        } catch (error) {
            console.error('Error fetching detail data:', error);
            toast.error('Gagal mengambil data detail.');
        }
    };
    

    const onClickDelete = (row) => {
        setSelectedRow(row);
        onOpenModalAlert();
    };

    const onSubmitDelete = async () => {
        try {
            await deleteFetcher(`/api/wpr`,selectedRow.id);
            mutate();
            onCloseModalAlert();
        } catch (error) {
            console.error(error);
        }
    };

    const onSubmitForm = async (formData) => {
        try {
            const formDataToSend = new FormData();

            // Daftar properti yang diterima sesuai dengan CreateWprDto
            const dtoProperties = [
                'sumberData',
                'keterangan',
                'tahunPengambilan',
                'status',
                'luasWilayah',
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
            
    
            // Tambahkan data keterangan dan polygon
            if (keteranganData) {
                formDataToSend.append('keterangan', keteranganData);
            }
    
            if (polygonData) {
                try {
                    // Parse string JSON ke objek JavaScript
                    const parsedPolygon = JSON.parse(polygonData);
            
                    // Tambahkan data ke FormData sebagai string JSON
                    formDataToSend.append('polygon', JSON.stringify(parsedPolygon));
                } catch (error) {
                    console.error('Format GeoJSON tidak valid:', error);
                    toast.error('Format GeoJSON Polygon tidak valid.');
                    return; // Hentikan proses submit jika parsing gagal
                }
            }
            
    
            // Debug: Melihat isi FormData (Opsional, hapus pada produksi)
            console.log('FormData:', formDataToSend);
    
            // Kirim data menggunakan fetcher multipart/form-data
            const endpoint = isEdit ? `/api/wpr/update/${selectedRow.id}` : `/api/wpr`;
            const method = isEdit ? 'PUT' : 'POST';
    
            await postMultipartFetcher(endpoint,
                formDataToSend);
            // Mutasi data untuk refresh halaman dan tutup modal
            mutate();
            resetForm();
            onCloseForm();
            toast.success('Data berhasil disimpan.');
        } catch (error) {
            console.error('Error saat mengirim data:', error);
            toast.error('Gagal menyimpan data.');
        }
    };   

    const luasWilayahOperators = [
        {
            label: 'Between',
            value: 'between',
            getApplyFilterFn: (filterItem) => {
                if (!Array.isArray(filterItem.value) || filterItem.value.length !== 2) {
                    return null;
                }
                const [min, max] = filterItem.value;
                if (min == null || max == null) {
                    return null;
                }
                return (value) => value != null && min <= value && value <= max;
            },
            InputComponent: InputNumberInterval,
        },
    ];

    // Operator Filter untuk Time Range
    const timeRangeFilterOperators = [
        {
            label: 'Between',
            value: 'between',
            getApplyFilterFn: (filterItem) => {
                const [start, end] = filterItem.value || [];
                if (!start || !end) return null;

                return (value) => {
                    // Ekstrak bagian tanggal (YYYY-MM-DD) dari data ISO 8601
                    const dateValue = new Date(value).toISOString().split('T')[0];
                    const startDate = new Date(start).toISOString().split('T')[0];
                    const endDate = new Date(end).toISOString().split('T')[0];
    
                    // Lakukan perbandingan dengan format YYYY-MM-DD
                    return dateValue >= startDate && dateValue <= endDate;
                };
            },
            InputComponent: InputTimeRange,
        },
    ];

    
    
    // State untuk data dropdown
    const [dataProvinces, setDataProvinces] = useState([]);
    const [dataRegencies, setDataRegencies] = useState([]);
    const [dataDistricts, setDataDistricts] = useState([]);
    const [dataVillages, setDataVillages] = useState([]);

    
    const columns = useMemo(() => [
        {
            field: 'sumberData',
            headerName: 'Sumber Data',
            flex: 1,
        },
        {
            field: 'tahunPengambilan',
            headerName: 'Tanggal Pengambilan',
            flex: 1,
            renderCell: (params) => {
                const date = params?.row?.tahunPengambilan;
                if (!date) return '-';
    
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
            filterOperators:timeRangeFilterOperators,
        },
        {
            field: 'province',
            headerName: 'Provinsi',
            flex: 1,
            valueGetter: (value, row) => {
                return row.location?.province?.name 
            },          
            renderCell: (params) => params?.row?.location?.province?.name || '-',
            filterOperators: [createMultiSelectFilterOperator(provinsiFilterOptions)],
        },
        {
            field: 'regency',
            headerName: 'Kabupaten/Kota',
            flex: 1,
            valueGetter: (params, row) => row?.location?.regency?.name || '',
            renderCell: (params) => params?.row?.location?.regency?.name || '-',
            filterOperators: [createMultiSelectFilterOperator(kabupatenFilterOptions)],
        },
        {
            field: 'district',
            headerName: 'Kecamatan',
            flex: 1,
            
            valueGetter: (params, row) => row?.location?.district?.name || '',
            renderCell: (params) => params?.row?.location?.district?.name || '-',
            filterOperators: [createMultiSelectFilterOperator(kecamatanFilterOptions)],
        },
        {
            field: 'village',
            headerName: 'Desa/Kelurahan',
            flex: 1,
            filterable: true,
            valueGetter: (params, row) => row?.location?.village?.name || '',
            renderCell: (params) => params?.row?.location?.village?.name || '-',
            filterOperators: [createMultiSelectFilterOperator(desaFilterOptions)],
        },
        {
            field: 'luasWilayah',
            headerName: 'Luas Wilayah (ha)',
            flex: 1,
            filterOperators: luasWilayahOperators,
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            filterable: true,
            filterOperators: [createMultiSelectFilterOperator(statusOptions)],
            renderCell: (params) => {
                const status = params.value || ''; // Mengambil nilai dari params.value
                return (
                    <Chip
                    color={status === 'Berizin' ? 'success' : 'danger'}
                    variant="flat"
                    size="sm"
                >
                    {status}
                </Chip>
                );
            }            
        },                
        {
            field: 'action',
            headerName: 'Aksi',
            filterable: false,
            renderCell: (params) => (
                <div className="flex items-center gap-1">
                    <Button size="sm" onPress={() => onClickEdit(params.row)} color="warning" isIconOnly>
                        <PencilSquareIcon className="size-4" />
                    </Button>
                    <Button size="sm" onPress={() => onClickDelete(params.row)} color="danger" isIconOnly>
                        <TrashIcon className="size-4" />
                    </Button>
                </div>
            ),
            sortable: false,
            filterable: false,
        },
    ], [onClickEdit, onClickDelete, provinceOptions, regencyOptions, districtOptions, villageOptions]);
    


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

    // Fungsi untuk menambahkan input foto baru
    const handleAddPhoto = () => {
        const updatedPhotos = [...photos, { id: Date.now(), file: null }];
        setPhotos(updatedPhotos);
        setIsSubmitDisabled(!checkPhotoValidity(updatedPhotos) || !isFormValid());
    };

    // Fungsi untuk mengubah file foto
    const handlePhotoChange = (id, file) => {
        const updatedPhotos = photos.map((photo) =>
            photo.id === id ? { ...photo, file } : photo
        );
        setPhotos(updatedPhotos);
        setIsSubmitDisabled(!checkPhotoValidity(updatedPhotos) || !isFormValid());
    };

    // Fungsi untuk menghapus input foto
    const handleRemovePhoto = (id, isExistingPhoto = false) => {
        // Jika foto adalah foto existing (memiliki URL), tambahkan ID ke deletePhotoIds
        if (isExistingPhoto) {
            setDeletePhotoIds((prev) => [...prev, id]);
        }

        const updatedPhotos = photos.filter((photo) => photo.id !== id);
        setPhotos(updatedPhotos);
        setIsSubmitDisabled(!checkPhotoValidity(updatedPhotos) || !isFormValid());
    };
    // Fungsi untuk memeriksa apakah semua input wajib sudah terisi
    const isFormValid = () => {
        return watchedValues.every((value) => value && value !== '');
    };

    // Fungsi untuk memeriksa apakah minimal satu foto telah diunggah
    const checkPhotoValidity = () => {
        return photos.some((photo) => photo.file !== null || photo.url);
    };


    // Mengatur status tombol submit ketika ada perubahan pada nilai form atau foto
    useEffect(() => {
        const formValid = isFormValid();
        const hasValidPhoto = checkPhotoValidity();
    
        // Tombol submit hanya aktif jika form valid dan ada minimal satu foto
        setIsSubmitDisabled(!(formValid && hasValidPhoto));
    }, [watchedValues, photos]);

    useEffect(() => {
        fetchProvinces();
    }, []);

    useEffect(() => {
        if (selectedProvince) {
            fetchRegencies(selectedProvince);
            setDataDistricts([]); // Reset district options
            setDataVillages([]); // Reset village options
        }
    }, [selectedProvince]);
    
    useEffect(() => {
        if (selectedRegency) {
            fetchDistricts(selectedRegency);
            setDataVillages([]); // Reset village options
        }
    }, [selectedRegency]);
    
    useEffect(() => {
        if (selectedDistrict) {
            fetchVillages(selectedDistrict);
        }
    }, [selectedDistrict]);

    const paginatedData = useMemo(() => {
        if (!filteredData) return [];
        const startIndex = page * pageSize;
        const endIndex = startIndex + pageSize;
        return filteredData.slice(startIndex, endIndex);
    }, [filteredData, page, pageSize]);

    const handleFilterChange = (filterModel) => {
        if (!filterModel.items.length) {
            // Jika tidak ada filter, tampilkan semua data
            setFilteredData(allData);
            return;
        }
    
        // Aplikasikan filter ke allData
        const filtered = allData.filter((row) => {
            return filterModel.items.every((filter) => {
                const { columnField, value, operatorValue } = filter;
                const cellValue = row[columnField]?.toString().toLowerCase() || '';
    
                // Mendukung operator "contains" dan "equals"
                if (operatorValue === 'contains') {
                    return cellValue.includes(value.toLowerCase());
                }
                if (operatorValue === 'equals') {
                    return cellValue === value.toLowerCase();
                }
                return true;
            });
        });
    
        setFilteredData(filtered);
    };

    useEffect(() => {
        if (allData && allData.length > 0) {
            // Mengambil daftar unik untuk provinsi
            const uniqueProvinces = Array.from(
                new Set(allData.map((item) => item.location?.province?.name))
            ).map((name) => ({ label: name, value: name }));
    
            // Mengambil daftar unik untuk kabupaten/kota
            const uniqueRegencies = Array.from(
                new Set(allData.map((item) => item.location?.regency?.name))
            ).map((name) => ({ label: name, value: name }));
    
            // Mengambil daftar unik untuk kecamatan
            const uniqueDistricts = Array.from(
                new Set(allData.map((item) => item.location?.district?.name))
            ).map((name) => ({ label: name, value: name }));
    
            // Mengambil daftar unik untuk desa/kelurahan
            const uniqueVillages = Array.from(
                new Set(allData.map((item) => item.location?.village?.name))
            ).map((name) => ({ label: name, value: name }));
    
            // Mengisi state dengan daftar opsi unik
            setProvinceOptions(uniqueProvinces);
            setRegencyOptions(uniqueRegencies);
            setDistrictOptions(uniqueDistricts);
            setVillageOptions(uniqueVillages);
        }
    }, [allData]);
    

    // Mengambil opsi status dari `allData`
    useEffect(() => {
        if (allData.length > 0) {
        const uniqueStatus = Array.from(new Set(allData.map((item) => item.status)));
        const formattedStatusOptions = uniqueStatus.map((status) => ({
            label: status,
            value: status,
        }));
        setStatusOptions(formattedStatusOptions);
        // Mengambil daftar provinsi unik
        const provinsi = Array.from(new Set(allData.map((item) => item?.location?.province?.name))).filter(Boolean);
        setProvinsiFilterOptions(provinsi.map((name) => ({ label: name, value: name })));

        // Mengambil daftar kabupaten/kota unik
        const kabupaten = Array.from(new Set(allData.map((item) => item?.location?.regency?.name))).filter(Boolean);
        setKabupatenFilterOptions(kabupaten.map((name) => ({ label: name, value: name })));

        // Mengambil daftar kecamatan unik
        const kecamatan = Array.from(new Set(allData.map((item) => item?.location?.district?.name))).filter(Boolean);
        setKecamatanFilterOptions(kecamatan.map((name) => ({ label: name, value: name })));

        // Mengambil daftar desa/kelurahan unik
        const desa = Array.from(new Set(allData.map((item) => item?.location?.village?.name))).filter(Boolean);
        setDesaFilterOptions(desa.map((name) => ({ label: name, value: name })));
        }
    }, [allData]);
    
    return (
        <RootAdmin>
            <Card className="w-full mt-3" radius="sm">
                <CardHeader className="flex justify-between items-center">
                    <p className="text-md">Daftar Wilayah Pertambangan Rakyat (WPR)</p>
                    <Button size="sm" color="primary" startContent={<PlusIcon className="size-4" />} onPress={onOpenModalForm}>
                        Tambah
                    </Button>
                </CardHeader>
                <Divider />
                <CardBody className="w-full h-[550px] p-5">
                <CustomDataGrid
                    data={filteredData}
                    rowCount={filteredData.length}
                    isLoading={isLoading}
                    columns={columns}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    page={page}
                    setPage={setPage}
                    onFilterModelChange={handleFilterChange}
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
            <Modal size="3xl" isOpen={isOpenModalForm} onOpenChange={setIsOpenModalForm} onClose={onCloseForm}>
                <ModalContent>
                    <ModalHeader>{isEdit ? 'Ubah' : 'Tambah'} WPR</ModalHeader>
                    <ModalBody className="overflow-y-auto" style={{ maxHeight: '75vh' }}>
                        <form onSubmit={handleSubmit(onSubmitForm)}>
                            {/* Grid untuk Input Select */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {/* Input untuk Sumber Data */}
                                <ControlledInput
                                    label="Sumber Data"
                                    name="sumberData"
                                    control={control}
                                    placeholder="Masukkan sumber data"
                                    className="mb-4"
                                />

                                {/* Dropdown untuk Status */}
                                <ControlledReactSelect
                                    label="Status"
                                    name="status"
                                    control={control}
                                    options={[
                                        { value: 'Berizin', label: 'Berizin' },
                                        { value: 'Tidak Berizin', label: 'Tidak Berizin' },
                                    ]}
                                    className="mb-4"
                                />
                                <ControlledReactSelect
                                    label="Provinsi"
                                    name="provinceId"
                                    control={control}
                                    options={dataProvinces}
                                    className="mb-4"
                                />

                                <ControlledReactSelect
                                    label="Kabupaten/Kota"
                                    name="regencyId"
                                    control={control}
                                    options={dataRegencies}
                                    className="mb-4"
                                />

                                <ControlledReactSelect
                                    label="Kecamatan"
                                    name="districtId"
                                    control={control}
                                    options={dataDistricts}
                                    className="mb-4"
                                />

                                <ControlledReactSelect
                                    label="Desa/Kelurahan"
                                    name="villageId"
                                    control={control}
                                    options={dataVillages}
                                    className="mb-4"
                                />

                                <ControlledInput
                                    label="Luas Wilayah (ha)"
                                    name="luasWilayah"
                                    control={control}
                                    className="mb-4"
                                />
                                {/* Input Tahun Pengambilan */}
                                <ControlledInput 
                                    label="Tahun Pengambilan" 
                                    name="tahunPengambilan" 
                                    control={control} 
                                    type="date"
                                    placeholder="Masukkan tahun (misal: 2023)"
                                    className="mb-4"
                                />
                            </div>

                            {/* Keterangan */}
                            <div className="mb-20">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Keterangan</label>
                                <ReactQuill
                                    theme="snow"
                                    value={keteranganData}
                                    onChange={(value) => {
                                        setKeteranganData(value);
                                        setValue('keterangan', value);
                                    }}
                                    placeholder="Masukkan keterangan di sini..."
                                    className="w-full h-40 mb-4"
                                />
                            </div>

                        {/* Data Polygon */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mt-4 mb-2">
                                    Data Polygon (GeoJSON Format)
                                </label>
                                <textarea
                                    value={polygonData}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setPolygonData(value);
                                        setValue('polygon', value);
                                    }}
                                    placeholder='Masukkan data GeoJSON Polygon. Contoh: {"type": "Polygon", "coordinates": [[[106.8456, -6.2088], [106.8457, -6.2090], [106.8460, -6.2085], [106.8456, -6.2088]]]}'
                                    className="w-full h-40 p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
                                    rows={6}
                                />
                            </div>

                            {/* Upload Foto */}
                            <div className="mb-8">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Unggah Foto (Minimal 1 Foto)</label>
                                {photos.map((photo, index) => (
                                    <div key={photo.id} className="flex items-center gap-4 mb-4">
                                        {photo.url ? (
                                            <img src={"http://localhost:3002/"+photo.url.url} alt="Existing Photo" className="w-20 h-20 object-cover rounded-md" />
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

                            {/* Tombol Submit */}
                            <div className="flex justify-end mb-6">
                                <Button
                                    type="submit"
                                    color="primary"
                                    size="lg"
                                    disabled={isSubmitDisabled || isSubmitting}
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
