import { Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../services/prisma.services';  // Shared Prisma service
import { MercuryMonitoringService } from '../services/mercuryMonitoring.services';  // MercuryMonitoring service
import { JenisSampleTypeService } from '../services/jenisSampleType.services';  // JenisSampleType service
import { JenisSampleService } from '../services/jenisSample.services';  // JenisSample service
import { MercuryMonitoringController } from 'src/controller/mercuryMonitoring.controller';
import { JenisSampleController } from 'src/controller/jenisSample.controller';
import { JenisSampleTypeController } from 'src/controller/jenisSampleType.controller';

@Module({
  controllers: [MercuryMonitoringController, JenisSampleController, JenisSampleTypeController,],  // No controllers in this module
  providers: [        
    PrismaService,// Shared Prisma service
    MercuryMonitoringService,  // MercuryMonitoring service
    JenisSampleTypeService,     // JenisSampleType service
    JenisSampleService,         // JenisSample service
  ],
  exports: [
    MercuryMonitoringService,  // Export services to make them available for other modules
    JenisSampleTypeService,
    JenisSampleService,
  ]
})

export class MercuryModule {};
