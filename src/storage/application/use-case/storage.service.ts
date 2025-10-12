import { Inject, Injectable } from '@nestjs/common';
import { StorageEntity } from 'src/storage/domain/entities/storage.entity';
import type { StorageRepository } from 'src/storage/domain/repository/storage.repository';
import { CreateStorageDTO } from 'src/storage/application/dto/create-storage.dto';
import { GetIdDTO } from 'src/shared/application/dto/get-id.dto';
import type { FileSystemPort } from 'src/storage/domain/repository/file-system.repository';

import { StorageNotFoundException } from 'src/storage/domain/exception/storage-not-found.exception';
import { StorageRepresentation } from '../representation/storage.representation';
import { StoragesRepresentation } from '../representation/storages.representation';
import { EnvService } from 'src/shared/infrastructure/config/env.service';

@Injectable()
export class StorageService {

  constructor(
    @Inject('StorageRepository') private readonly storageRepository: StorageRepository, @Inject('FileSystemPort') private readonly fileSystem: FileSystemPort,
    private readonly envService: EnvService,
  ) { }

  //dto create en el parametro
  async createStorage(file: Express.Multer.File) {

     const PUBLIC_URL = this.envService.publicUrl;
    
    const fileData = {
      url: `${PUBLIC_URL}/${file.filename}`,
      filename: file.filename
    };

    const storage = StorageEntity.CreateFormStorage({ url: fileData.url, filename: fileData.filename });

    const storageCreated = await this.storageRepository.create(storage);
    return StorageRepresentation.fromStorage(storageCreated).format();
  }

  async findAllStorages() {

    const allStorages = await this.storageRepository.listAll();

    const storages = StoragesRepresentation.fromStorages(allStorages).format();

    return storages;
  }

  async findStorageById(id: string) {

    const foundStorage = await this.storageRepository.findById(id)
    if (!foundStorage) throw new StorageNotFoundException();

    return StorageRepresentation.fromStorage(foundStorage).format();
  }

  // update dto
  async updateStorage(idDTO: GetIdDTO, updateData: CreateStorageDTO) {
    const existingStorage = await this.storageRepository.findById(idDTO.id);
    if (!existingStorage) {
      throw new StorageNotFoundException();
    }

    const updatedStorage = StorageEntity.CreateFormStorage({ url: updateData.url, filename: updateData.filename })

    return await this.storageRepository.update(idDTO.id, updatedStorage);
  }

  async removeStorage(id: string) {
    const storage = await this.storageRepository.findById(id);

    if (!storage) throw new StorageNotFoundException();

    await this.fileSystem.deleteFile(storage.filename);

    const deletedStorage = await this.storageRepository.delete(id);
    return {
      ...StorageRepresentation.fromStorage(deletedStorage).format(),
      deleted: true
    }

  }
}