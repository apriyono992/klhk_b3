import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesModule } from './module/roles.module';
import { CasbinModule } from './module/casbin.module';
import { ContentModule } from './module/content.module';
import { JwtProvider } from './provider/auth.provider';
import { EnforcerProvider } from './provider/casbin.provider';
import { PrismaService } from './services/prisma.services';
import { PermissionUtil } from './utils/permission';
import { Enforcer } from 'casbin';
import { CategoriesValidationPipe } from './validators/category.pipe';
import { MercuryModule } from './module/mercuryMonitoring.module';
import { SeedModule } from './module/seed.module';
import { LocationModule } from './module/location.module';
import { IsBakuMutuLingkunganExists } from './validators/bakuMutu.validator';
import { IsJenisSampelExists } from './validators/jenisSample.validator';
import { IsProvinceExists } from './validators/province.validator';
import { IsRegencyValid } from './validators/regency.validator';
import { IsDistrictValid } from './validators/district.validator';
import { IsVillageValid } from './validators/village.validator';
import { EndDateConstraint, StartDateConstraint } from './validators/startDateEndDate.validator';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { IsPhotoValidFile } from './validators/photoFileType.validator';
import { IsDocumentValidFile } from './validators/documentFileType.validator';
import { ValidatorsModule } from './module/validators.module';
import { PdfController } from './controller/pdf.controller';
import { PDfModule } from './module/pdf.module';

@Module({
  imports: [
    ValidatorsModule,
    RolesModule,
    CasbinModule, 
    ContentModule,
    MercuryModule,
    SeedModule,
    LocationModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads/photos'), // Path to the uploads/photos folder
      serveRoot: '/uploads/photos',  // Serve the files from this URL
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads/photos'), // Path to the uploads/photos folder
      serveRoot: '/uploads/documents',  // Serve the files from this URL
    }),
    PDfModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtProvider,
    EnforcerProvider,
    PermissionUtil,
    Enforcer,
    PrismaService,
    CategoriesValidationPipe
  ],
  exports: [JwtProvider, EnforcerProvider, PermissionUtil, Enforcer, PrismaService, CategoriesValidationPipe],
})
export class AppModule {}
