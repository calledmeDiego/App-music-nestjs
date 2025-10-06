import { Injectable, NestMiddleware } from '@nestjs/common';
import { error } from 'console';
import { NextFunction, Request, Response } from 'express';
import { JwtTokenService } from '../security/jwt-token.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {

   use(req: Request, res: Response, next: NextFunction) {
    next();

  }
}
