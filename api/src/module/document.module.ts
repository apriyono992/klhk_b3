import { Module } from "@nestjs/common";
import { Enforcer } from "casbin";
import { DocumentController } from "src/controller/document.controller";
import { JwtProvider } from "src/provider/auth.provider";
import { EnforcerProvider } from "src/provider/casbin.provider";
import { DocumentService } from "src/services/document.services";
import { PrismaService } from "src/services/prisma.services";
import { PermissionUtil } from "src/utils/permission";

@Module({
    controllers: [DocumentController],
    providers: [ DocumentService, PrismaService, JwtProvider, EnforcerProvider, PermissionUtil, Enforcer],
  })
export class DocumentModule {}