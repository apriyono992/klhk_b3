import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtProvider {
  constructor(private readonly jwtService: JwtService) {}
  private readonly secret = process.env.JWT_SECRET;

  validateToken(token: string) {
    try {
      // Tambahkan `secret` secara eksplisit
      return this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  getPayload(token: string) {
    return this.jwtService.decode(token); // Decode the token to extract the payload
  }
}
