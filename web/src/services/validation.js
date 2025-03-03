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
        sifatSurat: yup.string().required('Harus diisi'),
        tipeSurat: yup.string().required('Harus diisi'),
        perusaahaanAsal: yup.string().required('Harus diisi'),
        namaPengirimNotifikasi: yup.string().required('Harus diisi'),
        emailPenerima: yup.string().email('Email harus valid').required('Harus diisi'),
        pejabatId: yup.string().required('harus diisi'),
        tembusanIds: yup.array()
                        .min(1, 'Minimal 1 tembusan')
                        .required('Harus diisi'),
}).required()

export const draftImportApprovalLetter = yup.object().shape({
        sifatSurat: yup.string().required('Harus diisi'),
        tipeSurat: yup.string().required('Harus diisi'),
        regulation: yup.string().required('Harus diisi'),
        nomorSuratKebenaranImport: yup.string().required('Harus diisi'),
        nomorSuratPerusahaanPengimpor: yup.string().required('Harus diisi'),
        nomorSuratExplicitConsent: yup.string().required('Harus diisi'),
        pejabatId: yup.string().required('harus diisi'),
        tembusanIds: yup.array()
                        .min(1, 'Minimal 1 tembusan')
                        .required('Harus diisi'),
}).required()

export const draftImportEcLetter = yup.object().shape({
        jenisExplicitConsent: yup.string().required('Harus diisi'),
        tujuanSurat: yup.string().required('Harus diisi'),
        namaExporter: yup.string().when('jenisExplicitConsent', {
                is: (val) => val === 'Non Echa',
                then: (schema) => schema.required('Harus diisi'),
                otherwise: (schema) => schema.notRequired(),
        }),
        namaImpoter: yup.string().when('jenisExplicitConsent', {
                is: (val) => val === 'Non Echa',
                then: (schema) => schema.required('Harus diisi'),
                otherwise: (schema) => schema.notRequired(),
        }),
        tujuanImport: yup.string().when('jenisExplicitConsent', {
                is: (val) => val === 'Non Echa',
                then: (schema) => schema.required('Harus diisi'),
                otherwise: (schema) => schema.notRequired(),
        }),
        nameOfChemicalSubstance: yup.string().when('jenisExplicitConsent', {
                is: (val) => val === 'Echa',
                then: (schema) => schema.required('Harus diisi'),
                otherwise: (schema) => schema.notRequired(),
        }),
        casNumberSubstance: yup.string().when('jenisExplicitConsent', {
                is: (val) => val === 'Echa',
                then: (schema) => schema.required('Harus diisi'),
                otherwise: (schema) => schema.notRequired(),
        }),
        nameOfPreparation: yup.string().when('jenisExplicitConsent', {
                is: (val) => val === 'Echa',
                then: (schema) => schema.required('Harus diisi'),
                otherwise: (schema) => schema.notRequired(),
        }),
        nameOfChemicalInPreparation: yup.string().when('jenisExplicitConsent', {
                is: (val) => val === 'Echa',
                then: (schema) => schema.required('Harus diisi'),
                otherwise: (schema) => schema.notRequired(),
        }),
        concentrationInPreparation: yup.string().when('jenisExplicitConsent', {
                is: (val) => val === 'Echa',
                then: (schema) => schema.required('Harus diisi'),
                otherwise: (schema) => schema.notRequired(),
        }),
        casNumberPreparation: yup.string().when('jenisExplicitConsent', {
                is: (val) => val === 'Echa',
                then: (schema) => schema.required('Harus diisi'),
                otherwise: (schema) => schema.notRequired(),
        }),
        consentToImport: yup.string().when('jenisExplicitConsent', {
                is: (val) => val === 'Echa',
                then: (schema) => schema.required('Harus diisi'),
                otherwise: (schema) => schema.notRequired(),
        }),
        dnaInstitutionName: yup.string().when('jenisExplicitConsent', {
                is: (val) => val === 'Echa',
                then: (schema) => schema.required('Harus diisi'),
                otherwise: (schema) => schema.notRequired(),
        }),
        dnaContactName: yup.string().when('jenisExplicitConsent', {
                is: (val) => val === 'Echa',
                then: (schema) => schema.required('Harus diisi'),
                otherwise: (schema) => schema.notRequired(),
        }),
        dnaTelephone: yup.string().when('jenisExplicitConsent', {
                is: (val) => val === 'Echa',
                then: (schema) => schema.matches(/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/, 'Nomor telepon harus valid').required('Harus diisi'),
                otherwise: (schema) => schema.notRequired(),
        }),
        dnaInstitutionAddress: yup.string().when('jenisExplicitConsent', {
                is: (val) => val === 'Echa',
                then: (schema) => schema.required('Harus diisi'),
                otherwise: (schema) => schema.notRequired(),
        }),
        dnaTelefax: yup.string().when('jenisExplicitConsent', {
                is: (val) => val === 'Echa',
                then: (schema) => schema.matches(/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/, 'Nomor telepon harus valid').required('Harus diisi'),
                otherwise: (schema) => schema.notRequired(),
        }),
        dnaEmail: yup.array().when('jenisExplicitConsent', {
                is: (val) => val === 'Echa',
                then: (schema) => schema.of(yup.object().shape({value: yup.string().email('Email harus valid').required("Harus diisi")})).min(1, "Minimal 1 email"),
                otherwise: (schema) => schema.notRequired(),
        }),
        pejabatId: yup.string().required('harus diisi'),
        tembusanIds: yup.array()
                        .min(1, 'Minimal 1 tembusan')
                        .required('Harus diisi'),
}).required()

export const b3Storage =  yup.object().shape({
        companyId: yup.string().required('Harus diisi'),   
        alamatGudang: yup.string().required('Harus diisi'),   
        longitude: yup.number().required('Harus diisi'),   
        latitude: yup.number().required('Harus diisi'),   
        luasArea: yup.number().required('Harus diisi'),   
}).required()

export const carbonCopy = yup.object().shape({
        nama: yup.string().required('Harus diisi'),
        tipe: yup.string().required('Harus diisi'),   
}).required()

export const validateStorageValidation = yup.object().shape({
        isValid: yup.boolean().oneOf([true, false], 'Isi harus valid atau tidak valid'),
        validationNotes: yup.string().when('isValid', {
                is: (val) => val === true,
                then: (schema) => schema.notRequired(),
                otherwise: (schema) => schema.required('Harus diisi'),
        }),   
}).required()

export const createNotificationValidation =  yup.object().shape({
        databahanb3Id: yup.string().required('harus diisi'),
        referenceNumber: yup.string().required('Harus diisi'),
        companyId: yup.string().required('Harus diisi'),
        negaraAsal: yup.string().required('Harus diisi'),
}).required()

export const notificationStatusChangeValidation =  yup.object().shape({
        tanggalPerubahan: yup.date().typeError('Tanggal harus valid').required('Harus diisi'),
        notes: yup.string().required('Harus diisi'),
        status: yup.string().required('Harus diisi'),
        tipeSurat: yup.string().when('status', {
            is: (val) => val === 'Ada Rencana Import',
            then: (schema) => schema.required(),
            otherwise: (schema) => schema.notRequired(),
        })
}).required()

export const uploadStorageImageValidation = yup.object().shape({
        documentType: yup.string().required('Harus diisi'),
        photos: yup.array()
                        .min(1, "Minimal 1 foto")
                        .test("fileType", "Ekstensi file tidak di dukung", (files) =>
                                files?.every((file) => ["image/jpeg", "image/png"].includes(file.type))
                        )
                        .test("fileSize", "File maksimal 2mb", (files) =>
                                files?.every((file) => file.size <= 2 * 1024 * 1024)
                        ),
}).required()

export const createTransportReportValidation = yup.object().shape({
        
}).required()

export const periodValidation = yup.object().shape({
        name: yup.string().required('Harus diisi'),
        startPeriodDate: yup
            .date()
            .typeError('Tanggal harus valid')
            .required('Harus diisi')
            .max(yup.ref('endPeriodDate'), 'Tanggal mulai tidak bisa lebih besar dari tanggal akhir'), // Ensure startPeriodDate is before endPeriodDate
        endPeriodDate: yup
            .date()
            .typeError('Tanggal harus valid')
            .required('Harus diisi')
            .min(yup.ref('startPeriodDate'), 'Tanggal akhir harus lebih besar dari tanggal mulai'), // Ensure endPeriodDate is after startPeriodDate
        startReportingDate: yup
            .date()
            .typeError('Tanggal harus valid')
            .required('Harus diisi')
            .min(yup.ref('startPeriodDate'), 'Tanggal mulai pelaporan harus setelah tanggal mulai periode'), // Ensure startReportingDate is after startPeriodDate
        endReportingDate: yup
            .date()
            .typeError('Tanggal harus valid')
            .required('Harus diisi')
            .min(yup.ref('endPeriodDate'), 'Tanggal selesai pelaporan tidak bisa lebih besar dari tanggal akhir periode'), // Ensure endReportingDate is before endPeriodDate
        finalizationDeadline: yup
            .date()
            .typeError('Tanggal harus valid')
            .required('Harus diisi')
            .min(yup.ref('endPeriodDate'), 'Batas waktu finalisasi harus setelah tanggal akhir periode'), // Ensure finalizationDeadline is after endPeriodDate
        isActive: yup
            .boolean()
            .oneOf([true, false], 'Isi harus aktif atau tidak aktif')
            .required('Harus diisi'),
        isReportingActive: yup
            .boolean()
            .oneOf([true, false], 'Isi harus pelaporan aktif atau tidak aktif')
            .required('Harus diisi'),
}).required();

export const loadingCompanyValidation = yup.object().shape({
        namaPerusahaan: yup.string().required('Harus diisi'),
        alamat: yup.string().required('Harus diisi'),
        longitude: yup.number().required('Harus diisi'),
        latitude: yup.number().required('Harus diisi'),
        provinceId: yup.number().required('Harus diisi'),
        regencyId: yup.number().required('Harus diisi'),
        districtId: yup.number().required('Harus diisi'),
        villageId: yup.number().required('Harus diisi'),
}).required()

export const createReportVehicleValidation = yup.object().shape({
        b3SubstanceId: yup.string().required('Harus diisi'),
        jumlahB3: yup.number().required('Harus diisi'),
        // perusahaanAsalMuatDanTujuanBongkar: yup.array()
        //                                         .of(yup.object().shape({
        //                                                 name: yup.string().required("Harus diisi"),
        //                                                 alamat: yup.string().required("Harus diisi"),
        //                                                 longitude: yup.string().required("Harus diisi"),
        //                                                 latitude: yup.string().required("Harus diisi"),
        //                                         }))
        //                                         .min(1, "Minimal 1 tujuan bongkar"),
        // perusahaanAsalMuat: yup.object().shape({
        //         perusahaanAsalMuatId: yup.string().required('Harus ada'),
        //         locationType: yup.string().required('Harus ada'),
        //         longitudeAsalMuat: yup.number().required('Harus ada'),
        //         latitudeAsalMuat: yup.number().required('Harus ada')
        // }),
        // perusahaanTujuanBongkar: yup.array()
        //         .min(1, 'Minimal 1 tujuan bongkar')
        //         .required('Harus diisi'),
}).required()

export const createReportProductionValidation = yup.object().shape({
        companyId: yup.string().required('Harus diisi'),
        periodId: yup.string().required('Harus diisi'),
        bulan: yup.number().required('Harus diisi'),
        tahun: yup.number().required('Harus diisi'),
        tipeProduk: yup.string().required('Harus diisi'), 
        dataBahanB3Id: yup.string().when('tipeProduk', {
                is: (val) => val === 'Bahan Berbahaya dan Beracun',
                then: (schema) => schema.required(),
                otherwise: (schema) => schema.notRequired(),
        }),
        prosesProduksi: yup.string().required('Harus diisi'),
        jumlahB3Dihasilkan: yup.number().required('Harus diisi')
}).required()

export const adminReportValidation = yup.object().shape({
        status: yup.boolean().oneOf([true, false], 'Isi harus disetujui atau tidak disetujui'),
        adminNote: yup.string().when('status', {
                is: (val) => val === false,
                then: (schema) => schema.required('Harus diisi'),
                otherwise: (schema) => schema.notRequired(),
        }),
}).required()

export const createReportDistributionValidation = yup.object().shape({
        companyId: yup.string().required('Harus diisi'),
        periodId: yup.string().required('Harus diisi'),
        bulan: yup.number().required('Harus diisi'),
        tahun: yup.number().required('Harus diisi'),
        dataBahanB3Id: yup.string().required('Harus diisi'),
        dataTransporters: yup.array()
                .min(1, 'Minimal 1 transporter')
                .required('Harus diisi'),
        dataCustomers: yup.array()
                .min(1, 'Minimal 1 customer')
                .required('Harus diisi'),
}).required()

export const createReportConsumptionValidation = yup.object().shape({
        companyId: yup.string().required('Harus diisi'),
        periodId: yup.string().required('Harus diisi'),
        bulan: yup.number().required('Harus diisi'),
        tahun: yup.number().required('Harus diisi'),
        dataBahanB3Id: yup.string().required('Harus diisi'),
        jumlahPembelianB3: yup.number().required('Harus diisi'),
        jumlahB3Digunakan: yup.number().required('Harus diisi'),
        tipePembelian: yup.string().required('Harus diisi'),
        noRegistrasi: yup.string().when('tipePembelian', {
                is: (val) => val === 'Impor',
                then: (schema) => schema.required('Harus diisi'),
                otherwise: (schema) => schema.notRequired(),
        }),
        dataSuppliers: yup.array().when('tipePembelian', {
                is: (val) => val === 'Lokal',
                then: (schema) => schema.min(1, 'Minimal 1 supplier').required('Harus diisi'),
                otherwise: (schema) => schema.notRequired(),
        }),
}).required()

export const supplierValidation = yup.object().shape({
        namaSupplier: yup.string().required('Harus diisi'),
        alamat: yup.string().required('Harus diisi'),
        email: yup.string().email('Email harus valid').required('Harus diisi'),
        telepon: yup.string().matches(/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/, 'Nomor telepon harus valid').required('Harus diisi'),
        fax: yup.string().matches(/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/, 'Nomor fax harus valid').required('Harus diisi'),
        longitude: yup.number().required('Harus diisi'),
        latitude: yup.number().required('Harus diisi'),
        provinceId: yup.number().required('Harus diisi'),
        regencyId: yup.number().required('Harus diisi'),
        districtId: yup.number().required('Harus diisi'),
        villageId: yup.number().required('Harus diisi'),
        // dataPICs: yup.array()
        //                 .min(1, 'Minimal 1 PIC')
        //                 .required('Harus diisi'),
}).required()

export const asalMuatValidation = yup.object().shape({
        namaPerusahaan: yup.string().required('Harus diisi'),
        alamat: yup.string().required('Harus diisi'),   
        locationType: yup.string().required('Harus diisi'),   
        latitude: yup.number().required('Harus diisi'),   
        longitude: yup.number().required('Harus diisi'),   
        provinceId: yup.string().required('Harus diisi'),   
        regencyId: yup.string().required('Harus diisi'),   
        districtId: yup.string().required('Harus diisi'),   
        villageId: yup.string().required('Harus diisi'),  
}).required()
    
