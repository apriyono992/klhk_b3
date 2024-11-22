import React, { useEffect } from "react";
import ControlledReactSelect from "./ControlledReactSelect";
import { useFormContext, useWatch } from "react-hook-form";

export default function LocationSelectGroup({
    dataProvinces,
    dataRegencies,
    dataDistricts,
    dataVillages,
    fetchRegencies,
    fetchDistricts,
    fetchVillages,
    setDataRegencies,
    setDataDistricts,
    setDataVillages,
}) {
    const { control, setValue } = useFormContext();

    // Mengamati perubahan nilai lokasi
    const selectedProvince = useWatch({ name: "provinceId", control });
    const selectedRegency = useWatch({ name: "regencyId", control });
    const selectedDistrict = useWatch({ name: "districtId", control });

    // Mengambil data regencies saat province berubah
    useEffect(() => {
        if (selectedProvince) {
            setValue("regencyId", null);
            setValue("districtId", null);
            setValue("villageId", null);
            setDataRegencies([]);
            setDataDistricts([]);
            setDataVillages([]);
            fetchRegencies(selectedProvince);
        }
    }, [selectedProvince, fetchRegencies, setValue, setDataRegencies, setDataDistricts, setDataVillages]);

    // Mengambil data districts saat regency berubah
    useEffect(() => {
        if (selectedRegency) {
            setValue("districtId", null);
            setValue("villageId", null);
            setDataDistricts([]);
            setDataVillages([]);
            fetchDistricts(selectedRegency);
        }
    }, [selectedRegency, fetchDistricts, setValue, setDataDistricts, setDataVillages]);

    // Mengambil data villages saat district berubah
    useEffect(() => {
        if (selectedDistrict) {
            setValue("villageId", null);
            setDataVillages([]);
            fetchVillages(selectedDistrict);
        }
    }, [selectedDistrict, fetchVillages, setValue, setDataVillages]);

    return (
        <div className="space-y-4">
            <ControlledReactSelect
                key={`province-select-${selectedProvince}`}
                label="Provinsi"
                name="provinceId"
                control={control}
                options={dataProvinces}
                placeholder="Pilih Provinsi"
                required
            />

            <ControlledReactSelect
                key={`regency-select-${selectedRegency}-${selectedProvince}`}
                label="Kabupaten/Kota"
                name="regencyId"
                control={control}
                options={dataRegencies}
                placeholder="Pilih Kabupaten/Kota"
                required
            />

            <ControlledReactSelect
                key={`district-select-${selectedDistrict}-${selectedRegency}`}
                label="Kecamatan"
                name="districtId"
                control={control}
                options={dataDistricts}
                placeholder="Pilih Kecamatan"
                required
            />

            <ControlledReactSelect
                key={`village-select-${selectedDistrict}-${selectedDistrict}`}
                label="Desa/Kelurahan"
                name="villageId"
                control={control}
                options={dataVillages}
                placeholder="Pilih Desa/Kelurahan"
                required
            />
        </div>
    );
}
