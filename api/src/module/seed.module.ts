import { Module } from '@nestjs/common';
import { PrismaService } from '../services/prisma.services';
import { SeedController } from 'src/controller/seed.controler';
import { JwtProvider } from 'src/provider/auth.provider';
import { EnforcerProvider } from 'src/provider/casbin.provider';
import { PermissionUtil } from 'src/utils/permission';
import { Enforcer } from 'casbin';
import { SeedService } from 'src/services/seed.services';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth.module';


@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [SeedController],
  providers: [ PrismaService,  EnforcerProvider, PermissionUtil, Enforcer, SeedService  ],
  exports: [ EnforcerProvider, PermissionUtil, Enforcer],
})
export class SeedModule {}