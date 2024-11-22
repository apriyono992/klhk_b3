import { Module } from '@nestjs/common';
import { RolesService } from '../services/roles.services';
import { RolesController } from '../controller/roles.controller';
import { JwtProvider } from '../provider/auth.provider';
import { EnforcerProvider } from '../provider/casbin.provider';
import { PermissionUtil } from '../utils/permission';
import { Enforcer } from 'casbin';
import { JwtService } from '@nestjs/jwt';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth.module';


@Module({
    imports: [PrismaModule, AuthModule],
  controllers: [RolesController],
  providers: [ RolesService, JwtService, JwtProvider, EnforcerProvider, PermissionUtil, Enforcer],
  exports: [JwtProvider, EnforcerProvider, PermissionUtil, Enforcer],
})
export class RolesModule {}
