import { Inject, Injectable } from "@nestjs/common";
import { JwtToken } from "src/auth/domain/repository/jwt-token-repository";
import jwt from "jsonwebtoken";
import { EnvService } from "src/shared/infrastructure/config/env.service";

@Injectable()
export class JwtTokenService implements JwtToken {

    AUTH_JWT_SECRET: string
    constructor( private readonly envService: EnvService) {
        this.AUTH_JWT_SECRET = envService.jwtSecret;
    }

    sign(payload: object, expiresIn: string = '2h'): string {
        return jwt.sign(payload, this.AUTH_JWT_SECRET, { expiresIn })
    }

    verify<T>(token: string): T | null {
        try {
            return jwt.verify(token, this.AUTH_JWT_SECRET) as T;
        } catch (error) {
            return null;
        }
    }
    decode<T>(token: string): T | null {
        return jwt.decode(token) as T ?? null;
    }

}