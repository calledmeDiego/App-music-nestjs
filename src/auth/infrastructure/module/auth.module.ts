import { MiddlewareConsumer, Module, NestModule, Provider, RequestMethod } from '@nestjs/common';
import { AuthService } from '../../application/use-case/auth.service';
import { AuthController } from '../controller/auth.controller';
import { AuthMongoRepository } from '../repository/auth-mongo.repository';
import { PrismaService } from 'src/shared/infrastructure/prisma/services/prisma.service';

import { BcryptPasswordEncrypter } from '../security/password-encrypter.service';
import { JwtTokenService } from '../security/jwt-token.service';
import { AuthSqlServerRepository } from '../repository/auth-sqlserver.repository';

const authRepoProvider: Provider = {
  provide: 'AuthRepository',
  useClass:
    <string>process.env.DB_PROVIDER! === 'mongo' ? AuthMongoRepository : AuthSqlServerRepository
}

@Module({
  controllers: [AuthController],
  providers: [PrismaService, AuthService, authRepoProvider,
    {
      provide: 'JWT_SECRET',
      useValue: <string>process.env.JWT_SECRET || 'changeme'
    },
    { provide: 'PasswordEncrypter', useClass: BcryptPasswordEncrypter },
    { provide: 'JwtToken', useClass: JwtTokenService }],

  exports: ['JwtToken']
})
export class AuthModule {

}

