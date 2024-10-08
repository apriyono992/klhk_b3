import { Input } from '@nextui-org/react';
import React from 'react'
import { useFormContext } from 'react-hook-form';
import * as yup from 'yup';

const FILE_SIZE = 3 * 1024 * 1024; // 3 MB
const SUPPORTED_FORMATS = ['application/pdf'];

const fieldInput = [
    'Akte Pendirian Perusahaan dan Akte Perubahan (jika ada perubahan)',
    'Surat Pengesahan Akte Pendirian Perusahaan / Akte Perubahan dari Kementerian Hukum dan HAM',
    'SDS (Safety Data Sheet) / LDK (Lembar Data Keselamatan)',
    'Bukti Kepemilikan Alat Angkut',
    'SOP Bongkar Muat B3',
    'SOP Tanggap Darurat',
    'Foto Kendaraan',
    'Foto SOP Bongkar Muat B3, SOP Tanggap Darurat, dan SDS B3 pada Kendaraan',
    'Foto Kegiatan Bongkar Muat B3',
    'Foto Kemasan B3',
    'Foto Alat Pelindung Diri (APD) dan Alat Tanggap Darurat pada masing-masing kendaraan yang diajukan',
    'Bukti pelatihan penanganan dan pengangkutan B3',
    'Surat Keterangan Hasil Pengujian Tangki Ukur Mobil (TUM) khusus kendaraan tangki',
    'Surat KeteranganBejana Tekan',
    'IT/IP Prekursor(Produsen) atau surat pernyataan',
    'Informasi Kendaraan B3',
    'Surat rekomendasi pengangkutan B3 sebelumnya',
    'SK Dirjen Perhubungan Darat tentang Izin Pengangkutan B3 sebelumnya',
];

const generateFileValidation = (fieldInput) => {
    const validationObject = {};
    fieldInput.forEach((_, index) => {
        validationObject[`file_${index + 1}`] = yup.mixed()
            .test('fileRequired', 'harus diisi', (value) => {
                return value && value.length > 0;
            })
            .test('fileSize', 'ukuran file terlalu besar', (value) => {
                return value && value[0]?.size <= FILE_SIZE;
            })
            .test('fileFormat', 'format file tidak didukung', (value) => {
                return value && SUPPORTED_FORMATS.includes(value[0]?.type);
            });
    });
    return yup.object().shape(validationObject).required();
};
  
export const stepThreeSchema = generateFileValidation(fieldInput);

export default function StepThreeForm() {
    const { register, formState: { errors } } = useFormContext();

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-7'>
            {fieldInput.map((field, index) => (
                <Input
                    key={index}
                    {...register(`file_${index + 1}`)}
                    type='file'
                    isRequired
                    variant="faded"
                    label={field}
                    color={errors[`file_${index + 1}`] ? 'danger' : 'default'}
                    isInvalid={errors[`file_${index + 1}`]}
                    errorMessage={errors[`file_${index + 1}`] && errors[`file_${index + 1}`].message}
                />
            ))}
        </div>
    )
}
