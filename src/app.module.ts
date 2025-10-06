import { Module, Provider } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { PrismaService } from './shared/infrastructure/prisma/services/prisma.service';

import { AuthModule } from './auth/infrastructure/module/auth.module';
import { TrackModule } from './track/infrastructure/module/track.module';
import { StorageModule } from './storage/infrastructure/module/storage.module';
import { SlackLoggerService } from './shared/infrastructure/logging/slack-logger.service';
import { SqlServerPrismaService } from './shared/infrastructure/prisma/services/sqlserver-prisma.service';
import { MongoPrismaService } from './shared/infrastructure/prisma/services/mongo-prisma.service';

// const prismaProvider: Provider = {
//   provide:PrismaService,
//   useFactory: () => {
//     if (process.env.DB_PROVIDER === 'mongo') {
//       return new MongoPrismaService();
//     } 
//     return new SqlServerPrismaService();

//   }
// }

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    AuthModule,
    TrackModule,
    StorageModule
  ],
  controllers: [],
  providers: [PrismaService, SlackLoggerService],
  exports: [SlackLoggerService, PrismaService]
})
export class AppModule { }
