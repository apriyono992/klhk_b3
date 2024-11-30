import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { RegisterUserDTO } from 'src/models/auth/registerUser.dto';
import { v4 as uuidV4 } from 'uuid';
import { createHash, createHmac } from 'crypto';
import { PrismaService } from './prisma.services';
import { LoginRequestDTO } from 'src/models/auth/loginRequest.dto';
import { LoginResponseDTO } from 'src/models/auth/loginResponse.dto';
import { JwtService } from '@nestjs/jwt';
import { addHours } from 'date-fns';
import { omit } from 'lodash';
import { ResetPasswordRequestDTO } from 'src/models/auth/resetPasswordRequest.dto';
import * as path from 'path';
import { replaceTemplate } from 'src/utils/html/emailTemplateHelper';
import { EmailService } from './email.services';
import { RolesAccess } from 'src/models/enums/roles';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  /**
   * @description8e4902eb-cfd0-4768-a9ea-6d82d9f8b431
   * Register user to create an user account to login into the system
   */
  async registerUser(
    payload: RegisterUserDTO,
    attachments: Express.Multer.File[] | Express.Multer.File,
  ): Promise<Partial<User>> {
    const {
      email,
      phoneNumber,
      fullName,
      password,
      address,
      provinceId,
      cityId,
      rolesId,
      idNumber,
      idPhotoUrl
    } = payload;

    const existingCity = await this.prisma.regencies.findUnique({
      where: {
        id: cityId,
      },
    });

    if (!existingCity) {
      throw new NotFoundException('City is not valid');
    }

    const existingPhoneNumber = await this.prisma.user.findUnique({
      where: {
        phoneNumber,
      },
    });

    if (existingPhoneNumber) {
      throw new BadRequestException('Phone number is already used');
    }

    const salt = uuidV4();

    const hashedPassword = createHmac('sha256', salt)
      .update(password)
      .digest('hex');

    const hashedKTP = createHash('sha256').update(idNumber).digest('hex');

    const newUserPayload = {
      email,
      phoneNumber,
      fullName,
      password: hashedPassword,
      salt,
      address,
      provinceId,
      cityId,
      rolesId,
      idNumber: hashedKTP,
      idPhotoUrl,
    };

    if (attachments) {
      if ((attachments as Express.Multer.File[]).length) {
        const file = (
          attachments as Express.Multer.File[]
        )[0] as Express.Multer.File;
        newUserPayload.idPhotoUrl = file.path;
      } else {
        newUserPayload.idPhotoUrl = (attachments as Express.Multer.File).path;
      }
    }

    const user = await this.prisma.user.create({
      data: newUserPayload,
    });

    const superAdminRole = await this.prisma.roles.findUnique({
      where: { name: RolesAccess.PENGELOLA },
    });

    if (!superAdminRole) {
      throw new Error('Role SuperAdmin tidak ditemukan');
    }

    await this.prisma.userRoles.create({
          data: {
            userId:user.id,
            roleId: superAdminRole.id
          },
      });

    return omit(user, ['password', 'salt']);
  }

  async loginUser(payload: LoginRequestDTO): Promise<LoginResponseDTO> {
    const { email, password, clientId, clientSecret } = payload;

    const existingUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
      include:{
        roles:{
          include:{
            role:true
          }
        }
      }
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const hashedPassword = createHmac('sha256', existingUser.salt)
      .update(password)
      .digest('hex');

    if (hashedPassword !== existingUser.password) {
      throw new BadRequestException('Password is incorrect');
    }

    if (process.env.CLIENT_ID !== clientId) {
      throw new BadRequestException('clientId is incorrect');
    }

    const getClientSecret = await this.prisma.secret.findUnique({
      where: {
        clientId,
      },
    });

    if (getClientSecret.clientSecret !== clientSecret) {
      throw new BadRequestException('clientSecret is incorrect');
    }

    return this.generateToken(existingUser);
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId },
      include:{
        roles:{
          include:{
            role:true
          }
        }
      } });

    if (!user || user.refreshToken !== refreshToken) {
      throw new BadRequestException('Invalid refresh token');
    }

    return this.generateToken(user);
  }

  async resetPassword(payload: ResetPasswordRequestDTO): Promise<void> {
    const { email, newPassword } = payload;

    const existingUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const salt = uuidV4();

    const hashedPassword = createHmac('sha256', salt)
      .update(newPassword)
      .digest('hex');

    await this.prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        password: hashedPassword,
        salt,
      },
    });
  }

  async forgotPassword(email: string): Promise<void> {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    const resetToken = uuidV4();

    await this.prisma.resetPassword.create({
      data: {
        userId: existingUser.id,
        token: resetToken,
        expiredAt: addHours(new Date(), 1),
        used: false,
      },
    });

    const templatePath = path.join(
      __dirname,
      '../../src/utils/html',
      'templates',
      'resetPasswordTemplate.html',
    );

    const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const replacements = { resetPasswordUrl };
    const emailHtml = replaceTemplate(templatePath, replacements);
    await this.emailService.sendEmail(
      email,
      'Reset Kata Sandi',
      'Silakan klik tautan berikut untuk mereset kata sandi Anda.',
      emailHtml,
    );
  }

  async validateToken(token: string) {
    try {
      return this.jwtService.verify(token); // Validate the token and return the payload
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async getPayload(token: string) {
    return this.jwtService.decode(token); // Decode the token to extract the payload
  }
  
  private async generateToken(user: User) {
    const payload = {
      userId: user.id,
      fullName: user.fullName
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    const sessionExpired = addHours(new Date(), 1).getTime();
    return {
      accessToken,
      refreshToken,
      sessionExpired,
    };
  }
}
