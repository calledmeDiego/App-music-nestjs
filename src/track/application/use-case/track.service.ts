import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import type { TrackRepository } from 'src/track/domain/repository/track.repository';
import type { StorageRepository } from 'src/storage/domain/repository/storage.repository';
import { type EventBus, eventBusDefinition } from 'src/shared/domain/events/event-bus';

import { TrackEntity } from 'src/track/domain/entities/track.entity';
import { Artist } from 'src/track/domain/value-objects/artist.vo';
import { Duration } from 'src/track/domain/value-objects/duration.vo';

import { TrackRepresentation } from '../representation/track.representation';
import { TracksRepresentation } from '../representation/tracks.representation';

import { CreateTrackDTO } from 'src/track/application/dto/create-track.dto';

import { TrackNotFoundException, DurationNullException, ArtistNullException } from 'src/track/domain/exception';
import { UpdateTrackDTO } from '../dto/update-track.dto';
import { StorageEntity } from 'src/storage/domain/entities/storage.entity';
import { StorageNotFoundException } from 'src/storage/domain/exception';
import { Uuid } from 'src/shared/domain/value-object/Uuid.vo';


@Injectable()
export class TrackService {
  constructor(
    @Inject('TrackRepository') private readonly trackRepository: TrackRepository,
    @Inject('StorageRepository') private readonly storageRepository: StorageRepository,
    @Inject(eventBusDefinition.name) private readonly eventBus: EventBus) { }

  async createTrack(data: CreateTrackDTO) {
    const artist = data.artist ? Artist.create(data.artist) : null;

    if (!artist) throw new ArtistNullException();

    const duration = data.duration ? Duration.create(data.duration) : null;
    if (!duration) throw new DurationNullException();

    let trackCreated = TrackEntity.create({
      name: data.name,
      album: data.album,
      cover: data.cover,
      artist,
      duration,
      mediaId: data.mediaId
    }
    );

    const storage = trackCreated.mediaId ? await this.storageRepository.findById(trackCreated.mediaId): null;

    this.eventBus.publish(trackCreated.pullEvents());

    trackCreated = await this.trackRepository.create(trackCreated);

    return TrackRepresentation.fromTrack(trackCreated, storage).format();
  }

  async getTrack(id: string) {

    const trackId = Uuid.fromString(id)
    const track = await this.trackRepository.findById(trackId);
    if (!track) throw new TrackNotFoundException();

    const storage = track.mediaId ? await this.storageRepository.findById(track.mediaId) : null;

    const trackRepresentation = TrackRepresentation.fromTrack(track, storage).format();
    return trackRepresentation;
  }

  async listTracks() {
    const allTracks = await this.trackRepository.list();

    const mediaIds: Uuid[] = allTracks.map(t => t.mediaId).filter((id): id is Uuid => !!id);

    const storages = await this.storageRepository.findManyById(mediaIds);

    const storageMap = new Map(storages.map(s => [s.id.value, s]));

    return TracksRepresentation.fromTracks(allTracks, storageMap).format();
  }

  async updateTrack(id: string, data: CreateTrackDTO) {
    try {

      const trackId = Uuid.fromString(id)

      const existingTrack = await this.trackRepository.findById(trackId);

      if (!existingTrack) {
        throw new TrackNotFoundException();
      }

      const artist = data.artist ? Artist.create(data.artist) : null;

      if (!artist) throw new ArtistNullException();

      const duration = data.duration ? Duration.create(data.duration) : null;

      if (!duration) throw new DurationNullException();

      const storageId = Uuid.fromString(data.mediaId);
      const storage = await this.storageRepository.findById(storageId);

      const track = TrackEntity.update({
        id,
        name: data.name,
        album: data.album,
        cover: data.cover,
        artist,
        duration,
        mediaId: storage?.id.value,
        createdAt: existingTrack.createdAt
      });

      this.eventBus.publish(track.pullEvents());
      const updatedTrack = await this.trackRepository.update(trackId, track);

      return TrackRepresentation.fromTrack(updatedTrack, storage).format()

    } catch (error) {
      throw new HttpException('Error al actualizar el track', HttpStatus.FORBIDDEN);
    }
  }

  async deleteTrack(id: string) {

    const trackId = Uuid.fromString(id)
    const existingTrack = await this.trackRepository.findById(trackId);

    if (!existingTrack) {
      throw new TrackNotFoundException();
    }
    existingTrack.delete();

    this.eventBus.publish(existingTrack.pullEvents());
    await this.trackRepository.softDelete(existingTrack.id);

    return {
      deletedTrack: true
    };
  }

  async updatePartialTrack(id: string, data: UpdateTrackDTO) {
    const trackId = Uuid.fromString(id)
    const storageId = data.mediaId ? Uuid.fromString(data.mediaId) : null;

    const trackFound = await this.trackRepository.findById(trackId);
    let storage: StorageEntity | null;
    if (!trackFound) throw new TrackNotFoundException();
    if (storageId === null && trackFound.id === null) {
       storage = null
    }
    storage = await this.storageRepository.findById(storageId || trackFound.mediaId!);

    // Si no encuentra storage,
    if (!storage) throw new StorageNotFoundException();

    const track = TrackEntity.update({
      id,
      name: data.name ? data.name : trackFound.name,
      album: data.album || trackFound.album,
      cover: data.cover ? data.cover : trackFound.cover,
      artist: trackFound.artist,
      duration: trackFound.duration,
      mediaId: storage.id.value ?? null,
      createdAt: trackFound.createdAt
    });

    this.eventBus.publish(track.pullEvents());
    const updatedTrack = await this.trackRepository.update(track.id, track);

    return TrackRepresentation.fromTrack(updatedTrack, storage).format()

  }
}
