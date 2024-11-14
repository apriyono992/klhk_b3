import { Module } from '@nestjs/common';
import { BahanB3Controller } from 'src/controller/bahanB3.controller';
import { BahanB3Service } from 'src/services/bahanB3.services';
import { PrismaService } from 'src/services/prisma.services';

@Module({
  controllers: [BahanB3Controller], // No controllers in this module
  providers: [
    PrismaService, // Shared Prisma service
    BahanB3Service,
  ],
  exports: [
    BahanB3Service, // Export services to make them available for other modules
  ],
})
export class BahanB3Module {}
