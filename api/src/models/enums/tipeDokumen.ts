export enum TipeDokumen { 
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
  FOTO_KENDARAAN = `Foto Kendaraan - Foto berwarna terbaru (foto asli dan bukan editan) untuk masing-masing kendaraan (tampak seluruh badan kendaraan) dengan memperlihatkan:
  a. Identitas perusahaan lengkap (tidak disingkat), dipasang secara permanen pada bagian depan, sisi kiri, kanan, dan belakang kendaraan.
  b. Emergency call pada sisi kiri, kanan, dan belakang kendaraan.
  c. Simbol B3 pada kendaraan mengacu kepada Peraturan Menteri Negara Lingkungan Hidup Nomor 03 tahun 2008 tentang Tatacara Pemberian Simbol dan Label B3, yang dipasang permanen pada bagian depan, sisi kiri, kanan, dan belakang kendaraan.
  d. Untuk kendaraan berupa head truck harus lengkap dengan kemasan yang dibawa (misal: isotank atau container).`,
    // Section 6

  FOTO_SOP_BONGKAR_MUAT_DARURAT_SDS = "Foto SOP Bongkar Muat B3, SOP Tanggap Darurat, dan SDS B3 pada Kendaraan",

  FOTO_KEGIATAN_BONGKAR_MUAT = "Foto kegiatan bongkar muat B3",

  // New Entry for "Foto Kemasan B3"
  FOTO_KEMASAN_B3 = "Foto Kemasan B3 - Foto berwarna kemasan B3 yang memperlihatkan simbol B3 sesuai dengan karateristik B3. Simbol B3 pada kemasan dipasang permanen mengacu kepada Peraturan Menteri Negara Lingkungan Hidup Nomor 03 tahun 2008 tentang Tatacara Pemberian Simbol dan Label B3",

  // New Entry for "Foto Alat Pelindung Diri dan Alat Tanggap Darurat"
  FOTO_ALAT_APD_TANGGAP_DARURAT = `Foto Alat Pelindung Diri (APD) dan Alat Tanggap Darurat - Foto berwarna APD lengkap dan peralatan tanggap darurat pada masing-masing kendaraan yang diajukan. Alat Pelindung Diri meliputi: Masker, Kacamata Pelindung, Safety Shoes, Sarung Tangan, Helmet. Peralatan Tanggap Darurat meliputi: Kotak P3K lengkap, APAR (tidak expired), Rubber Cone, Segitiga Pengaman, Pengganjal Ban, Police Line, Absorbent atau Spill Kit.`,

  // Section 7
  BUKTI_PELATIHAN_B3 = "Daftar hadir pelatihan , materi pelatihan dan sertifikat. Pengemudi/kru armada yang mengangkut B3 telah mengetahui dan memahami tentang B3 yang diangkut, tata cara penanganan darurat di jalan.",

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
}
