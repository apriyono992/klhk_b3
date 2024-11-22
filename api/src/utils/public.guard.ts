import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PublicApiGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Periksa apakah endpoint ditandai sebagai public
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (!isPublic) {
      return false; // Endpoint ini bukan public, serahkan ke guard lainnya
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization header missing or invalid');
    }

    // Ambil token dari header
    const token = authHeader.replace('Bearer ', '');

    // Token statis yang diizinkan
    const STATIC_TOKEN = process.env.PUBLIC_API_TOKEN || 'static-public-token';

    if (token !== STATIC_TOKEN) {
      throw new UnauthorizedException('Invalid static token for public API');
    }

    return true; // Token valid, izinkan akses
  }
}
