import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { PrismaService } from './prisma.service';

import { UserModule } from './users/infrastructure/module/user.module';
import { TrackModule } from './track/infrastructure/module/track.module';
import { StorageModule } from './storage/infrastructure/module/storage.module';



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
  providers: [PrismaService],
})
export class AppModule { }
