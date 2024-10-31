import { Module } from '@nestjs/common';
import { AuthController } from 'src/controller/auth.controller';
import { AuthService } from 'src/services/auth.services';
import { PrismaService } from 'src/services/prisma.services';
import { EmailService } from 'src/services/email.services';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { IsEmailExistConstraint } from 'src/validators/isEmailExists.validator';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    JwtService,
    EmailService,
    IsEmailExistConstraint,
  ],
  exports: [PrismaService, JwtModule],
})
export class AuthModule {}