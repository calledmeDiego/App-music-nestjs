import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TrackEntity } from 'src/track/domain/entities/track.entity';
import { TrackRepository } from 'src/track/domain/repository/track.repository';
import { Artist } from 'src/track/domain/value-object/artist.vo';
import { Duration } from 'src/track/domain/value-object/duration.vo';


@Injectable()
export class TrackPrismaRepository implements TrackRepository {

  constructor(private readonly prismaService: PrismaService) { }

  async create(track: TrackEntity): Promise<TrackEntity> {

    const createdTrack = await this.prismaService.tracks.create({
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
    
    return TrackEntity.ShowJSON(createdTrack);

  }
  async findById(id: string): Promise<TrackEntity | null> {
    const foundTrack = await this.prismaService.tracks.findUnique({
      where: {
        id
      }
    })
    if (!foundTrack) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }

    return TrackEntity.ShowJSON(foundTrack)
    
  }
  async list(): Promise<TrackEntity[]> {
    const allTracks = await this.prismaService.tracks.findMany({
      where: { deletedAt: null },
    });

    return allTracks.map((t) => TrackEntity.ShowJSON(t));
  }

  async update(id: string, track: TrackEntity): Promise<TrackEntity> {

    const foundTrack = await this.prismaService.tracks.findUnique({
      where: { id }
    });

    if (!foundTrack) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }

    const updatedTrack = await this.prismaService.tracks.update({
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

  async softDelete(id: string): Promise<void | TrackEntity> {
    const foundTrack = await this.prismaService.tracks.findUnique({
      where: {
        id
      }
    })
    if (!foundTrack) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }

    await this.prismaService.tracks.update({
      where: { id },
      data: { deletedAt: new Date() }
    });

    return TrackEntity.ShowJSON(foundTrack)
  }
}
