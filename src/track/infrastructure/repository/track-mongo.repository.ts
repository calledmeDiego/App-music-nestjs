import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { MongoPrismaService } from 'src/shared/infrastructure/prisma/services/mongo-prisma.service';
import { PrismaService } from 'src/shared/infrastructure/prisma/services/prisma.service';
import { TrackEntity } from 'src/track/domain/entities/track.entity';
import { TrackRepository } from 'src/track/domain/repository/track.repository';
import { Artist } from 'src/track/domain/value-object/artist.vo';
import { Duration } from 'src/track/domain/value-object/duration.vo';


@Injectable()
export class TrackMongoRepository implements TrackRepository {

  constructor(private readonly prismaService: PrismaService) {}

  async create(track: TrackEntity): Promise<any> {
    
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
    })
    return TrackEntity.ShowJSON(createdTrack);
  }

  async findById(id: string): Promise<any> {
    const foundTrack =await this.prismaService.mongo.tracks.findUnique({
      where: {
        id
      }
    })

    if (!foundTrack) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
    const storage = await this.prismaService.mongo.storages.findUnique({
      where: { id: foundTrack.mediaId || ''}
    });


    return {...TrackEntity.ShowJSON(foundTrack),
      media: storage
    }

  }
  async list(): Promise<any[]> {
    const allTracks = await this.prismaService.mongo.tracks.findMany({
      where: { deletedAt: null },
    });
    const mediaIds: string[] = allTracks.map(t => t.mediaId!);

    const storages = await this.prismaService.mongo.storages.findMany({
      where: { id: {in: mediaIds}}
    });

    const storageMap = new Map(storages.map(s => [s.id, s]));
//  return allTracks.map((t) => TrackEntity.ShowJSON(t));
    return allTracks.map((t) => ({
      ...TrackEntity.ShowJSON(t),
      media: storageMap.get(t.mediaId!) || null
    }));
  }

  async update(id: string, track: TrackEntity): Promise<any> {

    const foundTrack = await this.prismaService.mongo.tracks.findUnique({
      where: { id }
    });

    if (!foundTrack) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }

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
    try {
      return TrackEntity.ShowJSON(updatedTrack)
    } catch (error) {
      throw new HttpException('Error al actualizar el track', HttpStatus.FORBIDDEN);
    }
  }

  async softDelete(id: string): Promise<any> {
    const foundTrack = await this.prismaService.mongo.tracks.findUnique({
      where: {
        id
      }
    })
    if (!foundTrack) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }

    await this.prismaService.mongo.tracks.update({
      where: { id },
      data: { deletedAt: new Date() }
    });

    return TrackEntity.ShowJSON(foundTrack)
  }
}
