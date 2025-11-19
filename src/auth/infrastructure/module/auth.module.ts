import { Module } from '@nestjs/common';
import { AuthService } from '../../application/use-case/auth.service';
import { AuthController } from '../controller/auth.controller';
import { AuthMongoRepository } from '../repository/auth-mongo.repository';

import { BcryptPasswordEncrypter } from '../security/password-encrypter.service';
import { JwtTokenService } from '../security/jwt-token.service';
import { AuthSqlServerRepository } from '../repository/auth-sqlserver.repository';

import { EnvService } from 'src/shared/infrastructure/config/env.service';

import { authRepositoryName } from 'src/auth/domain/repository/auth.repository';
import { passwordEncrypterRepositoryName } from 'src/auth/domain/repository/password-encrypter.repository';
import { jwtRepositoryName } from 'src/auth/domain/repository/jwt-token-repository';
import { UserRegistrationDomainService } from 'src/auth/domain/services/user-registration.domain-service';
import { UserLoginDomainService } from 'src/auth/domain/services/user-login.domain-service';
import { UserEventsHandler } from '../subscriber/user-events.handler';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService,UserEventsHandler,
    {
      provide: authRepositoryName,
      useFactory: (dbInstance: any, envService: EnvService) => {
        const dbProvider = envService.dbProvider.trim();
        return dbProvider === 'mongo' ? new AuthMongoRepository(dbInstance) : new AuthSqlServerRepository(dbInstance);
      },
      inject: ['DATABASE_INSTANCE', EnvService]

    },
    {
      provide: 'JWT_SECRET',
      useFactory: (env: EnvService) => env.jwtSecret,
      inject: [EnvService]
    },
    { provide: passwordEncrypterRepositoryName, useClass: BcryptPasswordEncrypter },
    { provide: jwtRepositoryName, useClass: JwtTokenService }],

  exports: [jwtRepositoryName]
})
export class AuthModule {

}

