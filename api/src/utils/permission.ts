import { Injectable, ForbiddenException } from '@nestjs/common';
import { Enforcer } from 'casbin';
import { Source } from '../models/enums/source';
import { Action } from '../models/enums/action';

@Injectable()
export class PermissionUtil {
  constructor(private readonly enforcer: Enforcer) {}

  async enforceUserPermission(
    requestUserId: string,
    resource: Source,
    action: Action,
    scope: string,
  ) {
    let isAllowed: boolean;

    if (requestUserId === scope) {
      // Check with specific userId scope
      isAllowed = await this.enforcer.enforce(requestUserId, resource, action, scope);
    } else {
      // Check with wildcard scope
      isAllowed = await this.enforcer.enforce(requestUserId, resource, action, '*');
    }

    if (!isAllowed) {
      throw new ForbiddenException(
        `You do not have permission to ${action} ${resource} with the given scope`,
      );
    }
  }
}