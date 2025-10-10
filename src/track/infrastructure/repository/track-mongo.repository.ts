import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Console } from 'console';
import { MongoPrismaService } from 'src/shared/infrastructure/prisma/services/mongo-prisma.service';
import { PrismaService } from 'src/shared/infrastructure/prisma/services/prisma.service';
import { TrackEntity } from 'src/track/domain/entities/track.entity';
import { TrackRepository } from 'src/track/domain/repository/track.repository';
import { Artist } from 'src/track/domain/value-object/artist.vo';
import { Duration } from 'src/track/domain/value-object/duration.vo';


@Injectable()
export class TrackMongoRepository implements TrackRepository {

  constructor(private readonly prismaService: PrismaService) { }

  async create(track: TrackEntity): Promise<TrackEntity> {

    const createdTrack = await this.prismaService.mongo.tracks.create({
      data: {
        name: track.name,
        album: track.album,
        cover: track.cover,
        artist: track.artist,
        duration: track.duration,
        mediaId: track.mediaId,
        deletedAt: null
      }
    });
    
    return TrackEntity.toParse(createdTrack);
  }

  async findById(id: string): Promise<TrackEntity | null> {
    const foundTrack = await this.prismaService.mongo.tracks.findUnique({
      where: {
        id
      }
    });

    if(!foundTrack) return null;

    return TrackEntity.toParse(foundTrack);

  }

  async list(): Promise<TrackEntity[]> {
    const allTracks = await this.prismaService.mongo.tracks.findMany({
      where: { deletedAt: null },
    });

    const tracks = allTracks.map((t) => {
       return TrackEntity.toParse(t);
    });
    
    return tracks;
  }

  async update(id: string, track: TrackEntity): Promise<TrackEntity> {

    const updatedTrack = await this.prismaService.mongo.tracks.update({
      where: { id },
      data: {
        name: track.name,
        album: track.album,
        cover: track.cover,
        artist: track.artist,
        duration: track.duration,
        mediaId: track.mediaId,
        deletedAt: track.deletedAt
      }
    });

    return TrackEntity.toParse(updatedTrack)

  }

  async softDelete(id: string): Promise<any> {
    return await this.prismaService.mongo.tracks.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }
}
