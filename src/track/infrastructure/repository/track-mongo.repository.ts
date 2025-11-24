import { Injectable } from '@nestjs/common';

import { MongoPrismaService } from 'src/shared/infrastructure/prisma/services/mongo-prisma.service';
import { TrackEntity } from 'src/track/domain/entities/track.entity';
import { TrackRepository } from 'src/track/domain/repository/track.repository';



@Injectable()
export class TrackMongoRepository implements TrackRepository {

  constructor(private readonly prismaService: MongoPrismaService) { }

  async create(track: TrackEntity): Promise<TrackEntity> {

    const createdTrack = await this.prismaService.tracks.create({
      data: {
        name: track.name,
        album: track.album,
        cover: track.cover,
        artist: track.artist,
        duration: {
          start: Number(track.duration?.start),
          end: Number(track.duration?.end)
        },
        mediaId: track.mediaId,
        deletedAt: null
      }
    });

    return TrackEntity.FromDbToEntityParse(createdTrack);
  }

  async findById(id: string): Promise<TrackEntity | null> {
    const foundTrack = await this.prismaService.tracks.findUnique({
      where: {
        id
      }
    });

    if (!foundTrack) return null;

    return TrackEntity.FromDbToEntityParse(foundTrack);

  }

  async list(): Promise<TrackEntity[]> {
    const allTracks = await this.prismaService.tracks.findMany({
      where: { deletedAt: null },
    });

    const tracks = allTracks.map((t) => {
      return TrackEntity.FromDbToEntityParse(t);
    });

    return tracks;
  }

  async update(id: string, track: TrackEntity): Promise<TrackEntity> {

    const updatedTrack = await this.prismaService.tracks.update({
      where: { id },
      data: {
        name: track.name,
        album: track.album,
        cover: track.cover,
        artist: track.artist,
        duration: {
          start: Number(track.duration?.start),
          end: Number(track.duration?.end)
        },
        mediaId: track.mediaId,
        deletedAt: track.deletedAt
      }
    });
    return TrackEntity.FromDbToEntityParse(updatedTrack)

  }

  async softDelete(id: string): Promise<any> {
    return await this.prismaService.tracks.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }
}
