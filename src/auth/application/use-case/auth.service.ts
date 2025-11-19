import { Inject, Injectable } from '@nestjs/common';
import { UserEntity } from 'src/auth/domain/entities/user.entity';
import { authRepositoryName, type AuthRepository } from 'src/auth/domain/repository/auth.repository';
import { Email } from 'src/auth/domain/value-objects/email.vo';
import { RegisterUserDTO } from '../dto/register-user.dto';
import { LoginUserDTO } from '../dto/login-user.dto';

import { EmailAlreadyRegisteredException, UserNotFoundError, InvalidPasswordError } from 'src/auth/domain/exception';
import { passwordEncrypterRepositoryName, type PasswordEncrypter } from 'src/auth/domain/repository/password-encrypter.repository';
import { jwtRepositoryName, type JwtToken } from 'src/auth/domain/repository/jwt-token-repository';

import { UserRepresentation } from '../representation/user.representation';
import { UserRegistrationDomainService } from 'src/auth/domain/services/user-registration.domain-service';
import { UserLoginDomainService } from 'src/auth/domain/services/user-login.domain-service';
import { eventBusDefinition, type EventBus } from 'src/shared/domain/events/event-bus';
import { Role } from 'src/auth/domain/value-objects/role.vo';
import { UserLoguedEvent } from 'src/auth/domain/events/user-logued.event';

@Injectable()
export class AuthService {
  constructor(@Inject(authRepositoryName) private readonly authRepository: AuthRepository,
    @Inject(passwordEncrypterRepositoryName) private readonly passwordEncrypter: PasswordEncrypter,
    @Inject(jwtRepositoryName) private readonly jwtService: JwtToken,
    @Inject(eventBusDefinition.name) private readonly eventBus: EventBus
  ) { }

  async registerUser(data: RegisterUserDTO) {

    const emailVO = Email.fromString(data.email);
    const userExists = await this.authRepository.findByEmail(emailVO);

    if (userExists) throw new EmailAlreadyRegisteredException();

    const hashed = await this.passwordEncrypter.encrypt(data.password);

    const newUser = UserEntity.create({
      name: data.name,
      email: emailVO,
      password: hashed,
      role: Role.fromString('user')
    });

    const savedUser = await this.authRepository.register(newUser);
    this.eventBus.publish(newUser.pullEvents())
    return UserRepresentation.fromUser(savedUser).format();
  }

  async loginUser(data: LoginUserDTO) {

    const emailVO = Email.fromString(data.email);

    const userFounded = await this.authRepository.findByEmail(emailVO);

    if (!userFounded) throw new UserNotFoundError(data.email);

    const isValid = await this.passwordEncrypter.compare(data.password, userFounded.password);
    if (!isValid) throw new InvalidPasswordError();
    const token = this.jwtService.sign({ id: userFounded.id, role: userFounded.role.value });

    const dataUser = {
      token: token,
      user: UserRepresentation.fromUser(userFounded).format()
    };

    userFounded.record(new UserLoguedEvent(userFounded))
    this.eventBus.publish(userFounded.pullEvents())

    return dataUser;
  }
}
