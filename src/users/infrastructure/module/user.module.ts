import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserService } from '../../application/use-case/user.service';
import { UserController } from '../controller/user.controller';
import { PrismaUserRepository } from '../repository/prisma-user.repository';
import { PrismaService } from 'src/prisma.service';
import { HeaderMiddleware } from '../middleware/header.middleware';


@Module({
  controllers: [UserController],
  providers: [PrismaService,UserService, {
    provide: 'UserRepository',
    useClass: PrismaUserRepository,
  }]
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HeaderMiddleware).forRoutes({
      path:'/users/register',
      method: RequestMethod.GET
    })
  }
}
