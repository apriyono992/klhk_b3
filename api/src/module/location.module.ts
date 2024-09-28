import { Module } from '@nestjs/common';
import { PrismaService } from '../services/prisma.services';
import { JwtProvider } from 'src/provider/auth.provider';
import { EnforcerProvider } from 'src/provider/casbin.provider';
import { PermissionUtil } from 'src/utils/permission';
import { Enforcer } from 'casbin';
import { LocationController } from 'src/controller/location.controller';
import { LocationService } from 'src/services/location.services';

@Module({
  controllers: [LocationController],
  providers: [ PrismaService, JwtProvider, EnforcerProvider, PermissionUtil, Enforcer, LocationService  ],
  exports: [JwtProvider, EnforcerProvider, PermissionUtil, Enforcer],
})
export class LocationModule {}