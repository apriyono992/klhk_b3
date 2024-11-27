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
import { AuthModule } from './module/auth.module';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './services/auth.services';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './services/email.services';
import { UploadModule } from './module/upload.module';
import { RegistrasiModule } from './module/registrasi.module';
import { NotifikasiModule } from './module/notifikasi.module';
import { DraftNotifikasiModule } from './module/draftNotifikasi.module';
import { PelaporanPengakutanB3Module } from './module/pelaporanPengakutanB3.module';
import { PelaporanPengakutanStatistikB3Module } from './module/pelaporanPengakutanStatistikB3.module';
import { CountryModule } from './module/country.module';
import { PenyimpananB3Module } from './module/penyimpananB3.module';
import { BahanB3RegistrasiModule } from './module/bahanB3Registrasi.module';
import {InswModule} from "./module/insw.module";
import { PelaporanBahanB3DihasilkanModule } from './module/pelaporanBahanB3Dihasilkan.module';
import { PelaporanDistribusiBahanB3Module } from './module/pelaporanDistribusiBahanB3.module';
import { PeriodModule } from './module/period.module';
import { BahanB3CompanyModule } from './module/bahanB3Company.module';
import { PelaporanPenggunaanB3Module } from './module/pelaporanPenggunaanB3.module';
import { WprModule } from './module/wpr.module';
import { PrismaModule } from './module/prisma.module';
import { UserModule } from './module/user.module';
import {DashboardModule} from "./module/Dashboard.module";
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // This makes ConfigService globally available in your app
    }),
    ValidatorsModule,
    RolesModule,
    UserModule,
    CasbinModule,
    ContentModule,
    MercuryModule,
    SeedModule,
    LocationModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads/photos'), // Path to the uploads/photos folder
      serveRoot: '/uploads/photos', // Serve the files from this URL
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads/photos'), // Path to the uploads/photos folder
      serveRoot: '/uploads/documents', // Serve the files from this URL
    }),
    PDfModule,
    DataMasterModule,
    CompanyModule,
    VehicleModule,
    BahanB3Module,
    InswModule,
    DocumentModule,
    PermohonanRekomendasiB3Module,
    AuthModule,
    UploadModule,
    RegistrasiModule,
    NotifikasiModule,
    DraftNotifikasiModule,
    PelaporanPengakutanB3Module,
    PelaporanPengakutanStatistikB3Module,
    CountryModule,
    PenyimpananB3Module,
    BahanB3RegistrasiModule,
    AuthModule,
    UploadModule,
    RegistrasiModule,
    NotifikasiModule,
    DraftNotifikasiModule,
    PelaporanBahanB3DihasilkanModule,
    PelaporanDistribusiBahanB3Module,
    PelaporanPenggunaanB3Module,
    PeriodModule,
    BahanB3CompanyModule,
    WprModule,
    PrismaModule,
    DashboardModule
  ],
  controllers: [AppController, AuthController],
  providers: [
    AppService,
    JwtProvider,
    EnforcerProvider,
    PermissionUtil,
    Enforcer,
    PrismaService,
    AuthService,
    EmailService,
    CategoriesValidationPipe,
    AuthService,
    EmailService,
  ],
  exports: [ EnforcerProvider, PermissionUtil, Enforcer, PrismaService, CategoriesValidationPipe, EmailService],
})
export class AppModule {}
