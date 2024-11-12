import * as yup from 'yup';

export const reviewMaterialSchema =  yup.object().shape({
    dataBahanB3Id: yup.string().required('Harus diisi'),   
    b3pp74: yup.boolean().oneOf([true, false], 'Isi harus valid atau tidak valid'),   
    b3DiluarList: yup.boolean().oneOf([true, false], 'Isi harus valid atau tidak valid'),   
    karakteristikB3: yup.string().required('Harus diisi'),
    fasaB3: yup.string().required('Harus diisi'),
    jenisKemasan: yup.string().required('Harus diisi'),
    asalMuat: yup.array()
                    .of(yup.object().shape({
                            name: yup.string().required("Harus diisi"),
                            alamat: yup.string().required("Harus diisi"),
                            longitude: yup.string().required("Harus diisi"),
                            latitude: yup.string().required("Harus diisi"),
                    }))
                    .min(1, "Minimal 1 asal muat"),
    tujuanBongkar: yup.array()
                    .of(yup.object().shape({
                            name: yup.string().required("Harus diisi"),
                            alamat: yup.string().required("Harus diisi"),
                            longitude: yup.string().required("Harus diisi"),
                            latitude: yup.string().required("Harus diisi"),
                    }))
                    .min(1, "Minimal 1 tujuan bongkar"),
    tujuanPenggunaan: yup.string().required('Harus diisi'), 
}).required()

export const registerUserSchema =  yup.object().shape({
        fullName: yup.string().required('Harus diisi'),
        email: yup.string().email('Email harus valid').required('Harus diisi'),
        password: yup.string().required('Harus diisi'),
}).required()

export const draftRecomendationLetter = yup.object().shape({
        pejabatId: yup.string().required('harus diisi'),
}).required()

export const draftImportVerficationLetter = yup.object().shape({
        nomorSurat: yup.string().required('Harus diisi'),
        tanggalSurat: yup.date().typeError('Tanggal harus valid').required('harus diisi'),
        tanggalMaksimalSurat: yup.date().typeError('Tanggal harus valid').required('harus diisi'),
        tipeSurat: yup.string().required('Harus diisi'),
        sifatSurat: yup.string().required('Harus diisi'),
        negaraAsal: yup.string().required('Harus diisi'),
        namaPengirimNotifikasi: yup.string().required('Harus diisi'),
        perusaahaanAsal: yup.string().required('Harus diisi'),
        emailPenerima: yup.string().email('Email harus valid').required('Harus diisi'),
        tanggalPengiriman: yup.date().typeError('Tanggal harus valid').required('harus diisi'),
        // dataBahanB3Id: yup.string().required('harus diisi'),
        pejabatId: yup.string().required('harus diisi'),
        tembusanIds: yup.array()
                        .min(1, 'Minimal 1 tembusan')
                        .required('Harus diisi'),
}).required()