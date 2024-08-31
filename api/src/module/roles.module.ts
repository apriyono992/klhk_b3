import { Module } from '@nestjs/common';
import { RolesService } from '../services/roles.services';
import { RolesController } from '../controller/roles.controller';
import { JwtProvider } from '../provider/auth.provider';
import { EnforcerProvider } from '../provider/casbin.provider';
import { PermissionUtil } from '../utils/permission';
import { Enforcer } from 'casbin';

@Module({
  controllers: [RolesController],
  providers: [ RolesService, JwtProvider, EnforcerProvider, PermissionUtil, Enforcer],
  exports: [JwtProvider, EnforcerProvider, PermissionUtil, Enforcer],
})
export class RolesModule {}
