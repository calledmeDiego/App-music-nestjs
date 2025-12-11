import { Inject, Injectable } from '@nestjs/common';

import { StorageEntity } from 'src/storage/domain/entities/storage.entity';
import { Uuid } from 'src/shared/domain/value-object/Uuid.vo';
// Inyecciones de dependencia
import { storageRepositoryName, type StorageRepository } from 'src/storage/domain/repository/storage.repository';
import { fileSystemPortName, type FileSystemPort } from 'src/storage/domain/repository/file-system.repository';
import { type EventBus, eventBusDefinition } from 'src/shared/domain/events/event-bus';
import { EnvService } from 'src/shared/infrastructure/config/env.service';

import { StorageNotFoundException } from 'src/storage/domain/exception';

import { StorageRepresentation } from '../representation/storage.representation';
import { StoragesRepresentation } from '../representation/storages.representation';

@Injectable()
export class StorageService {

  constructor(
    @Inject(storageRepositoryName) private readonly storageRepository: StorageRepository, 
    @Inject(fileSystemPortName) private readonly fileSystem: FileSystemPort,
    @Inject(eventBusDefinition.name) private readonly eventBus: EventBus,
    private readonly envService: EnvService
  ) { }

  //dto create en el parametro
  async createStorage(file: Express.Multer.File) {
     const PUBLIC_URL = this.envService.publicUrl;
    
    const fileData = {
      url: `${PUBLIC_URL}/${file.filename}`,
      filename: file.filename
    };

    const storage = StorageEntity.create({ url: fileData.url, filename: fileData.filename });

    const storageCreated = await this.storageRepository.create(storage);

    this.eventBus.publish(storage.pullEvents())
    return StorageRepresentation.fromStorage(storageCreated).format();
  }

  async findAllStorages() {
    const allStorages = await this.storageRepository.listAll();

    const storages = StoragesRepresentation.fromStorages(allStorages).format();

    return storages;
  }

  async findStorageById(id: string) {

    const storageId =  Uuid.fromString(id);
    const foundStorage = await this.storageRepository.findById(storageId)
    if (!foundStorage) throw new StorageNotFoundException();

    return StorageRepresentation.fromStorage(foundStorage).format();
  }

  async removeStorage(id: string) {

    const storageId =  Uuid.fromString(id);
    const storage = await this.storageRepository.findById(storageId);

    if (!storage) throw new StorageNotFoundException();

    await this.fileSystem.deleteFile(storage.filename);

    storage.delete();
    this.eventBus.publish(storage.pullEvents());

    const deletedStorage = await this.storageRepository.delete(storageId);

    return {
      ...StorageRepresentation.fromStorage(deletedStorage).format(),
      deleted: true
    }

  }
}