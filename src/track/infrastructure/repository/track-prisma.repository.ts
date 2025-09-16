import { Injectable, NotFoundException } from '@nestjs/common';
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
        artist: track.artist ? {
          name: track.artist.name,
          nickname: track.artist.nickname,
          nationality: track.artist.nationality,
        } : null,
        duration: track.duration
          ? {
            start: track.duration.start,
            end: track.duration.end,
          }
          : null,
        mediaId: track.mediaId,
      }
    });



    return new TrackEntity(
      createdTrack.id,
      createdTrack.name,
      createdTrack.album,
      createdTrack.cover,
      createdTrack.artist ? Artist.create({
        name: createdTrack.artist.name ?? undefined,
        nickname: createdTrack.artist.nickname ?? undefined,
        nationality: createdTrack.artist.nationality ?? undefined
      }) : null,
      createdTrack.duration ? Duration.create(<number>createdTrack.duration.start, <number>createdTrack.duration.end) : null,
      createdTrack.mediaId,
      createdTrack.createdAt,
      createdTrack.updatedAt,
    );

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

    return new TrackEntity(
      foundTrack.id,
      foundTrack.name,
      foundTrack.album,
      foundTrack.cover,
      foundTrack.artist ? Artist.create({
        name: foundTrack.artist.name ?? undefined,
        nickname: foundTrack.artist.nickname ?? undefined,
        nationality: foundTrack.artist.nationality ?? undefined
      }) : null,
      foundTrack.duration ? Duration.create(<number>foundTrack.duration.start, <number>foundTrack.duration.end) : null,
      foundTrack.mediaId,
      foundTrack.createdAt,
      foundTrack.updatedAt,
    )
  }
  async list(): Promise<TrackEntity[]> {
    const allTracks = await this.prismaService.tracks.findMany();

    return allTracks.map((t) => new TrackEntity(
      t.id,
      t.name,
      t.album,
      t.cover,
      t.artist ? Artist.create(<Artist>t.artist) : null,
      t.duration ? Duration.create(<number>t.duration.start, <number>t.duration.end) : null,
      t.mediaId,
      t.createdAt,
      t.updatedAt,
    ))
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
        artist: track.artist ? {
          name: track.artist.name,
          nickname: track.artist.nickname,
          nationality: track.artist.nationality,
        } : null,
        duration: track.duration
          ? {
            start: track.duration.start,
            end: track.duration.end,
          }
          : null,
        mediaId: track.mediaId,
      }
    });

    return new TrackEntity(
      updatedTrack.id,
      updatedTrack.name,
      updatedTrack.album,
      updatedTrack.cover,
      updatedTrack.artist
        ? Artist.create({
          name: updatedTrack.artist.name ?? undefined,
          nickname: updatedTrack.artist.nickname ?? undefined,
          nationality: updatedTrack.artist.nationality ?? undefined,
        })
        : null,
      updatedTrack.duration
        ? Duration.create(
          updatedTrack.duration.start as number,
          updatedTrack.duration.end as number,
        )
        : null,
      updatedTrack.mediaId,
      updatedTrack.createdAt,
      updatedTrack.updatedAt,
    );
  }

  async delete(id: string): Promise<void | TrackEntity> {
    const foundTrack = await this.prismaService.tracks.findUnique({
      where: {
        id
      }
    })
    if (!foundTrack) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }

    await this.prismaService.tracks.delete({
      where: {id}
    });
    
    return new TrackEntity(
      foundTrack.id,
      foundTrack.name,
      foundTrack.album,
      foundTrack.cover,
      foundTrack.artist ? Artist.create({
        name: foundTrack.artist.name ?? undefined,
        nickname: foundTrack.artist.nickname ?? undefined,
        nationality: foundTrack.artist.nationality ?? undefined
      }) : null,
      foundTrack.duration ? Duration.create(<number>foundTrack.duration.start, <number>foundTrack.duration.end) : null,
      foundTrack.mediaId,
      foundTrack.createdAt,
      foundTrack.updatedAt,
    )
  }
}
