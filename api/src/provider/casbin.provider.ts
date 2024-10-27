import { Provider } from '@nestjs/common';
import { newEnforcer } from 'casbin';
import { PrismaAdapter } from 'casbin-prisma-adapter';
import * as path from 'path';

export const EnforcerProvider: Provider = {
  provide: 'ENFORCER',
  useFactory: async () => {
    const adapter = await PrismaAdapter.newAdapter({
      datasourceUrl: process.env.DATABASE_URL, // Your database URL
    });
    const configPath = path.resolve(__dirname, '..', '..', 'provider/rbac.conf'); // Adjusting the path for dist structure


    const enforcer = await newEnforcer(configPath, adapter);
    await enforcer.loadPolicy(); // Load the policy from the database

    return enforcer;
  },
};
