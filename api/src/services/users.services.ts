import { Injectable, NotFoundException } from '@nestjs/common';
import { SearchUsersDto } from 'src/models/searchUsersDto';
import { PrismaService } from './prisma.services';
import { createHash, createHmac } from 'crypto';
import { User } from '@prisma/client';
import { CreateUserDTO } from 'src/models/createUserDto';
import { omit } from 'lodash';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  // GET Users dengan filter dan pagination
  async getUsers(dto: SearchUsersDto) {
    const { page, limit, sortBy, sortOrder, returnAll, companyIds, nama } = dto;

    const whereClause: any = {};

    // Tambahkan filter companyIds jika ada
    if (companyIds && companyIds.length > 0) {
      whereClause.companyId = { in: companyIds };
    }

    // Tambahkan filter nama jika ada
    if (nama) {
      whereClause.fullName = { contains: nama, mode: 'insensitive' }; // Pencarian nama case-insensitive
    }

    // Jika returnAll diaktifkan, abaikan pagination
    if (returnAll) {
      const data = await this.prisma.user.findMany({
        where: whereClause,
        include: { roles: { include: { role: true } } },
        orderBy: { [sortBy]: sortOrder },
      });
      return { total: data.length, data };
    }

    // Pagination
    const skip = (page - 1) * limit;
    const totalUsers = await this.prisma.user.count({ where: whereClause });
    const users = await this.prisma.user.findMany({
      where: whereClause,
      skip,
      take: limit,
      include: { roles: { include: { role: true } } },
      orderBy: { [sortBy]: sortOrder },
    });

    return { total: totalUsers, data: users };
  }

  async updateUser(
    userId: string,
    payload: Partial<CreateUserDTO>,
    attachments?: Express.Multer.File[] | Express.Multer.File,
  ): Promise<Partial<User>> {
    const {
      email,
      phoneNumber,
      fullName,
      address,
      provinceId,
      cityId,
      rolesIds,
      companyIds,
    } = payload;
  
    // Validasi pengguna
    const existingUser = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!existingUser) {
      throw new NotFoundException('Pengguna tidak ditemukan.');
    }
  
    // Siapkan payload untuk update
    const updatedUserPayload: any = {
      email,
      phoneNumber,
      fullName,
      address,
      provinceId,
      cityId,
    };
  
    // Menangani upload foto KTP baru
    if (attachments) {
      if ((attachments as Express.Multer.File[]).length) {
        const file = (attachments as Express.Multer.File[])[0];
        updatedUserPayload.idPhotoUrl = file.path;
      } else {
        updatedUserPayload.idPhotoUrl = (attachments as Express.Multer.File).path;
      }
    }
  
    return await this.prisma.$transaction(async (prisma) => {
      // Update data pengguna
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updatedUserPayload,
      });
  
      // Update relasi roles
      if (rolesIds) {
        const roleIdsArray = Array.isArray(rolesIds) ? rolesIds : [rolesIds];
  
        // Hapus semua roles lama
        await prisma.userRoles.deleteMany({
          where: { userId },
        });
  
        // Tambahkan roles baru
        await prisma.userRoles.createMany({
          data: roleIdsArray.map((roleId) => ({
            userId,
            roleId,
          })),
          skipDuplicates: true,
        });
      }
  
      // Update relasi companies
      if (companyIds) {
        const companyIdsArray = Array.isArray(companyIds) ? companyIds : [companyIds];
  
        // Hapus semua companies lama
        await prisma.userCompanies.deleteMany({
          where: { userId },
        });
  
        // Tambahkan companies baru
        await prisma.userCompanies.createMany({
          data: companyIdsArray.map((companyId) => ({
            userId,
            companyId,
          })),
          skipDuplicates: true,
        });
      }
  
      return omit(updatedUser, ['password', 'salt']);
    });
  }

  async createUser(
    payload: CreateUserDTO,
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
      rolesIds,
      idNumber,
      companyIds,
    } = payload;
  
    // Validasi cityId
    const existingCity = await this.prisma.regencies.findUnique({
      where: { id: cityId },
    });
  
    if (!existingCity) {
      throw new NotFoundException('Kota tidak valid.');
    }
  
    // Hash password dan KTP
    const salt = uuidV4();
    const hashedPassword = createHmac('sha256', salt).update(password).digest('hex');
    const hashedKTP = createHash('sha256').update(idNumber).digest('hex');
  
    // Siapkan payload untuk pengguna baru
    const newUserPayload: any = {
      email,
      phoneNumber,
      fullName,
      password: hashedPassword,
      salt,
      address,
      provinceId,
      cityId,
      idNumber: hashedKTP,
    };
  
    // Menangani upload foto KTP
    if (attachments) {
      if ((attachments as Express.Multer.File[]).length) {
        const file = (attachments as Express.Multer.File[])[0];
        newUserPayload.idPhotoUrl = file.path;
      } else {
        newUserPayload.idPhotoUrl = (attachments as Express.Multer.File).path;
      }
    }
  
    return await this.prisma.$transaction(async (prisma) => {
      // Buat pengguna baru
      const user = await prisma.user.create({
        data: newUserPayload,
      });
  
      // Tambahkan relasi roles
      if (rolesIds) {
        const roleIdsArray = Array.isArray(rolesIds) ? rolesIds : [rolesIds];
        await prisma.userRoles.createMany({
          data: roleIdsArray.map((roleId) => ({
            userId: user.id,
            roleId,
          })),
          skipDuplicates: true,
        });
      }
  
      // Tambahkan relasi companies
      if (companyIds) {
        const companyIdsArray = Array.isArray(companyIds) ? companyIds : [companyIds];
        await prisma.userCompanies.createMany({
          data: companyIdsArray.map((companyId) => ({
            userId: user.id,
            companyId,
          })),
          skipDuplicates: true,
        });
      }
  
      return omit(user, ['password', 'salt']);
    });
  }
  
  async getUserById(userId: string): Promise<Partial<User>> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: { include: { role: true } }, // Ambil data roles pengguna
        companies: { include: { company: true } }, // Ambil data perusahaan
      },
    });
  
    if (!user) {
      throw new NotFoundException('Pengguna tidak ditemukan.');
    }
  
    // Kembalikan data tanpa password dan salt
    return omit(user, ['password', 'salt']);
  }
}


