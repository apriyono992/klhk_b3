import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { JwtAuthGuard } from 'src/utils/auth.guard';
import { RolesGuard } from 'src/utils/roles.guard';
import { RoleCompanyGuard } from 'src/utils/roleCompany.guard';
import { JwtProvider } from 'src/provider/auth.provider';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/services/prisma.services';
import { AuthModule } from './auth.module';

@Module({
    imports: [PrismaModule,AuthModule
    ],
    providers: [
        PrismaService,
        JwtProvider,
        JwtAuthGuard, 
        RolesGuard,
        RoleCompanyGuard
    ],
    exports: [
        JwtProvider,
        JwtService,
        JwtAuthGuard,
        RolesGuard,
        RoleCompanyGuard
    ]
})
export class GuardModule {}