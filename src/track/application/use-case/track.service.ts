import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { TrackEntity } from 'src/track/domain/entities/track.entity';
import type { TrackRepository } from 'src/track/domain/repository/track.repository';
import { Artist } from 'src/track/domain/value-object/artist.vo';
import { Duration } from 'src/track/domain/value-object/duration.vo';
import { CreateTrackDTO } from 'src/track/application/dto/create-track.dto';
import { TrackNotFoundException } from 'src/track/domain/exception/track-not-found.exception';
import { ArtistNullException } from 'src/track/domain/exception/artist-null.exception';
import { DurationNullException } from 'src/track/domain/exception/duration-null.exception';
import type { StorageRepository } from 'src/storage/domain/repository/storage.repository';
import { TrackRepresentation } from '../representation/track.representation';
import { StoragesRepresentation } from 'src/storage/application/representation/storages.representation';
import { TracksRepresentation } from '../representation/tracks.representation';


@Injectable()
export class TrackService {
  constructor(@Inject('TrackRepository') private readonly trackRepository: TrackRepository, @Inject('StorageRepository') private readonly storageRepository: StorageRepository) { }

  async createTrack(data: CreateTrackDTO) {
    const artist = data.artist ? Artist.create(data.artist) : null;

    if (!artist) throw new ArtistNullException();

    const duration = data.duration ? Duration.create(data.duration.start, data.duration.end) : null;

    if (!duration) throw new DurationNullException();

    let trackCreated = TrackEntity.CreateForm({
      name: data.name,
      album: data.album,
      cover: data.cover,
      artist,
      duration,
      mediaId: data.mediaId
    }
    );

    const storage = await this.storageRepository.findById(data.mediaId);

    trackCreated = await this.trackRepository.create(trackCreated);

    return TrackRepresentation.fromTrack(trackCreated, storage).format();
  }

  async getTrack(id: string) {

    const track = await this.trackRepository.findById(id);
    if (!track) throw new TrackNotFoundException();

    const storage = await this.storageRepository.findById(track.mediaId!);

    const trackRepresentation = TrackRepresentation.fromTrack(track, storage).format();
    return trackRepresentation;
  }

  async listTracks() {
    const allTracks = await this.trackRepository.list();

    const mediaIds: string[] = allTracks.map(t => t.mediaId).filter((id): id is string => !!id);

    const storages = await this.storageRepository.findManyById(mediaIds);

    const storageMap = new Map(storages.map(s => [s.id, s]));

    return TracksRepresentation.fromTracks(allTracks, storageMap).format();
  }

  async updateTrack(id: string, data: CreateTrackDTO) {
    try {
      const existingTrack = await this.trackRepository.findById(id);

      if (!existingTrack) {
        throw new TrackNotFoundException();
      }

      const artist = data.artist ? Artist.create(data.artist) : null;

      if (!artist) throw new ArtistNullException();

      const duration = data.duration ? Duration.create(data.duration.start, data.duration.end) : null;

      if (!duration) throw new DurationNullException();

      const storage = await this.storageRepository.findById(data.mediaId);

      const track = TrackEntity.CreateForm({
        name: data.name,
        album: data.album,
        cover: data.cover,
        artist,
        duration,
        mediaId: data.mediaId
      });

      const updatedTrack = await this.trackRepository.update(id, track);

      return TrackRepresentation.fromTrack(updatedTrack, storage).format()

    } catch (error) {
      throw new HttpException('Error al actualizar el track', HttpStatus.FORBIDDEN);
    }
  }

  async deleteTrack(id: string) {

    const existingTrack = await this.trackRepository.findById(id);

    if (!existingTrack) {
      throw new TrackNotFoundException();
    }

    await this.trackRepository.softDelete(id);

    return {
      deletedTrack: true
    };
  }
}
