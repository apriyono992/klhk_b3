import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.services';
import { SearchRegistrasiDto } from '../models/searchRegistrasiDto';
import { Prisma } from '@prisma/client';
import { SaveRegistrasiDto } from '../models/saveRegistrasiDto';
import { UpdateRegistrasiPerusahaanDto } from '../models/updateRegistrasiPerusahaanDto';
import * as _ from 'lodash';
import { SavePersyaratanDto } from '../models/savePersyaratanDto';
import { UpdateApprovalPersyaratanDto } from '../models/updateApprovalPersyaratanDto';
import { BahanB3RegistrasiService } from './bahanB3Registrasi.services';
import { CreateRegistrasiDto } from '../models/createRegistrasiDto';
import { BahanB3RegistrasiDto } from '../models/createUpdateBahanB3regDTO';
import {InswServices} from "./insw.services";
import {CreateSubmitDraftSKDto} from "../models/createSubmitDraftSKDto";
import {CreateUpdateValidasiTeknis} from "../models/createUpdateValidasiTeknis";

@Injectable()
export class RegistrasiServices {
  constructor(
    private prisma: PrismaService,
    private readonly bahanB3RegService: BahanB3RegistrasiService,
  ) {}

  async update(id: string, saveRegistrasiDto: SaveRegistrasiDto) {
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
    const bahanB3Exists = await this.prisma.bahanB3Registrasi.findMany({
      where: { id: { in: saveRegistrasiDto.BahanB3RegIds } },
    });
    if (bahanB3Exists.length !== saveRegistrasiDto.BahanB3RegIds.length) {
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
    const registrasi = await this.prisma.registrasi.update({
      where: {
        id: id || '', // Use the provided ID or an empty string (Prisma will throw an error if the ID doesn’t exist in the database)
      },
      data: {
        ..._.omit(saveRegistrasiDto, [
          'tembusanIds',
          'BahanB3Reg',
          'registrasiPersyaratanIds',
        ]),
        approval_status: 'updated', // Set approval_status to 'updated' if it already exists
        no_reg: await this.generateNoRegBahanb3(),
        tembusan: {
          set: saveRegistrasiDto.tembusanIds.map((id) => ({ id })), // Set related Tembusan to avoid duplicate connections
        },
        BahanB3Registrasi: {
          set: saveRegistrasiDto.BahanB3RegIds.map((id) => ({ id })), // Set related Bahan B3 to avoid duplicate connections
        },
        persyaratan: {
          set: saveRegistrasiDto.registrasiPersyaratanIds.map((id) => ({ id })),
        },
      },
      include: {
        tembusan: true,
        BahanB3Registrasi: true,
        company: true,
      },
    });

    return registrasi;
  }

  async create(saveRegistrasiDto: CreateRegistrasiDto) {
    const { BahanB3Reg } = saveRegistrasiDto;
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
    const bahanB3Exists =
      await this.bahanB3RegService.createBahanB3Reg(BahanB3Reg);
  
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
    const registrasi = await this.prisma.registrasi.create({
      data: {
        ..._.omit(saveRegistrasiDto, [
          'tembusanIds',
          'BahanB3Reg',
          'registrasiPersyaratanIds',
        ]),
        approval_status: 'updated', // Set approval_status to 'updated' if it already exists
        no_reg: await this.generateNoRegBahanb3(),
        tembusan: {
          connect: saveRegistrasiDto.tembusanIds.map((id) => ({ id })), // Set related Tembusan to avoid duplicate connections
        },
        BahanB3Registrasi: {
          connect: { id: bahanB3Exists.id },
        },
        persyaratan: {
          connect: saveRegistrasiDto.registrasiPersyaratanIds.map((id) => ({
            id,
          })),
        },
      },
      include: {
        tembusan: true,
        BahanB3Registrasi: true,
        company: true,
      },
    });
  
    return registrasi;
  }

  async submitDraftSK(id: string) {

    const dataRegistrasi = await this.getRegistrasiById(id);
    if(!dataRegistrasi.RegistrasiTembusan) {
      throw new Error("Data Tembusan Kosong atau Invalid")
    }

    if(!dataRegistrasi.berlaku_dari) {
      throw new Error("Berlaku Dari Kosong atau Invalid")
    }

    if(!dataRegistrasi.berlaku_sampai) {
      throw new Error("Berlaku Sampai Kosong atau Invalid")
    }

    if(!dataRegistrasi.nomor_notifikasi_impor) {
      throw new Error("Nomor Notifikasi Impor Kosong atau Invalid")
    }

    if(!dataRegistrasi.pejabatId) {
      throw new Error("Pejabat id Kosong atau Invalid")
    }

    if(!dataRegistrasi.nomor) {
      throw new Error("Nomor Surat Kosong atau Invalid")
    }

    if(!dataRegistrasi.tanggal_surat) {
      throw new Error("Tanggal Surat Kosong atau Invalid")
    }

    const registrasi = await this.prisma.registrasi.update({
      where: { id },
      data: {
        approval_status: 'approve direksi'
      }
    });

    return registrasi;
  }

  async submitInsw(id: string) {

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
        BahanB3Registrasi: {
          include: {
            SektorPenggunaanB3: true,
          },
        },
        company: true,
      },
    });

    // const sendDataInsw = this.inswService.inswSubmitData();

    // console.log(sendDataInsw , "check submit insw");

    console.log(registrasi, " check register");
    return registrasi;
  }

  async listRegistrasiB3(searchRegistrasiDto: SearchRegistrasiDto) {
    const { page, limit, sortBy, sortOrder, search, status } = searchRegistrasiDto;

    const where: Prisma.RegistrasiWhereInput = {
      ...(search && {
        OR: [
          { nama_perusahaan: { contains: search, mode: 'insensitive' } },
          { nomor: { contains: search, mode: 'insensitive' } },
          { kode_db_klh_perusahaan: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(status && { status }),
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

    const registrasiWithIndex = registrasi.map((item, index) => ({
      ...item,
      index: (page - 1) * limit + index + 1,
    }));

    return {
      total,
      page,
      limit,
      registrasi: registrasiWithIndex,
    };
  }

  async getRegistrasiById(id: string) {
    const dataPenjabat = await this.prisma
    const registrasi = await this.prisma.registrasi.findUnique({
      where: { id },
      include: {
        // tembusan: true,
        BahanB3Registrasi: {
          include: {
            SektorPenggunaanB3: true,
          },
        },
        company: true,
        persyaratan: true,
        pejabat: true,
        RegistrasiTembusan: {
          include: {
            DataTembusan: true
          },
        },
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
        approval_status: updateApprovalPersyaratanDto.approval_status,
        status: updateApprovalPersyaratanDto.status,
        approved_by: updateApprovalPersyaratanDto.approved_by,
        nomor: updateApprovalPersyaratanDto.nomor_surat,
        tanggal_surat: updateApprovalPersyaratanDto.tanggal_surat
      },
    });

    return registrasi;
  }

  async updateBahanRegistrasiB3(
    id: string,
    data: Partial<BahanB3RegistrasiDto>,
  ) {
    return await this.prisma.bahanB3Registrasi.update({
      where: { id },
      data: {
        nama_dagang: data.nama_dagang,
        no_reg_bahan: data.no_reg_bahan,
      },
    });
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

  // @Cron('* * * * * *')
  async cronGetDataValidasiTeknis() {

    /**
     *   Rules get PTSP for VAlIDASI TEKNIS
     *
     *   Payload
     *   1. Get Token from Login PTSP
     *   2. Get Nomor Registrasi for detail registrasi PTSP
     */


    // const getToken = await this.env.blablablabla  -> dapetin token data dari login ptsp

    /**
     * const dataPtsp = await this.env.blablablabla  -> Setelah dapat data dari ptsp, return nya kita simpan ke db
     *
     *  - Buat payload nya gw kepikiran si dataPTSP buat function sendiri khusus nampilin response dari ptsp
     *  - continue next step
     */

    // Call table for save data PTSP


  }

  async getListValidasiTeknis(nomor: string) {

    const getAllData = await this.prisma.validasiTeknisRegistrasi.findMany({
      where: { nomor_registrasi: nomor },
    });

    return getAllData;
  }

  async editDocumentValidasiTeknis(id: string, updateData: CreateUpdateValidasiTeknis) {

    return await this.prisma.validasiTeknisRegistrasi.update({
      where: { id: id },
      data: {
        keterangan: updateData.keterangan,
        validasi_valid: updateData.isValid === 'true' ? 1 : 0
      }
    });
  }

  async submitValidasiTeknis(id: string) {
    return await this.prisma.registrasi.update({
      where: { id: id },
      data: {
        approval_status : "draft sk",
        status: "draft"
      },
    });
  }

  async simpanDraftSK(id: string, saveData: CreateSubmitDraftSKDto) {

    const updatePayload: any = {};

    if (saveData.tahun) {
      updatePayload.tahun = saveData.tahun;
    }

    if (saveData.bulan) {
      updatePayload.bulan = saveData.bulan;
    }

    if (saveData.status_izin) {
      updatePayload.status_izin = saveData.status_izin;
    }

    if (saveData.keterangan_sk) {
      updatePayload.keterangan_sk = saveData.keterangan_sk;
    }

    if (saveData.tanggal_terbit) {
      updatePayload.tanggal_terbit = saveData.tanggal_terbit;
    }

    return await this.prisma.registrasi.update({
      where: { id: id },
      data: {
        tahun: updatePayload.tahun ?? undefined,
        bulan: updatePayload.bulan ?? undefined,
        status_izin: updatePayload.status_izin ?? undefined,
        keterangan_sk: updatePayload.keterangan_sk ?? undefined,
        tanggal_terbit: updatePayload.tanggal_terbit ?? undefined,
        berlaku_dari: saveData.berlaku_dari,
        berlaku_sampai: saveData.berlaku_sampai,
        nomor_notifikasi_impor: saveData.nomor_notifikasi_impor,
        pejabatId: saveData.pejabat_id,
        RegistrasiTembusan: {
          deleteMany: saveData.tembusanIds ? {} : undefined, // Remove existing tembusan entries
          create: saveData.tembusanIds
              ? saveData.tembusanIds.map((tembusanId, index) => ({
                dataTembusanId: tembusanId,
                index: index,
              }))
              : undefined,
        },
      },
    });
  }
}
