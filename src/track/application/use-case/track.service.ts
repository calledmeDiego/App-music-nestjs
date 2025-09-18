import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { TrackEntity } from 'src/track/domain/entities/track.entity';
import type { TrackRepository } from 'src/track/domain/repository/track.repository';
import { Artist } from 'src/track/domain/value-object/artist.vo';
import { Duration } from 'src/track/domain/value-object/duration.vo';
import { CreateTrackDTO } from 'src/track/application/dto/create-track.dto';


@Injectable()
export class TrackService {

  constructor(@Inject('TrackRepository') private readonly trackRepository: TrackRepository) { }


  async createTrack(data: CreateTrackDTO): Promise<TrackEntity> {
    const artist = data.artist ? Artist.create(data.artist) : null;

    const duration = data.duration ? Duration.create(data.duration.start, data.duration.end) : null;

    const track = TrackEntity.CreateForm({
      name: data.name,
      album: data.album,
      cover: data.cover,
      artist,
      duration,
      mediaId: data.mediaId
    }
    );

    return await this.trackRepository.create(track);
  }

  async getTrack(id: string): Promise<TrackEntity | null> {
    try {
      return await this.trackRepository.findById(id);
    } catch (error) {
      throw new Error('No hay track');
    }
  }

  async listTracks(): Promise<TrackEntity[]> {
    const items = await this.trackRepository.list();

    if (!items.length) {
      throw new Error('TracksNotFoundException');
    }
    return items;
  }

  async updateTrack(id: string, data: CreateTrackDTO) {

    const existingTrack = await this.trackRepository.findById(id);
    if (!existingTrack) {
      throw new Error('TrackNotFoundException');
    }

    const artist = data.artist ? Artist.create(data.artist) : null;
    const duration = data.duration ? Duration.create(data.duration.start, data.duration.end) : null;

    const track = TrackEntity.CreateForm({
      name: data.name,
      album: data.album,
      cover: data.cover,
      artist,
      duration,
      mediaId: data.mediaId
    });
    
    return await this.trackRepository.update(id, track)
  }

  async deleteTrack(id: string) {

    return await this.trackRepository.softDelete(id);

  }
}
