import { Inject, Injectable } from '@nestjs/common';
import { RegisterUserDTO } from '../dto/register-user.dto';
import { LoginUserDTO } from '../dto/login-user.dto';

import { authRepositoryName, type AuthRepository } from 'src/auth/domain/repository/auth.repository';
import { jwtRepositoryName, type JwtToken } from 'src/auth/domain/repository/jwt-token-repository';
import { passwordEncrypterRepositoryName, type PasswordEncrypter } from 'src/auth/domain/repository/password-encrypter.repository';
import { eventBusDefinition, type EventBus } from 'src/shared/domain/events/event-bus';

import { Email } from 'src/auth/domain/value-objects/email.vo';
import { Role } from 'src/auth/domain/value-objects/role.vo';
import { UserEntity } from 'src/auth/domain/entities/user.entity';
import { UserRepresentation } from '../representation/user.representation';

import { EmailAlreadyRegisteredException, UserNotFoundError, InvalidPasswordError } from 'src/auth/domain/exception';

@Injectable()
export class AuthService {
  constructor(
    @Inject(authRepositoryName) private readonly authRepository: AuthRepository,
    @Inject(passwordEncrypterRepositoryName) private readonly passwordEncrypter: PasswordEncrypter,
    @Inject(jwtRepositoryName) private readonly jwtService: JwtToken,
    @Inject(eventBusDefinition.name) private readonly eventBus: EventBus
  ) { }

  async registerUser(data: RegisterUserDTO) {
    const emailVO = Email.fromString(data.email);
    const userExists = await this.authRepository.findByEmail(emailVO);

    if (userExists) throw new EmailAlreadyRegisteredException();

    const hashedPassword = await this.passwordEncrypter.encrypt(data.password);

    const newUser = UserEntity.create({
      name: data.name,
      email: emailVO,
      password: hashedPassword,
      role: Role.fromString('user')
    });

    const savedUser = await this.authRepository.register(newUser);
    this.eventBus.publish(newUser.pullEvents())

    return UserRepresentation.fromUser(savedUser).format();
  }

  async loginUser(data: LoginUserDTO) {
    const emailVO = Email.fromString(data.email);
    const userFound = await this.authRepository.findByEmail(emailVO);

    if (!userFound) throw new UserNotFoundError(data.email);

    const isValidPassword = await this.passwordEncrypter.compare(
      data.password, 
      userFound.password);

    if (!isValidPassword) throw new InvalidPasswordError();

    const token = this.jwtService.sign({ 
      id: userFound.id, 
      role: userFound.role.value 
    });

    userFound.login();
    this.eventBus.publish(userFound.pullEvents())
    
    const dataUser = {
      token: token,
      user: UserRepresentation.fromUser(userFound).format()
    };
    
    return dataUser;
  }
}
