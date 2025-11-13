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

@Injectable()
export class AuthService {
  constructor(
    private readonly registrationService: UserRegistrationDomainService,
    private readonly loginService: UserLoginDomainService,
    @Inject(jwtRepositoryName) private readonly jwtService: JwtToken,
  ) { }

  async registerUser(data: RegisterUserDTO) {
    const newUser = await this.registrationService.register(
      data.name,
      data.email,
      data.password 
    );
    const events = this.registrationService.pullDomainEvents()
    
    return UserRepresentation.fromUser(newUser).format();
  }

  async loginUser(data: LoginUserDTO) { 

    const user = await this.loginService.validateLogin(data.email, data.password);
    const token = this.jwtService.sign({ id: user.id, role: user.role });

    return {
      token,
      user: UserRepresentation.fromUser(user).format(),
    };
  }
}
