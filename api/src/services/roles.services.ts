import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { Enforcer } from 'casbin';
import { Source } from '../models/enums/source';
import { Action } from '../models/enums/action';
import { PermissionUtil } from '../utils/permission';

@Injectable()
export class RolesService {
  constructor(
    private readonly enforcer: Enforcer,
    private readonly permission: PermissionUtil,
  ) {}

  // Validate role before adding it to a user
  async addRoleForUser(requestorId: string, userId: string, roleName: string) {
    await this.permission.enforceUserPermission(requestorId, Source.USER, Action.WRITE, '*');

    // Check if the role exists
    const allRoles = await this.getRoles();
    if (!allRoles.includes(roleName)) {
      throw new BadRequestException(`Role '${roleName}' does not exist.`);
    }

    return this.enforcer.addRoleForUser(userId, roleName);
  }

  async addOrUpdateRoleWithScope(requestorId: string, userId: string, role: string, scope: string = '*'): Promise<void> {
    await this.permission.enforceUserPermission(requestorId, Source.USER, Action.WRITE, '*');
    // Check if the g policy already exists for this user and role
    const existingGroupingPolicies = await this.enforcer.getGroupingPolicy();
    const existingPolicy = existingGroupingPolicies.find(
      (policy) => policy[0] === userId && policy[1] === role
    );

    if (existingPolicy) {
      // If the policy exists, update it
      await this.enforcer.removeGroupingPolicy(userId, role, existingPolicy[2]);
    }
    
    // Add the new or updated policy
    await this.enforcer.addGroupingPolicy(userId, role, scope);
    await this.enforcer.savePolicy();
  }

  // Get all roles for a specific user
  async getRolesForUser(requestorUserId: string, userId: string) {
    await this.permission.enforceUserPermission(requestorUserId,  Source.USER, Action.READ, userId);
    return this.enforcer.getRolesForUser(userId);
  }

  // Method to retrieve all available roles
  async getRoles(): Promise<string[]> {
    const roles = await this.enforcer.getAllRoles();
    return roles;
  }

  // Enforce permissions based on Casbin policies
  async enforce(requestorId: string, resource: Source, action: Action, scope: string = '*'): Promise<boolean> {
    const isAllowed = await this.enforcer.enforce(requestorId, resource, action, scope);

    if (!isAllowed) {
      throw new ForbiddenException(
        `You do not have permission to ${action} ${resource} with scope ${scope}`,
      );
    }
    return true;
  }

  // Add a policy for a role
  async addPolicy(requestorId: string, role: string, resource: Source, action: Action, targetUserId: string) {
    await this.permission.enforceUserPermission(requestorId, Source.USER, Action.WRITE, '*');
    return this.enforcer.addPolicy(role, resource, action, targetUserId);
  }

  // Get all policies in the system
  async getPolicies(requestorId: string) {
    await this.permission.enforceUserPermission(requestorId, Source.USER, Action.READ, '*');
    return this.enforcer.getPolicy();
  }
}
