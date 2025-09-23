import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { PrismaService } from './prisma.service';

import { UserModule } from './auth/infrastructure/module/user.module';
import { TrackModule } from './track/infrastructure/module/track.module';
import { StorageModule } from './storage/infrastructure/module/storage.module';
import { SlackLoggerService } from './shared/infrastructure/logging/slack-logger.service';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    UserModule,
    TrackModule,
    StorageModule
  ],
  controllers: [],
  providers: [PrismaService, SlackLoggerService],
  exports: [SlackLoggerService]
})
export class AppModule { }
