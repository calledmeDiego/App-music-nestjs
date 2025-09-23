import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';

import type { JwtToken } from 'src/auth/domain/repository/jwt-token-repository';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('JwtToken') private readonly jwt: JwtToken, // 👈 inyección aquí
  ) { }
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers['authorization'];
    if (!authHeader) throw new UnauthorizedException('Not token provided');

    const [, token] = authHeader.split(' ');

    try {
      const payload = this.jwt.verify(token);
      request.user = payload; 
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
