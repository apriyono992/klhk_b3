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
import { IsPejabatExists } from 'src/validators/dataPejabat.validator';
import { IsBahanB3Exists } from 'src/validators/dataBahanB3.validator';
import { IsTembusanExists } from 'src/validators/dataTembusan.validator';

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
    IsTembusanExists
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
    IsTembusanExists
], 
})
export class ValidatorsModule {}
