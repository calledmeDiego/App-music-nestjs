import { MiddlewareConsumer, Module, NestModule, Provider, RequestMethod } from '@nestjs/common';
import { AuthService } from '../../application/use-case/auth.service';
import { AuthController } from '../controller/auth.controller';
import { AuthMongoRepository } from '../repository/auth-mongo.repository';
import { PrismaService } from 'src/shared/infrastructure/prisma/services/prisma.service';

import { BcryptPasswordEncrypter } from '../security/password-encrypter.service';
import { JwtTokenService } from '../security/jwt-token.service';
import { AuthSqlServerRepository } from '../repository/auth-sqlserver.repository';

import { EnvService } from 'src/shared/infrastructure/config/env.service';
import { EnvModule } from 'src/shared/infrastructure/config/env.module';

import { DatabaseModule } from 'src/shared/infrastructure/prisma/module/database.module';

export const createAuthRepoProvider = (env: EnvService): Provider => ({
  provide: 'AuthRepository',
  useClass: env.dbProvider === 'mongo'
    ? AuthMongoRepository
    : AuthSqlServerRepository,
});

@Module({
  imports: [DatabaseModule, EnvModule],
  controllers: [AuthController],
  providers: [PrismaService, AuthService,
    {
      provide: 'AuthRepository',
      useFactory: (dbInstance: any, envService: EnvService) => {
        const dbProvider = envService.dbProvider.trim();
        return dbProvider === 'mongo' ? new AuthMongoRepository(dbInstance) : new AuthSqlServerRepository(dbInstance);
      },
      inject: ['DATABASE_INSTANCE', EnvService]

    },
    {
      provide: 'JWT_SECRET',
      inject: [EnvService],
      useFactory: (env: EnvService) => env.jwtSecret,
    },
    { provide: 'PasswordEncrypter', useClass: BcryptPasswordEncrypter },
    { provide: 'JwtToken', useClass: JwtTokenService }],

  exports: ['JwtToken']
})
export class AuthModule {

}

