import { Module } from '@nestjs/common';
import { RolesService } from '../services/roles.services';
import { RolesController } from '../controller/roles.controller';
import { EnforcerProvider } from '../provider/casbin.provider';

@Module({
  controllers: [RolesController],
  providers: [RolesService, EnforcerProvider],
})
export class RolesModule {}
