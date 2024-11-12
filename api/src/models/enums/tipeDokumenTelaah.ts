// TypeScript Enum Definition
export enum TipeDokumenTelaah {
    // Section 1
    AKTE_PERUSAHAAN = "Akte Perusahaan",
    PENGESAHAN_AKTA_PERUSAHAAN = "Pengesahan Akta Perusahaan dari Kementerian Hukum dan HAM",
  
    // Section 2
    MSDS_LDK_B3 = "Material Safety Data Sheet (MSDS) / LDK B3 yang diangkut",
  
    // Section 3
    BUKTI_KEPEMILIKAN_ALAT_ANGKUT = "Bukti kepemilikan alat angkut",
    SOP_BONGKAR_MUAT = "SOP Bongkar Muat B3",
  
    // Section 4
    SOP_TANGGAP_DARURAT = "SOP penanganan dalam keadaan darurat sesuai dengan jenis dan karakteristik B3 yang akan diangkut",
    
    // Section 5: Sub-sections for "Foto Kendaraan"
    FOTO_IDENTITAS_PERUSAHAAN = "Foto Identitas Perusahaan",
    FOTO_EMERGENCY_CALL = "Foto Emergency Call",
    FOTO_SIMBOL_B3 = "Foto Simbol B3",
    FOTO_SOP_BONGKAR_MUAT = "Foto SOP Bongkar Muat B3 dan SOP Tanggap Darurat",
    FOTO_MSDS = "Foto MSDS B3 pada kendaraan",
    FOTO_APD = "Foto APD dan Peralatan Tanggap darurat",
    FOTO_KEMASAN_B3 = "Foto Kemasan B3 Jika Kendaraan Berupa Head Truck",
  
    // Section 6
    FOTO_KEGIATAN_BONGKAR_MUAT = "Foto kegiatan bongkar muat B3",
  
    // Section 7
    BUKTI_PELATIHAN_B3 = "Bukti pelatihan pengangkutan dan penanganan B3",
  
    // Section 8
    TANGKI_UKUR_MOBIL = "Surat Keterangan Tangki Ukur Mobil (TUM)",
  
    // Section 9
    BEJANA_TEKAN = "Surat keterangan Bejana Tekan (untuk jenis B3 yang termasuk ke dalam lampiran II PER 01/MEN/1982 'Bejana Tekan')",
  
    // Section 10
    IP_PREKURSOR = "IP/PT Prekursor atau surat keterangan (Jasa Transporter)",
  
    // Section 11
    INFORMASI_ALAT_KOMUNIKASI = "Surat Informasi ketersediaan Alat komunikasi/pemeliharaan kendaraan/pencucian tangki",
  
    // Section 12
    SURAT_REKOMENDASI_SEBELUMNYA = "Foto copy Surat Rekomendasi yang sudah di terbitkan sebelumnya",
  
    // Section 13
    IZIN_PENGANGKUTAN_B3_SEBELUMNYA = "Copy SK Dirjen Perhubungan Darat Tentang Izin Pengangkutan B3 sebelumnya",
  
    // Section 14
    DOKUMEN_SOFT_COPY = "Seluruh dokumen permohonan disertakan dalam bentuk soft copy"
  }