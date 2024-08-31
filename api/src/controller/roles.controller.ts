import { Controller, Post, Body, Get, Headers, Query, UseGuards } from '@nestjs/common';
import { RolesService } from '../services/roles.services';
import { Source } from '../models/enums/source';
import { Action } from '../models/enums/action';
import { JwtProvider } from '../provider/auth.provider';
import { JwtAuthGuard } from '../utils/authGuard';

@UseGuards(JwtAuthGuard)
@Controller('roles')
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
    private readonly jwtProvider: JwtProvider,
    ) {}

  @Post('assign')
  async assignRoleToUser(
    @Body('userId') userId: string,
    @Body('roleName') roleName: string,
    @Headers('authorization') authHeader: string,
  ) {
    const requestUserId = (authHeader as any).userId;
    return this.rolesService.addRoleForUser(requestUserId, userId, roleName);
  }

  @Get('policies')
  async getPolicies(@Headers('authorization') authHeader: string,) {
    const requestUserId = (authHeader as any).userId;
    return this.rolesService.getPolicies(requestUserId);
  }
  @Get('userRoles')
  async getUserRoles(@Headers('authorization') authHeader: string,@Query('userId') userId: string) {
    const requestUserId = (authHeader as any).userId;
    return this.rolesService.getRolesForUser(requestUserId, userId);
  }

  @Post('assign-role')
  async assignRole(
    @Headers('authorization') authHeader: string,
    @Body('userId') userId: string,
    @Body('role') role: string,
    @Body('scope') scope?: string,
  ) {
    const requestUserId = (authHeader as any).userId;
    // This checks if the requester has permission to assign roles
    await this.rolesService.addOrUpdateRoleWithScope(requestUserId, userId, role, scope || '*');
  }

  @Post('policy')
  async addPolicy(
    @Body('role') role: string,
    @Body('resource') resource: Source,
    @Body('action') action: Action,
    @Body('targetUserId') targetUserId: string,
    @Headers('authorization') authHeader: string,
  ) {
    const requestUserId = (authHeader as any).userId;

    return this.rolesService.addPolicy(requestUserId, role, resource, action, targetUserId);
  }
}