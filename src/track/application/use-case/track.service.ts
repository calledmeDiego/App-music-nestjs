import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { TrackEntity } from 'src/track/domain/entities/track.entity';
import type { TrackRepository } from 'src/track/domain/repository/track.repository';
import { Artist } from 'src/track/domain/value-object/artist.vo';
import { Duration } from 'src/track/domain/value-object/duration.vo';
import { CreateTrackDTO } from 'src/track/application/dto/create-track.dto';
import { GetTrackDTO } from '../dto/get-track.dto';




@Injectable()
export class TrackService {

  constructor(@Inject('TrackRepository') private readonly trackRepository: TrackRepository) { }


  async createTrack(data: CreateTrackDTO): Promise<TrackEntity> {
    const artist = data.artist ? Artist.create(data.artist) : null;

    const duration = data.duration ? Duration.create(data.duration.start, data.duration.end) : null;

    const track = new TrackEntity(
      '',
      data.name ?? null,
      data.album ?? null,
      data.cover ?? null,
      artist,
      duration,
      data.mediaId ?? null,
      new Date(),
      new Date(),
    );

    return await this.trackRepository.create(track);
  }

  async getTrack(data: GetTrackDTO): Promise<TrackEntity | null> {
    try {      
      return await this.trackRepository.findById(data.id);
    } catch (error) {
      throw new HttpException('No hay track', HttpStatus.NOT_FOUND);
    }
  }


  async listTracks(): Promise<TrackEntity[]> {
    const items = await this.trackRepository.list();

    if (!items.length) {
      throw new HttpException('No hay tracks', HttpStatus.NOT_FOUND);
    }
    return items;
  }

  async updateTrack(getId: GetTrackDTO, data: CreateTrackDTO) {
    const artist = data.artist ? Artist.create(data.artist) : null;
    const duration = data.duration ? Duration.create(data.duration.start, data.duration.end): null;

    const track = new TrackEntity(
      getId.id,
      data.name ?? null,
      data.album ?? null,
      data.cover ?? null,
      artist,
      duration,
      data.mediaId ?? null,
      new Date(),
      new Date()
    );

    try {      
      return await this.trackRepository.update(getId.id, track)
    } catch (error) {
      throw new HttpException('Error al actualizar el track', HttpStatus.FORBIDDEN);
    }

  }

  async deleteTrack(data: GetTrackDTO) {
    try {      
      return await this.trackRepository.delete(data.id);
    } catch (error) {
      throw new HttpException('No hay track', HttpStatus.NOT_FOUND);  
    }
  }
}
