import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../services/prisma.services';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Ambil roles yang diizinkan dari metadata
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true; // Jika tidak ada roles yang ditentukan, izinkan akses
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Pastikan user di-set oleh JwtAuthGuard

    if (!user) {
      throw new ForbiddenException('User tidak ditemukan dalam request.');
    }

    // Ambil roles pengguna dari database
    const userWithRoles = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: { roles: { include: { role: true } } }, // Ambil data roles
    });

    if (!userWithRoles || userWithRoles.roles.length === 0) {
      throw new ForbiddenException('Anda tidak memiliki roles untuk mengakses resource ini.');
    }

    // Ambil nama roles pengguna
    const userRoles = userWithRoles.roles.map((userRole) => userRole.role.name);

    // Periksa apakah salah satu roles cocok dengan roles yang diizinkan
    const hasRole = userRoles.some((role) => roles.includes(role));

    if (!hasRole) {
      throw new ForbiddenException('Anda tidak memiliki akses ke resource ini.');
    }

    return true;
  }
}
