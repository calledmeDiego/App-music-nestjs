import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserService } from '../../application/use-case/user.service';
import { UserController } from '../controller/user.controller';
import { UserPrismaRepository } from '../repository/user-prisma.repository';
import { PrismaService } from 'src/prisma.service';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { BcryptPasswordEncrypter } from '../security/password-encrypter.service';
import { JwtTokenService } from '../security/jwt-token.service';


@Module({
  controllers: [UserController],
  providers: [PrismaService, UserService,
    {
      provide: 'JWT_SECRET',
      useValue: <string>process.env.JWT_SECRET || 'changeme'
    },
    {
      provide: 'UserRepository',
      useClass: UserPrismaRepository,
    },
    { provide: 'PasswordEncrypter', useClass: BcryptPasswordEncrypter },
    { provide: 'JwtToken', useClass: JwtTokenService }],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '/users/',
      method: RequestMethod.GET
    })
  }
}
