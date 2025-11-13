import { Inject, Injectable } from "@nestjs/common";
import { authRepositoryName, type AuthRepository } from "../repository/auth.repository";
import { passwordEncrypterRepositoryName, type PasswordEncrypter } from "../repository/password-encrypter.repository";
import { Email } from "../value-objects/email.vo";
import { InvalidPasswordError, UserNotFoundError } from "../exception";

@Injectable()
export class UserLoginDomainService {
  constructor(
    @Inject(authRepositoryName) private readonly authRepository: AuthRepository, 
    @Inject(passwordEncrypterRepositoryName) private readonly passwordEncrypter: PasswordEncrypter,
  ) {}

  async validateLogin(email: string, password: string) {
    const emailVO = Email.create(email);
    const user = await this.authRepository.findByEmail(emailVO);
    if (!user) throw new UserNotFoundError(email);

    const isValid = await this.passwordEncrypter.compare(password, user.password);
    if (!isValid) throw new InvalidPasswordError();

    return user;
  }
}