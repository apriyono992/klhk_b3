import { Module } from '@nestjs/common';
import { EnforcerProvider } from '../provider/casbin.provider';

@Module({
  providers: [EnforcerProvider],
  exports: [EnforcerProvider],
})
export class CasbinModule {}