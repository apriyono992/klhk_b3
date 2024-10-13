import { Module } from "@nestjs/common";
import { Enforcer } from "casbin";
import { CompanyController } from "src/controller/company.controller";
import { VehicleController } from "src/controller/vehicle.controller";
import { JwtProvider } from "src/provider/auth.provider";
import { EnforcerProvider } from "src/provider/casbin.provider";
import { CompanyService } from "src/services/company.services";
import { PrismaService } from "src/services/prisma.services";
import { VehicleService } from "src/services/vehicle.services";
import { PermissionUtil } from "src/utils/permission";

@Module({
  controllers: [VehicleController],  // No controllers in this module
  providers: [        
    PrismaService,// Shared Prisma service
    VehicleService, 
  ],
  exports: [
    VehicleService,  // Export services to make them available for other modules
  ]
})
export class VehicleModule {}
  