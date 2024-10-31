import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.services';
import { SearchRegistrasiDto } from '../models/searchRegistrasiDto';
import { Prisma } from '@prisma/client';
import { SaveRegistrasiDto } from '../models/saveRegistrasiDto';
import { UpdateRegistrasiPerusahaanDto } from '../models/updateRegistrasiPerusahaanDto';
import * as _ from 'lodash';
import { BahanB3Service } from './bahanB3.services';
import { UpdateB3PermohonanRekomDto } from '../models/updateB3PermohonanRekomDto';
import { SavePersyaratanDto } from '../models/savePersyaratanDto';
import { UpdateApprovalPersyaratanDto } from '../models/updateApprovalPersyaratanDto';

@Injectable()
export class RegistrasiServices {
  constructor(
    private prisma: PrismaService,
    private readonly bahanB3Service: BahanB3Service,
  ) {}

  async saveRegistrasiSKB3(saveRegistrasiDto: SaveRegistrasiDto) {
    // Ensure that the Company exists
    const company = await this.prisma.company.findUnique({
      where: { id: saveRegistrasiDto.companyId },
    });
    if (!company) {
      throw new NotFoundException(
        `Company with ID ${saveRegistrasiDto.companyId} not found`,
      );
    }

    // Ensure that all Tembusan IDs exist
    const tembusanExists = await this.prisma.dataTembusan.findMany({
      where: { id: { in: saveRegistrasiDto.tembusanIds } },
    });
    if (tembusanExists.length !== saveRegistrasiDto.tembusanIds.length) {
      throw new NotFoundException(`Some Tembusan IDs do not exist`);
    }

    // Ensure that all Bahan B3 IDs exist
    const bahanB3Exists = await this.prisma.b3Substance.findMany({
      where: { id: { in: saveRegistrasiDto.B3SubtanceIds } },
    });
    if (bahanB3Exists.length !== saveRegistrasiDto.B3SubtanceIds.length) {
      throw new NotFoundException(`Some Bahan B3 IDs do not exist`);
    }

    // Ensure that all persyaratan exist
    const persyaratanExist = await this.prisma.persyaratan.findMany({
      where: { id: { in: saveRegistrasiDto.registrasiPersyaratanIds } },
    });
    if (
      persyaratanExist.length !==
      saveRegistrasiDto.registrasiPersyaratanIds.length
    ) {
      throw new NotFoundException(`Some Persyaratan IDs do not exist`);
    }

    // Create the Registrasi entry with related Tembusan and b3subtance entries
    const registrasi = await this.prisma.registrasi.upsert({
      where: {
        id: saveRegistrasiDto.id || '', // Use the provided ID or an empty string (Prisma will throw an error if the ID doesn’t exist in the database)
      },
      update: {
        ..._.omit(saveRegistrasiDto, [
          'tembusanIds',
          'B3SubtanceIds',
          'registrasiPersyaratanIds',
        ]),
        approval_status: 'updated', // Set approval_status to 'updated' if it already exists
        no_reg_bahanb3: await this.generateNoRegBahanb3(),
        tembusan: {
          set: saveRegistrasiDto.tembusanIds.map((id) => ({ id })), // Set related Tembusan to avoid duplicate connections
        },
        B3Substance: {
          set: saveRegistrasiDto.B3SubtanceIds.map((id) => ({ id })), // Set related Bahan B3 to avoid duplicate connections
        },
        persyaratan: {
          set: saveRegistrasiDto.registrasiPersyaratanIds.map((id) => ({ id })),
        },
      },
      create: {
        ..._.omit(saveRegistrasiDto, [
          'tembusanIds',
          'B3SubtanceIds',
          'registrasiPersyaratanIds',
        ]),
        approval_status: 'created',
        tembusan: {
          connect: saveRegistrasiDto.tembusanIds.map((id) => ({ id })), // Connect related Tembusan on create
        },
        B3Substance: {
          connect: saveRegistrasiDto.B3SubtanceIds.map((id) => ({ id })), // Connect related Bahan B3 on create
        },
        persyaratan: {
          connect: saveRegistrasiDto.registrasiPersyaratanIds.map((id) => ({
            id,
          })),
        },
      },
      include: {
        tembusan: true,
        B3Substance: true,
        company: true,
      },
    });

    return registrasi;
  }

  async submitDraftSK(id: string) {
    const existingRegistrasi = await this.prisma.registrasi.findUnique({
      where: { id },
    });
    if (!existingRegistrasi) {
      throw new NotFoundException(`Registrasi with ID ${id} not found`);
    }

    // Create the Registrasi entry with related Tembusan and BahanB3 entries
    const registrasi = await this.prisma.registrasi.update({
      where: { id },
      data: {
        approval_status: 'pending',
        is_draft: false,
      },
      include: {
        tembusan: true,
        B3Substance: {
          include: {
            dataBahanB3: true,
            application: {
              include: {
                identitasPemohon: true,
              },
            },
          },
        },
        company: true,
      },
    });

    return registrasi;
  }

  async listRegistrasiB3(searchRegistrasiDto: SearchRegistrasiDto) {
    const { page, limit, sortBy, sortOrder, search } = searchRegistrasiDto;

    const where: Prisma.RegistrasiWhereInput = {
      ...(search && {
        OR: [
          { nama_perusahaan: { contains: search, mode: 'insensitive' } },
          { nomor: { contains: search, mode: 'insensitive' } },
          { kode_db_klh_perusahaan: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };
    const [registrasi, total] = await Promise.all([
      this.prisma.registrasi.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.registrasi.count({ where }),
    ]);

    return {
      total,
      page,
      limit,
      registrasi,
    };
  }

  async getRegistrasiById(id: string) {
    const registrasi = await this.prisma.registrasi.findUnique({
      where: { id },
      include: {
        tembusan: true,
        B3Substance: {
          include: {
            dataBahanB3: true,
            application: {
              include: {
                identitasPemohon: true,
              },
            },
          },
        },
        company: true,
        persyaratan: true,
      },
    });

    if (!registrasi) {
      throw new NotFoundException(`Registrasi with ID ${id} not found`);
    }

    return registrasi;
  }

  async updateStatusApprovalSubmitSk(
    id: string,
    updateApprovalPersyaratanDto: UpdateApprovalPersyaratanDto,
  ) {
    await this.getRegistrasiById(id);
    const registrasi = await this.prisma.registrasi.update({
      where: { id },
      data: {
        approved_by: updateApprovalPersyaratanDto.approved_by,
        approval_status: updateApprovalPersyaratanDto.status,
      },
    });

    return registrasi;
  }

  async updateBahanRegistrasiB3(data: UpdateB3PermohonanRekomDto) {
    return await this.bahanB3Service.updateB3Substance(data);
  }

  async updatePerusahaanRegistrasiB3(
    id: string,
    updateRegistrasiPerusahaanDto: UpdateRegistrasiPerusahaanDto,
  ) {
    const registrasi = await this.getRegistrasiById(id);
    const results = await this.prisma.registrasi.update({
      where: { id: registrasi.id },
      data: updateRegistrasiPerusahaanDto,
    });
    return results;
  }

  async savePersyaratan(createPersyaratanDto: SavePersyaratanDto) {
    const persyaratan = await this.prisma.persyaratan.upsert({
      where: { id: createPersyaratanDto.id || '' },
      update: {
        ...createPersyaratanDto,
        status: createPersyaratanDto.status ?? 'dibuat',
      },
      create: {
        ...createPersyaratanDto,
        status: createPersyaratanDto.status ?? 'dibuat',
      },
    });

    return persyaratan;
  }

  async updateStatusApprovalPersyaratan(
    id: string,
    updateApprovalPersyaratanDto: UpdateApprovalPersyaratanDto,
  ) {
    await this.getPersyaratanById(id);
    const persyaratan = await this.prisma.persyaratan.update({
      where: { id },
      data: {
        approved_by: updateApprovalPersyaratanDto.approved_by,
        status: updateApprovalPersyaratanDto.status,
      },
    });

    return persyaratan;
  }

  async getPersyaratanById(id: string) {
    const persyaratan = await this.prisma.persyaratan.findUnique({
      where: { id },
    });

    if (!persyaratan) {
      throw new NotFoundException(`Persyaratan with ID ${id} not found`);
    }

    return persyaratan;
  }

  async generateNoRegBahanb3() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetter = () =>
      letters[Math.floor(Math.random() * letters.length)];
    const randomNumber = () => Math.floor(Math.random() * 10);

    // Generate the registration number in the format RCH45Q1A
    const noReg = `R${randomLetter()}${randomLetter()}${randomNumber()}${randomNumber()}Q${randomNumber()}${randomLetter()}`;

    return noReg;
  }
}
