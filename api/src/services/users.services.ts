import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { SearchUsersDto } from 'src/models/searchUsersDto';
import { PrismaService } from './prisma.services';
import { createHash, createHmac } from 'crypto';
import { User } from '@prisma/client';
import { CreateUserDTO } from 'src/models/createUserDto';
import { omit } from 'lodash';
import { v4 as uuidV4 } from 'uuid';
import { RolesAccess } from 'src/models/enums/roles';
import { UpdateUserDto } from 'src/models/updateUserDto';

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
      // Hilangkan data sensitif
      const sanitizedData = data.map((user) =>
        omit(user, ['password', 'salt']),
      );
      return { total: data.length, data:sanitizedData };
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

    // Hilangkan data sensitif
    const sanitizedData = users.map((user) =>
      omit(user, ['password', 'salt']),
    );

    return { total: totalUsers, data: sanitizedData };
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
      idNumber = '1234567890123456',
      companyIds,
    } = payload;
  
    // Validasi cityId
    if(rolesIds.includes(RolesAccess.SUPER_ADMIN)){
      throw new BadRequestException('Tidak dapat membuat pengguna');
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
    }else{
      newUserPayload.idPhotoUrl = 'http://localhost:3002/uploads/photos/tes.png';
    }
  
    const province = await this.prisma.province.findFirst();
    const city = await this.prisma.regencies.findFirst( {where: { provinceId: provinceId }});
    newUserPayload.provinceId = province.id;
    newUserPayload.cityId = city.id;
    return await this.prisma.$transaction(async (prisma) => {
      // Buat pengguna baru
      const user = await prisma.user.create({
        data: newUserPayload,
      });
      

      // Tambahkan relasi roles
      if (rolesIds) {
        const roleIdsArray = Array.isArray(rolesIds) ? rolesIds : [rolesIds];
        const roles = [];
        for (const roleId of roleIdsArray) {
          const role = await prisma.roles.findFirst({ where: { name: roleId } });
          if (role) {
            roles.push(role.id);
          }
        }
        await prisma.userRoles.createMany({
          data: roles.map((roleId) => ({
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

  async updateUserWithDto(userId: string, updateUserDto: UpdateUserDto): Promise<any> {
    const { fullName, oldPassword, newPassword } = updateUserDto;

    // Validasi pengguna
    const existingUser = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!existingUser) {
      throw new NotFoundException('Pengguna tidak ditemukan.');
    }

    // Validasi kata sandi lama
    if (oldPassword) {
      const hashedOldPassword = createHmac('sha256', existingUser.salt)
        .update(oldPassword)
        .digest('hex');

      if (hashedOldPassword !== existingUser.password) {
        throw new ForbiddenException('Password lama tidak cocok.');
      }
    }

    // Validasi dan hash kata sandi baru
    let hashedNewPassword = null;
    if (newPassword) {
      hashedNewPassword = createHmac('sha256', existingUser.salt)
        .update(newPassword)
        .digest('hex');
    }

    // Siapkan payload untuk update
    const updatePayload: any = {};
    if (fullName) updatePayload.fullName = fullName;
    if (hashedNewPassword) updatePayload.password = hashedNewPassword;

    // Update data di database
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updatePayload,
    });

    return omit(updatedUser, ['password', 'salt']);
  }
}


