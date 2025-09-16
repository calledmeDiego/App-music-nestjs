import { Inject, Injectable } from '@nestjs/common';
import { StorageEntity } from 'src/storage/domain/entities/storage.entity';
import type { StorageRepository } from 'src/storage/domain/repository/storage.repository';
// import { CreateStorageDto } from './dto/create-storage.dto';
// import { UpdateStorageDto } from './dto/update-storage.dto';

@Injectable()
export class StorageService {

  constructor(@Inject('StorageRepository') private readonly storageRepository: StorageRepository) {}

  //dto create en el parametro
  async createStorage(url: string, filename: string) {
    const storage = new StorageEntity(
      '',
      url,
      filename,
      new Date(),
      new Date()
    )
    return await this.storageRepository.create(storage);
  }

  async findAllStorages() {
    return await this.storageRepository.listAll();
  }

  async findStorageById(id: string) {
    return await this.storageRepository.findById(id);
  }

  // update dto
  update(id: number, updateStorageDto: any) {
    return `This action updates a #${id} storage`;
  }

  remove(id: number) {
    return `This action removes a #${id} storage`;
  }
}
