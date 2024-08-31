import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesModule } from './module/roles.module';
import { JwtProvider } from './provider/auth.provider';
import { EnforcerProvider } from './provider/casbin.provider';
import { PermissionUtil } from './utils/permission';

@Module({
  imports: [RolesModule],
  controllers: [AppController],
  providers: [AppService, JwtProvider, EnforcerProvider, PermissionUtil],
  exports: [JwtProvider, EnforcerProvider, PermissionUtil],
})
export class AppModule {}
