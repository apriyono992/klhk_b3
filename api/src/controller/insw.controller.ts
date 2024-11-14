import { ApiTags } from '@nestjs/swagger';
import {Body, Controller, Get, Param, Post, Query, Res} from '@nestjs/common';
import { InswServices } from '../services/insw.services';
import {LoginRequestDTO} from "../models/auth/loginRequest.dto";
import {RequestInswDto} from "../models/requestInswDto";
import { Response } from 'express';

@ApiTags('INSW')
@Controller('insw')
export class InswController {
  constructor(private readonly inswService: InswServices) {}

  @Post('auth')
  async authorizationInsw() {
    return await this.inswService.authorizationInsw();
  }
  @Get('generate-token/:code')
  async generateToken(@Param('code') code: string) {
    await this.inswService.generateToken(code);
  }
  @Post('send')
  async send(@Body() payload: RequestInswDto) {
    return await this.inswService.sendInsw(payload);
  }

  @Post('export-json')
  async exportData(@Body() payload: RequestInswDto, @Res() res: Response) {
    return await this.inswService.exportJson(payload, res)
  }
}
