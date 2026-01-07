import { Module } from '@nestjs/common';

import { TrackController } from '../controller/track.controller';
import { TrackService } from 'src/track/application/use-case/track.service';

import { TrackMongoRepository } from '../repository/track-mongo.repository';
// import { TrackSqlServerRepository } from '../repository/track-sqlserver.repository';

import { AuthModule } from 'src/auth/infrastructure/module/auth.module';
import { StorageModule } from 'src/storage/infrastructure/module/storage.module';
import { EnvService } from 'src/shared/infrastructure/config/env.service';

import { TrackEventHandler } from '../subscriber/track-event.handler';

import { trackRepositoryName } from 'src/track/domain/repository/track.repository';
import { DATABASE_INSTANCE } from 'src/shared/domain/constants/db-instance';

@Module({
  imports: [AuthModule, StorageModule],
  controllers: [TrackController],
  providers: [TrackService,TrackEventHandler,
    {
      provide: trackRepositoryName,
      useFactory: (dbInstance: any, envService: EnvService) => {
        const dbProvider = envService.dbProvider.trim();
        return dbProvider === 'mongo' ? new TrackMongoRepository(dbInstance) : 'new TrackSqlServerRepository(dbInstance)';
      },
      inject: [DATABASE_INSTANCE, EnvService]
    }
  ],
  exports: [
    trackRepositoryName
  ]
})
export class TrackModule {

}
