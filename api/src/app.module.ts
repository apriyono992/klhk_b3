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
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ValidatorsModule } from './module/validators.module';
import { PDfModule } from './module/pdf.module';
import { DataMasterModule } from './module/dataMaster.module';
import { CompanyModule } from './module/company.module';
import { VehicleModule } from './module/vehicle.module';
import { BahanB3Module } from './module/bahanB3.module';
import { DocumentModule } from './module/document.module';
import { PermohonanRekomendasiB3Module } from './module/permohonanRekom.module';
import { RegistrasiModule } from './module/registrasi.module';
import { NotifikasiModule } from './module/notifikasi.module';
import { DraftNotifikasiModule } from './module/draftNotifikasi.module';

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
      serveRoot: '/uploads/photos', // Serve the files from this URL
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads/photos'), // Path to the uploads/photos folder
      serveRoot: '/uploads/documents', // Serve the files from this URL
    }),
    PDfModule,
    DataMasterModule,
    CompanyModule,
    VehicleModule,
    BahanB3Module,
    DocumentModule,
    PermohonanRekomendasiB3Module,
    RegistrasiModule,
    NotifikasiModule,
    DraftNotifikasiModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtProvider,
    EnforcerProvider,
    PermissionUtil,
    Enforcer,
    PrismaService,
    CategoriesValidationPipe,
  ],
  exports: [
    JwtProvider,
    EnforcerProvider,
    PermissionUtil,
    Enforcer,
    PrismaService,
    CategoriesValidationPipe,
  ],
})
export class AppModule {}
