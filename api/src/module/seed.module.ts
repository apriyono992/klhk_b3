import { Module } from '@nestjs/common';
import { PrismaService } from '../services/prisma.services';
import { SeedController } from 'src/controller/seed.controler';
import { JwtProvider } from 'src/provider/auth.provider';
import { EnforcerProvider } from 'src/provider/casbin.provider';
import { PermissionUtil } from 'src/utils/permission';
import { Enforcer } from 'casbin';
import { SeedService } from 'src/services/seed.services';

@Module({
  controllers: [SeedController],
  providers: [ PrismaService, JwtProvider, EnforcerProvider, PermissionUtil, Enforcer, SeedService  ],
  exports: [JwtProvider, EnforcerProvider, PermissionUtil, Enforcer],
})
export class SeedModule {}