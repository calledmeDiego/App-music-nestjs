import { Inject, Injectable } from "@nestjs/common";
import { JwtToken } from "src/auth/domain/repository/jwt-token-repository";
import jwt from "jsonwebtoken";

@Injectable()
export class JwtTokenService implements JwtToken {


    constructor(@Inject('JWT_SECRET') private readonly secret: string) { }


    sign(payload: object, expiresIn: string = '2h'): string {
        return jwt.sign(payload, this.secret, { expiresIn })
    }

    verify<T>(token: string): T | null {
        try {
            return jwt.verify(token, this.secret) as T;
        } catch (error) {
            return null;
        }
    }
    decode<T>(token: string): T | null {
        throw new Error("Method not implemented.");
    }

}