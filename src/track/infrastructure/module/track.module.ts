import { Module } from '@nestjs/common';

import { TrackController } from '../controller/track.controller';
import { TrackService } from 'src/track/application/use-case/track.service';
import { TrackPrismaRepository } from '../repository/track-prisma.repository';
import { PrismaService } from 'src/prisma.service';
import { UserModule } from 'src/auth/infrastructure/module/user.module';


@Module({
  controllers: [TrackController],
  imports: [UserModule],
  providers: [TrackService, PrismaService,
    {
      provide: 'TrackRepository',
      useClass: TrackPrismaRepository
    }
  ],
})
export class TrackModule { 
  
}
