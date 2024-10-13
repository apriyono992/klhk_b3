export class createPermohonanRekomDto {
    status: string; // Status of the application
    tipeSurat: string; // Type of surat
    tanggalPengajuan: Date; // Date when application is submitted
    vehicleIds: string[]; // List of vehicle IDs associated with the application
    b3Substances: {
      dataBahanB3Id: string;
      b3pp74: boolean;
      b3DiluarList: boolean;
      karakteristikB3: string;
      fasaB3: string;
      jenisKemasan: string;
      asalMuat: string;
      tujuanBongkar: string;
      tujuanPenggunaan: string;
    }[]; // B3 substances related to the application
  }
  