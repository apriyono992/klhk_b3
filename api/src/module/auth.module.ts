import { Module } from '@nestjs/common';
import { AuthController } from 'src/controller/auth.controller';
import { AuthService } from 'src/services/auth.services';
import { PrismaService } from 'src/services/prisma.services';
import { EmailService } from 'src/services/email.services';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { IsEmailExistConstraint } from 'src/validators/isEmailExists.validator';
import { RoleCompanyGuard } from 'src/utils/roleCompany.guard';
import { JwtAuthGuard } from 'src/utils/auth.guard';
import { RolesGuard } from 'src/utils/roles.guard';
import { JwtProvider } from 'src/provider/auth.provider';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    PrismaModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    EmailService,
    IsEmailExistConstraint,
    JwtProvider,
    JwtAuthGuard, 
    RolesGuard,
    RoleCompanyGuard
  ],
  exports: [PrismaService, 
    JwtModule,     
    JwtProvider,
    JwtAuthGuard, 
    RolesGuard,
    RoleCompanyGuard],
})
export class AuthModule {}