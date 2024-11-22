import { Module } from "@nestjs/common";
import { DataBahanB3CompanyController } from "src/controller/dataBahanB3Company.controller";
import { DataBahanB3CompanyService } from "src/services/bahanB3Company.services";
import { PrismaService } from "src/services/prisma.services";
import { AuthModule } from "./auth.module";
import { PrismaModule } from "./prisma.module";



@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [DataBahanB3CompanyController],  // No controllers in this module
  providers: [        
    PrismaService,// Shared Prisma service
    DataBahanB3CompanyService, 
  ],
  exports: [
    DataBahanB3CompanyService,  // Export services to make them available for other modules
  ]
})
export class BahanB3CompanyModule {}
  