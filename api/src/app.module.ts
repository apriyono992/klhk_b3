import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesModule } from './module/roles.module';
import { CasbinModule } from './module/casbin.module';
import { ContentModule } from './module/content.module';
import { JwtProvider } from './provider/auth.provider';
import { EnforcerProvider } from './provider/casbin.provider';
import { PrismaService } from './services/prisma.services';
import { PermissionUtil } from './utils/permission';
import { Enforcer } from 'casbin';
import { CategoriesValidationPipe } from './validators/category.pipe';

@Module({
  imports: [RolesModule, CasbinModule, ContentModule],
  controllers: [AppController],
  providers: [AppService, JwtProvider, EnforcerProvider, PermissionUtil, Enforcer, PrismaService, CategoriesValidationPipe],
  exports: [JwtProvider, EnforcerProvider, PermissionUtil, Enforcer, PrismaService, CategoriesValidationPipe],
})
export class AppModule {}
