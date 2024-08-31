import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtProvider {
  private readonly secret = process.env.JWT_SECRET;

  decodeToken(token: string): any {
    try {
      return jwt.decode(token);
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  validateToken(token: string): boolean {
    try {
      jwt.verify(token, this.secret);
      return true;
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      } else {
        throw new UnauthorizedException('Invalid token');
      }
    }
  }

  getUserIdFromToken(token: string): string {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.userId) {
      throw new UnauthorizedException('Invalid token: userId not found');
    }
    return decoded.userId;
  }
}
