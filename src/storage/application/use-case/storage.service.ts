import { Inject, Injectable } from '@nestjs/common';
import { StorageEntity } from 'src/storage/domain/entities/storage.entity';
import type { StorageRepository } from 'src/storage/domain/repository/storage.repository';
import { CreateStorageDTO } from 'src/storage/application/dto/create-storage.dto';
import { GetIdDTO } from 'src/shared/application/dto/get-id.dto';
import type { FileSystemPort } from 'src/storage/domain/repository/file-system.repository';
// import { CreateStorageDto } from './dto/create-storage.dto';
// import { UpdateStorageDto } from './dto/update-storage.dto';

@Injectable()
export class StorageService {

  constructor(@Inject('StorageRepository') private readonly storageRepository: StorageRepository, @Inject('FileSystemPort') private readonly fileSystem: FileSystemPort) { }

  //dto create en el parametro
  async createStorage(data: CreateStorageDTO) {
    const storage = StorageEntity.CreateFormStorage({ url: data.url, filename: data.filename });
    return await this.storageRepository.create(storage);
  }

  async findAllStorages() {
    return await this.storageRepository.listAll();
  }

  async findStorageById(id: string) {
    return await this.storageRepository.findById(id);
  }

  // update dto
  async updateStorage(idDTO: GetIdDTO, updateData: CreateStorageDTO) {
    const existingStorage = await this.storageRepository.findById(idDTO.id);
    if (!existingStorage) {
      throw new Error('TrackNotFoundException');
    }

    const updatedStorage = StorageEntity.CreateFormStorage({ url: updateData.url, filename: updateData.filename })

    return await this.storageRepository.update(idDTO.id, updatedStorage);
  }

  async removeStorage(id: string) {
    const storage = await this.storageRepository.findById(id);
    if (!storage) throw new Error('StorageNotFoundException');

    await this.fileSystem.deleteFile(storage.filename);

    return await this.storageRepository.delete(id);

  }
}
