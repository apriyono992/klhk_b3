export class updatePermohonanRekomDto {
    status?: string; // Optional status update
    tanggalDisetujui?: Date; // Optional approval date
    tanggalBerakhir?: Date; // Optional expiration date
  
    // Arrays for adding, updating, or removing vehicles
    addVehicleIds?: string[]; // Vehicle IDs to be added
    removeVehicleIds?: string[]; // Vehicle IDs to be removed
    updateVehicles?: {
      id: string;
      noPolisi?: string;
      modelKendaraan?: string;
      tahunPembuatan?: number;
      nomorRangka?: string;
      nomorMesin?: string;
      kepemilikan?: string;
    }[]; // Vehicles to be updated
  
    // Arrays for adding, updating, or removing B3 substances
    addB3Substances?: {
      dataBahanB3Id: string;
      b3pp74: boolean;
      b3DiluarList: boolean;
      karakteristikB3: string;
      fasaB3: string;
      jenisKemasan: string;
      asalMuat: string;
      tujuanBongkar: string;
      tujuanPenggunaan: string;
    }[];
    removeB3SubstanceIds?: string[]; // B3 Substance IDs to be removed
    updateB3Substances?: {
      id: string;
      karakteristikB3?: string;
      fasaB3?: string;
      jenisKemasan?: string;
      asalMuat?: string;
      tujuanBongkar?: string;
      tujuanPenggunaan?: string;
    }[]; // B3 Substances to be updated
  }
  