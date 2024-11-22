import { Module } from "@nestjs/common";
import { Enforcer } from "casbin";
import { CompanyController } from "src/controller/company.controller";
import { JwtProvider } from "src/provider/auth.provider";
import { EnforcerProvider } from "src/provider/casbin.provider";
import { CompanyService } from "src/services/company.services";
import { PrismaService } from "src/services/prisma.services";
import { PermissionUtil } from "src/utils/permission";

import { PrismaModule } from "./prisma.module";
import { AuthModule } from "./auth.module";

@Module({
    imports: [PrismaModule, AuthModule],
    controllers: [CompanyController],
    providers: [ CompanyService, PrismaService, EnforcerProvider, PermissionUtil, Enforcer],
  })
export class CompanyModule {}
  