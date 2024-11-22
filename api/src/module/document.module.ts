import { Module } from "@nestjs/common";
import { Enforcer } from "casbin";
import { DocumentController } from "src/controller/document.controller";
import { JwtProvider } from "src/provider/auth.provider";
import { EnforcerProvider } from "src/provider/casbin.provider";
import { DocumentService } from "src/services/document.services";
import { PrismaService } from "src/services/prisma.services";
import { PermissionUtil } from "src/utils/permission";
import { PrismaModule } from "./prisma.module";
import { AuthModule } from "./auth.module";


@Module({
      imports: [PrismaModule, AuthModule],
    controllers: [DocumentController],
    providers: [ DocumentService, PrismaService, EnforcerProvider, PermissionUtil, Enforcer],
  })
export class DocumentModule {}