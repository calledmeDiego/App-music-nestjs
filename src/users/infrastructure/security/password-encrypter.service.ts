import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { PasswordEncrypter } from "src/users/domain/repository/password-encrypter.repository";

@Injectable()
export class BcryptPasswordEncrypter implements PasswordEncrypter{

    private readonly rounds = 10;

    async encrypt(plainText: string): Promise<string> {
        return await bcrypt.hash(plainText,this.rounds);
    }
    async compare(plainText: string, hashed: string): Promise<boolean> {
        return await bcrypt.compare(plainText,hashed);
    }

}