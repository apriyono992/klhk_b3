import { Global, Module } from '@nestjs/common';
import { IsPhotoValidFile } from '../validators/photoFileType.validator';
import { IsDocumentValidFile } from '../validators/documentFileType.validator';
import { EndDateConstraint, StartDateConstraint } from 'src/validators/startDateEndDate.validator';
import { IsBakuMutuLingkunganExists } from 'src/validators/bakuMutu.validator';
import { IsJenisSampelExists } from 'src/validators/jenisSample.validator';
import { IsProvinceExists } from 'src/validators/province.validator';
import { IsRegencyValid } from 'src/validators/regency.validator';
import { IsDistrictValid } from 'src/validators/district.validator';
import { IsVillageValid } from 'src/validators/village.validator';
import { PrismaService } from 'src/services/prisma.services';
import { IsPejabatExists, PejabatIdExistsConstraint, PejabatUsedConstraint } from 'src/validators/dataPejabat.validator';
import { DataBahanB3MustConstaint, IsBahanB3Exists, IsDataBahanB3Exist, IsDataBahanB3Exists, IsNamaBahanKimiaB3Exist, IsNamaBahanKimiaExists } from 'src/validators/dataBahanB3.validator';
import { IsTembusanExists, TembusanIdExistsConstraint } from 'src/validators/dataTembusan.validator';
import { ApplicationExistsConstraint } from 'src/validators/isApplicationIdExists.validatior';
import { CompanyExistsConstraint } from 'src/validators/isCompanyExists.validator';
import { VehicleExistsConstraint } from 'src/validators/isVehicleExists.validator';
import { DraftSuratExistsConstraint } from 'src/validators/isDraftSuratExists.validator';
import { DraftNotifikasiConstraint, EuReferenceContsraint, NotifikasiConstraint } from 'src/validators/notifikasi.validator';

@Global()  // This makes the module global
@Module({
  providers: [
    PrismaService,
    {
      provide: IsPhotoValidFile,
      useFactory: () => {
        return new IsPhotoValidFile();
      },
    },
    {
      provide: IsDocumentValidFile,
      useFactory: () => {
        return new IsDocumentValidFile();
      },
    },
    StartDateConstraint,
    EndDateConstraint,
    IsBakuMutuLingkunganExists,
    IsJenisSampelExists,
    IsProvinceExists,
    IsRegencyValid,
    IsDistrictValid,
    IsVillageValid,
    IsPejabatExists,
    IsBahanB3Exists,
    IsDataBahanB3Exists,
    IsTembusanExists,
    ApplicationExistsConstraint,
    CompanyExistsConstraint,
    VehicleExistsConstraint,
    DraftSuratExistsConstraint,
    PejabatIdExistsConstraint,
    PejabatUsedConstraint,
    TembusanIdExistsConstraint,
    IsTembusanExists,
    NotifikasiConstraint,
    DraftNotifikasiConstraint,
    IsNamaBahanKimiaExists,
    EuReferenceContsraint,
    DataBahanB3MustConstaint

  ],
  exports: [
    IsPhotoValidFile,
    IsDocumentValidFile,
    StartDateConstraint,
    EndDateConstraint,
    IsBakuMutuLingkunganExists,
    IsJenisSampelExists,
    IsProvinceExists,
    IsRegencyValid,
    IsDistrictValid,
    IsVillageValid,
    IsPejabatExists,
    IsBahanB3Exists,
    IsTembusanExists,
    ApplicationExistsConstraint,
    CompanyExistsConstraint,
    VehicleExistsConstraint,
    DraftSuratExistsConstraint,
    PejabatIdExistsConstraint,
    PejabatUsedConstraint,
    TembusanIdExistsConstraint,
    IsTembusanExists,
    NotifikasiConstraint,
    DraftNotifikasiConstraint,
    IsNamaBahanKimiaExists,
    EuReferenceContsraint
  ],
})
export class ValidatorsModule {}
