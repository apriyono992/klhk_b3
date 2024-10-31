import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.services';
import { CreateCompanyDto } from '../models/CreateCompanyDto';
import { UpdateCompanyDto } from '../models/updateCompanyDto';
import { Prisma } from '@prisma/client';
import { SearchCompanyDto } from 'src/models/searchCompanyDto';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a new company
  async createCompany(createCompanyDto: CreateCompanyDto) {
    try {
      return await this.prisma.company.create({
        data: {
          ...createCompanyDto,
          alamatPool: createCompanyDto.alamatPool || [], // Handle alamatPool as an array
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        // Handle unique constraint violation
        throw new ConflictException('Unique constraint failed on one of the fields (name, NPWP, kodeDBKlh, nomorInduk)');
      }
      throw error;
    }
  }

  // Get a single company by ID
  async getCompany(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    return company;
  }

  // Get a list of companies with optional search and pagination
  async getCompanies(searchDto: SearchCompanyDto) {
    const { page = 1, limit = 10, name, npwp, bidangUsaha, kodeDBKlhk, sortBy = 'createdAt', sortOrder = 'desc' } = searchDto;
    const skip = (page - 1) * limit;
  
    // Build the search conditions dynamically
    const where: Prisma.CompanyWhereInput = {
      ...(name && { name: { contains: name, mode: 'insensitive' } }),
      ...(npwp && { npwp: { contains: npwp, mode: 'insensitive' } }),
      ...(bidangUsaha && { bidangUsaha: { contains: bidangUsaha, mode: 'insensitive' } }),
      ...(kodeDBKlhk && { kodeDBKlhk: { contains: kodeDBKlhk, mode: 'insensitive' } }),
    };
  
    // Query companies with pagination and sorting
    const companies = await this.prisma.company.findMany({
      where, // Prisma can handle an empty `where` condition
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    });
  
    const total = await this.prisma.company.count({
      where,
    });
  
    return {
      total,
      page,
      limit,
      data: companies,
    };
  }

  // Update an existing company by ID
  async updateCompany(id: string, updateCompanyDto: UpdateCompanyDto) {
    try {
      // Check if the company exists
      const company = await this.prisma.company.findUnique({
        where: { id },
      });

      if (!company) {
        throw new NotFoundException(`Company with ID ${id} not found`);
      }

      // Update the company with new data, handling alamatPool (preserve if not updated)
      return this.prisma.company.update({
        where: { id },
        data: {
          ...updateCompanyDto,
          alamatPool: updateCompanyDto.alamatPool || company.alamatPool, // Handle alamatPool update
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        // Handle unique constraint violation
        throw new ConflictException('Unique constraint failed on one of the fields (name, NPWP, kodeDBKlh, nomorInduk)');
      }
      throw error;
    }
  }

  // Delete a company by ID
  async deleteCompany(id: string) {
    // Check if the company exists
    const company = await this.prisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    // Delete the company
    return this.prisma.company.delete({
      where: { id },
    });
  }
}
