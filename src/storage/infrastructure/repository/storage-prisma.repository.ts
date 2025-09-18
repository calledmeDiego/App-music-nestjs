import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { StorageEntity } from 'src/storage/domain/entities/storage.entity';
import { StorageRepository } from 'src/storage/domain/repository/storage.repository';
// import { CreateStorageDto } from './dto/create-storage.dto';
// import { UpdateStorageDto } from './dto/update-storage.dto';

@Injectable()
export class StoragePrismaRepository implements StorageRepository {

  constructor(private readonly prismaService: PrismaService) { }

  async create(storage: StorageEntity): Promise<StorageEntity> {
    const storageCreated = await this.prismaService.storages.create({
      data: {
        filename: storage.filename,
        url: storage.url
      }
    });

    return StorageEntity.ShowJson(storageCreated);
  }

  async findById(id: string): Promise<StorageEntity | null> {
    const storageFound = await this.prismaService.storages.findUnique({
      where: {
        id
      }
    });

    if (!storageFound) return null;

    return new StorageEntity(storageFound.id, storageFound.url, storageFound.filename, storageFound.createdAt, storageFound.updatedAt);
  }


  async listAll(): Promise<StorageEntity[]> {
    const allStorages = await this.prismaService.storages.findMany();

    return allStorages.map((s) => new StorageEntity(
      s.id,
      s.url,
      s.filename,
      s.createdAt,
      s.updatedAt
    ));
  }

  async update(id: string, storage: StorageEntity): Promise<StorageEntity> {
    const foundStorage = await this.prismaService.storages.findUnique({
      where: { id }
    });

    if (!foundStorage) {
      throw new NotFoundException(`Storage with id ${id} not found`);
    }

    const updateStorage = await this.prismaService.storages.update({
      where: { id },
      data: {
        url: storage.url,
        filename: storage.filename,
      }
    });

    return StorageEntity.ShowJson(updateStorage)
  }

  async delete(id: string) {
    const foundStorage = await this.prismaService.storages.findUnique({
      where: {
        id
      }
    });

    if (!foundStorage) {
      throw new NotFoundException(`Storage with id ${id} not found`);
    }

    await this.prismaService.storages.delete({
      where: {id}
    });

    return {
      ...StorageEntity.ShowJson(foundStorage),
      deleted: true
    }
    
  }
}
