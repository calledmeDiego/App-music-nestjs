import { Module, Provider } from '@nestjs/common';

import { TrackController } from '../controller/track.controller';
import { TrackService } from 'src/track/application/use-case/track.service';
import { TrackMongoRepository } from '../repository/track-mongo.repository';
import { PrismaService } from 'src/shared/infrastructure/prisma/services/prisma.service';
import { AuthModule } from 'src/auth/infrastructure/module/auth.module';
import { TrackSqlServerRepository } from '../repository/track-sqlserver.repository';
import { StorageModule } from 'src/storage/infrastructure/module/storage.module';
import { DatabaseModule } from 'src/shared/infrastructure/prisma/module/database.module';
import { EnvModule } from 'src/shared/infrastructure/config/env.module';
import { EnvService } from 'src/shared/infrastructure/config/env.service';

@Module({
  controllers: [TrackController],
  imports: [AuthModule, StorageModule, DatabaseModule, EnvModule],
  providers: [TrackService, PrismaService,
    {
      provide: 'TrackRepository',
      useFactory: (dbInstance: any, envService: EnvService) => {
        const dbProvider = envService.dbProvider.trim();
        return dbProvider === 'mongo' ? new TrackMongoRepository(dbInstance) : new TrackSqlServerRepository(dbInstance);
      },
      inject: ['DATABASE_INSTANCE', EnvService]
    }
  ],
})
export class TrackModule {

}
