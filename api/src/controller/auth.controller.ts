import {
  Body,
  Controller,
  HttpCode,
  Post,
  UploadedFiles,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ForgotPasswordRequestDTO } from 'src/models/auth/forgotPasswordRequest.dto';
import { LoginRequestDTO } from 'src/models/auth/loginRequest.dto';
import { LoginResponseDTO } from 'src/models/auth/loginResponse.dto';
import { RefreshTokenDTO } from 'src/models/auth/refreshToken.dto';
import { RegisterUserDTO } from 'src/models/auth/registerUser.dto';
import { ResetPasswordRequestDTO } from 'src/models/auth/resetPasswordRequest.dto';
import { GenericResponseDTO } from 'src/models/genericResponse.dto';
import { AuthService } from 'src/services/auth.services';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: RegisterUserDTO })
  async registerUser(
    @Body(new ValidationPipe()) payload: RegisterUserDTO,
    @UploadedFiles() attachments: Express.Multer.File,
  ) {
    return this.authService.registerUser(payload, attachments);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login to generate signed token' })
  @ApiBody({ type: LoginRequestDTO })
  @ApiResponse({
    status: 200,
    type: LoginResponseDTO,
    description: 'Login successful',
  })
  @HttpCode(200)
  async loginUser(@Body(new ValidationPipe()) payload: LoginRequestDTO) {
    return this.authService.loginUser(payload);
  }

  @Post('refreshToken')
  @ApiOperation({ summary: 'Refresh token to relogin' })
  @ApiBody({ type: RefreshTokenDTO })
  @ApiResponse({
    status: 200,
    type: LoginResponseDTO,
    description: 'Refresh token successful',
  })
  async refreshToken(@Body(new ValidationPipe()) payload: RefreshTokenDTO) {
    return this.authService.refreshTokens(payload.userId, payload.refreshToken);
  }

  @Post('forgotPassword')
  @ApiOperation({
    summary: 'Forgot password by sending email with link to reset password',
  })
  @ApiBody({ type: ForgotPasswordRequestDTO })
  @ApiResponse({
    status: 200,
    type: GenericResponseDTO,
    description: 'Forgot password successful',
  })
  async forgotUserPassword(
    @Body(new ValidationPipe()) payload: ForgotPasswordRequestDTO,
  ) {
    try {
      await this.authService.forgotPassword(payload.email);
      return {
        success: true,
        message: 'Password reset link sent to email',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Post('resetPassword')
  @ApiOperation({ summary: 'Reset password with a new one' })
  @ApiBody({ type: ResetPasswordRequestDTO })
  @ApiResponse({
    status: 200,
    type: GenericResponseDTO,
    description: 'Reset password successful',
  })
  async resetUserPassword(
    @Body(new ValidationPipe()) payload: ResetPasswordRequestDTO,
  ) {
    try {
      await this.authService.resetPassword(payload);
      return {
        success: true,
        message: 'Password reset successful',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
