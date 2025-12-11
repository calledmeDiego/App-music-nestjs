import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';

import { jwtRepositoryName, type JwtToken } from 'src/auth/domain/repository/jwt-token-repository';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(jwtRepositoryName) private readonly jwt: JwtToken
  ) { }
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers['authorization'];
    if (!authHeader) throw new UnauthorizedException('Not token provided');

    const [, token] = authHeader.split(' ');

    const payload = this.jwt.verify(token);
    if(!payload) throw new UnauthorizedException('Invalid or expired token');

    request.user = payload;
    return true; 
  }
}
