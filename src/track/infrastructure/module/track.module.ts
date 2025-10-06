import { Module, Provider } from '@nestjs/common';

import { TrackController } from '../controller/track.controller';
import { TrackService } from 'src/track/application/use-case/track.service';
import { TrackMongoRepository } from '../repository/track-mongo.repository';
import { PrismaService } from 'src/shared/infrastructure/prisma/services/prisma.service';
import { AuthModule } from 'src/auth/infrastructure/module/auth.module';
import { TrackSqlServerRepository } from '../repository/track-sqlserver.repository';

const trackRepoProvider: Provider = {
  provide: 'TrackRepository',
  useClass:
    <string>process.env.DB_PROVIDER === 'mongo' ? TrackMongoRepository : TrackSqlServerRepository
}
@Module({
  controllers: [TrackController],
  imports: [AuthModule],
  providers: [TrackService, PrismaService, trackRepoProvider
  ],
})
export class TrackModule {

}
