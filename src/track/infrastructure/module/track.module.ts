import { Module } from '@nestjs/common';

import { TrackController } from '../controller/track.controller';
import { TrackService } from 'src/track/application/use-case/track.service';
import { TrackPrismaRepository } from '../repository/track-prisma.repository';
import { PrismaService } from 'src/prisma.service';


@Module({
  controllers: [TrackController],
  providers: [TrackService, PrismaService,
    {
      provide: 'TrackRepository',
      useClass: TrackPrismaRepository
    }
  ],
})
export class TrackModule { }
