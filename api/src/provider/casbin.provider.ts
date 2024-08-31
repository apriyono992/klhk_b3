import { Provider } from '@nestjs/common';
import { newEnforcer } from 'casbin';
import { PrismaAdapter } from 'casbin-prisma-adapter';

export const EnforcerProvider: Provider = {
  provide: 'ENFORCER',
  useFactory: async () => {
    const adapter = await PrismaAdapter.newAdapter({
      dsn: process.env.DATABASE_URL, // Your database URL
    });

    const enforcer = await newEnforcer('rbac.conf', adapter);
    await enforcer.loadPolicy(); // Load the policy from the database

    return enforcer;
  },
};
