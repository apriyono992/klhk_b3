import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtProvider } from '../provider/auth.provider';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../services/prisma.services';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtProvider: JwtProvider,
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector, // Untuk membaca metadata public
  ) {}
    
  private readonly logger = new Logger(JwtAuthGuard.name)
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Periksa apakah endpoint bersifat public
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (isPublic) {
      return true; // Jika public, izinkan akses
    }

    // Jika tidak public, lakukan autentikasi
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const token = authHeader.replace('Bearer ', '');
    try {
      const payload = this.jwtProvider.validateToken(token); // Validasi token
      const user = await this.prisma.user.findUnique({
        where: { id: payload.userId },
        include:{
          roles:{include:{role:true}}
        }
      });
      this.logger.debug(payload, user)
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      request.user = user; // Tambahkan user ke request untuk akses selanjutnya
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
