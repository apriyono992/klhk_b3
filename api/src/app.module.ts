import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesModule } from './module/roles.module';
import { CasbinModule } from './module/casbin.module';
import { JwtProvider } from './provider/auth.provider';
import { EnforcerProvider } from './provider/casbin.provider';
import { PermissionUtil } from './utils/permission';
import { Enforcer } from 'casbin';

@Module({
  imports: [RolesModule, CasbinModule],
  controllers: [AppController],
  providers: [AppService, JwtProvider, EnforcerProvider, PermissionUtil, Enforcer],
  exports: [JwtProvider, EnforcerProvider, PermissionUtil, Enforcer],
})
export class AppModule {}
