import { Module } from '@nestjs/common';
import { AuthService } from '../../application/use-case/auth.service';
import { AuthController } from '../controller/auth.controller';

import { EnvService } from 'src/shared/infrastructure/config/env.service';

import { AuthMongoRepository } from '../repository/auth-mongo.repository';
// import { AuthSqlServerRepository } from '../repository/auth-sqlserver.repository';
import { BcryptPasswordEncrypter } from '../security/password-encrypter.service';
import { JwtTokenService } from '../security/jwt-token.service';

import { UserEventHandler } from '../subscriber/user-events.handler';

import { authRepositoryName } from 'src/auth/domain/repository/auth.repository';
import { passwordEncrypterRepositoryName } from 'src/auth/domain/repository/password-encrypter.repository';
import { jwtRepositoryName } from 'src/auth/domain/repository/jwt-token-repository';
import { DATABASE_INSTANCE } from 'src/shared/domain/constants/db-instance';


@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService,UserEventHandler, 
    {
      provide: authRepositoryName,
      useFactory: (dbInstance: any, envService: EnvService) => {
        const dbProvider = envService.dbProvider.trim();
        return dbProvider === 'mongo' ? new AuthMongoRepository(dbInstance) : '';
      },
      inject: [DATABASE_INSTANCE, EnvService]

    },
    { provide: passwordEncrypterRepositoryName, useClass: BcryptPasswordEncrypter },
    { provide: jwtRepositoryName, useClass: JwtTokenService }],

  exports: [jwtRepositoryName, authRepositoryName]
})
export class AuthModule {

}

