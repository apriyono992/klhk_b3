import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    UnauthorizedException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { PrismaService } from '../services/prisma.services';
import { RolesAccess } from 'src/models/enums/roles';
  
  @Injectable()
  export class RoleCompanyGuard implements CanActivate {
    constructor(
      private readonly prisma: PrismaService,
      private readonly reflector: Reflector,
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const user = request.user; // User harus sudah tersedia dari JwtAuthGuard
  
      if (!user) {
        throw new UnauthorizedException('Anda harus login.');
      }
  
      const notAllowedRoles = [RolesAccess.PENGELOLA.toString()];
      const userRoles = await this.prisma.userRoles.findMany({
        where: { userId: user.id },
        include: { role: true },
      });
  
      const hasAllowedRole = userRoles.some((userRole) =>
      !notAllowedRoles.includes(userRole.role.name),
      );
  
      if (!hasAllowedRole) {
        const companyIdFilter =
          request.body.companyId ??
          request.body.companyIds ??
          request.query.companyId ??
          undefined;
      
        if (!companyIdFilter) {
          return true; // Jika tidak ada companyId, izinkan akses
        }
      
        // Konversi ke array jika bukan array
        const companyIds = Array.isArray(companyIdFilter)
          ? companyIdFilter
          : [companyIdFilter];
      
        // Ambil perusahaan terkait pengguna
        const userCompanies = await this.prisma.userCompanies.findMany({
          where: { userId: user.id },
          select: { companyId: true }, // Hanya ambil companyId untuk efisiensi
        });
      
        const userCompanyIds = userCompanies.map((uc) => uc.companyId);
      
        // Cek apakah semua companyIds dalam filter terkait dengan user
        const hasAccessToAllCompanies = companyIds.every((companyId) =>
          userCompanyIds.includes(companyId),
        );
      
        if (!hasAccessToAllCompanies) {
          throw new ForbiddenException(
            'Anda tidak memiliki akses ke salah satu perusahaan dalam permintaan.',
          );
        }
      }      
      return true; // Jika lolos semua validasi
    }
  }
  