import { Module } from '@nestjs/common';
import { ContentService } from '../services/content.services';
import { PrismaService } from '../services/prisma.services';
import { ContentController } from '../controller/content.controller';
import { JwtProvider } from '../provider/auth.provider';
import { EnforcerProvider } from '../provider/casbin.provider';
import { PermissionUtil } from '../utils/permission';
import { Enforcer } from 'casbin';
import { CategoriesValidationPipe } from '../validators/category.pipe';
import { ContentReportController } from 'src/controller/content-report.controller';
import { ContentReportService } from 'src/services/content-report.services';

@Module({
  controllers: [ContentController, ContentReportController],
  providers: [ ContentService,ContentReportService, PrismaService, JwtProvider, EnforcerProvider, PermissionUtil, Enforcer, CategoriesValidationPipe  ],
  exports: [JwtProvider, EnforcerProvider, PermissionUtil, Enforcer, CategoriesValidationPipe],
})
export class ContentModule {}
