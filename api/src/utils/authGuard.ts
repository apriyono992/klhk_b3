import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtProvider } from '../provider/auth.provider';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtProvider: JwtProvider) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const token = authHeader.replace('Bearer ', '');
    try {
      this.jwtProvider.validateToken(token);
      const userId = this.jwtProvider.getUserIdFromToken(token);
      request.userId = userId; // Attach userId to request object for further use
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
