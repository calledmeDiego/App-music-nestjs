import { Inject, Injectable } from '@nestjs/common';
import { UserEntity } from 'src/auth/domain/entity/user.entity';
import type { AuthRepository } from 'src/auth/domain/repository/auth.repository';
import { Email } from 'src/auth/domain/values-object/email.vo';
import { RegisterUserDTO } from '../dto/register-user.dto';
import { LoginUserDTO } from '../dto/login-user.dto';
import { UserNotFoundError } from 'src/auth/domain/exception/user-not-found.exception';
import { EmailAlreadyRegisteredException } from 'src/auth/domain/exception/email-registered.exception';
import type { PasswordEncrypter } from 'src/auth/domain/repository/password-encrypter.repository';
import type { JwtToken } from 'src/auth/domain/repository/jwt-token-repository';
import { InvalidTokenError } from 'src/auth/domain/exception/invalid-token.exception';
import { UserRepresentation } from '../representation/user.representation';


@Injectable()
export class AuthService {
  constructor(
    @Inject('AuthRepository') private readonly authRepository: AuthRepository,
    @Inject('PasswordEncrypter') private readonly passwordEncrypter: PasswordEncrypter,
    @Inject('JwtToken') private readonly jwtService: JwtToken,
  ) { }

  async registerUser(data: RegisterUserDTO) {
    const user = await this.findByEmailUser(data.email);

    if (user) throw new EmailAlreadyRegisteredException();

    const hashed = await this.passwordEncrypter.encrypt(data.password);

    const userForm = UserEntity.CreateRegisterForm({
      email: Email.create(data.email),
      name: data.name,
      password: hashed,
      role: 'user'
    });

    const newUser = await this.authRepository.register(userForm);

    return UserRepresentation.fromUser(newUser).format();
  }

  async loginUser(data: LoginUserDTO) {
    const userFounded = await this.findByEmailUser(data.email);

    if (!userFounded) throw new UserNotFoundError(data.email);


    const isValid = await this.passwordEncrypter.compare(data.password, userFounded!.password);

    if (!isValid) throw new InvalidTokenError();

    const token = this.jwtService.sign({
      id: userFounded!.id,
      role: userFounded!.role
    });

    const dataUser = {
      token: token,
      user: UserRepresentation.fromUser(userFounded).format()
    };

    return dataUser;
  }

  async findByEmailUser(email: string) {
    const emailVO = Email.create(email);
    const user = await this.authRepository.findByEmail(emailVO);

    return user;

  }
}
