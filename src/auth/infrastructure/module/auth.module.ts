import { MiddlewareConsumer, Module, NestModule, Provider, RequestMethod } from '@nestjs/common';
import { UserService } from '../../application/use-case/user.service';
import { UserController } from '../controller/user.controller';
import { AuthMongoRepository } from '../repository/auth-mongo.repository';
import { PrismaService } from 'src/shared/infrastructure/prisma/services/prisma.service';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { BcryptPasswordEncrypter } from '../security/password-encrypter.service';
import { JwtTokenService } from '../security/jwt-token.service';
import { AuthSqlServerRepository } from '../repository/auth-sqlserver.repository';

const authRepoProvider: Provider = {
  provide: 'AuthRepository',
  useClass:
    <string>process.env.DB_PROVIDER! === 'mongo' ? AuthMongoRepository : AuthSqlServerRepository
}

@Module({
  controllers: [UserController],
  providers: [PrismaService, UserService, authRepoProvider,
    {
      provide: 'JWT_SECRET',
      useValue: <string>process.env.JWT_SECRET || 'changeme'
    },
    { provide: 'PasswordEncrypter', useClass: BcryptPasswordEncrypter },
    { provide: 'JwtToken', useClass: JwtTokenService }],

  exports: ['JwtToken']
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '/users/',
      method: RequestMethod.GET
    })
  }
}
