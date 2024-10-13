import { Module } from '@nestjs/common';
import { DataMasterController } from 'src/controller/dataMaster.controller';
import { DataMasterService } from 'src/services/dataMaster.services';
import { PrismaService } from 'src/services/prisma.services';

@Module({
    controllers: [DataMasterController],  // No controllers in this module
    providers: [        
      PrismaService,// Shared Prisma service
      DataMasterService
    ],
    exports: [
        DataMasterService,  // Export services to make them available for other modules
    ]
  })
  
  export class DataMasterModule {};
  