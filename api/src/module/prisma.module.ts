import { Module } from '@nestjs/common';
import { PrismaService } from '../services/prisma.services';  // Shared Prisma service

@Module({
  providers: [PrismaService],
  exports: [PrismaService],  // Export PrismaService for use in other modules
})
export class PrismaModule {}