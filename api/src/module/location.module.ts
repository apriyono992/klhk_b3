import { Module } from '@nestjs/common';
import { PrismaService } from '../services/prisma.services';
import { JwtProvider } from 'src/provider/auth.provider';
import { EnforcerProvider } from 'src/provider/casbin.provider';
import { PermissionUtil } from 'src/utils/permission';
import { Enforcer } from 'casbin';
import { LocationController } from 'src/controller/location.controller';
import { LocationService } from 'src/services/location.services';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth.module';


@Module({
    imports: [PrismaModule, AuthModule],
  controllers: [LocationController],
  providers: [ PrismaService,  EnforcerProvider, PermissionUtil, Enforcer, LocationService  ],
  exports: [ EnforcerProvider, PermissionUtil, Enforcer],
})
export class LocationModule {}