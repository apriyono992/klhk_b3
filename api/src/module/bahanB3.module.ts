import { Module } from "@nestjs/common";
import { Enforcer } from "casbin";
import { BahanB3Controller } from "src/controller/bahanB3.controller";
import { CompanyController } from "src/controller/company.controller";
import { VehicleController } from "src/controller/vehicle.controller";
import { JwtProvider } from "src/provider/auth.provider";
import { EnforcerProvider } from "src/provider/casbin.provider";
import { BahanB3Service } from "src/services/bahanB3.services";
import { CompanyService } from "src/services/company.services";
import { PrismaService } from "src/services/prisma.services";
import { VehicleService } from "src/services/vehicle.services";
import { PermissionUtil } from "src/utils/permission";

@Module({
  controllers: [BahanB3Controller],  // No controllers in this module
  providers: [        
    PrismaService,// Shared Prisma service
    BahanB3Service, 
  ],
  exports: [
    BahanB3Service,  // Export services to make them available for other modules
  ]
})
export class BahanB3Module {}
  