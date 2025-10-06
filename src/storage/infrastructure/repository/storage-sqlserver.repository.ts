import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/infrastructure/prisma/services/prisma.service';
import { StorageEntity } from 'src/storage/domain/entities/storage.entity';
import { StorageRepository } from 'src/storage/domain/repository/storage.repository';
// import { CreateStorageDto } from './dto/create-storage.dto';
// import { UpdateStorageDto } from './dto/update-storage.dto';

@Injectable()
export class StorageSqlserverRepository implements StorageRepository {

  constructor(private readonly prismaService: PrismaService) { }

  async create(storage: StorageEntity): Promise<StorageEntity> {
    const storageCreated = await this.prismaService.sql.storages.create({
      data: {
        filename: storage.filename,
        url: storage.url
      }
    });

    return StorageEntity.ShowJson(storageCreated);
  }

  async findById(id: string): Promise<StorageEntity | null> {
    const storageFound = await this.prismaService.sql.storages.findUnique({
      where: {
        id
      }
    });

    if (!storageFound) return null;

    return StorageEntity.ShowJson(storageFound);
  }


  async listAll(): Promise<StorageEntity[]> {
    const allStorages = await this.prismaService.sql.storages.findMany();

    return allStorages.map((s) => StorageEntity.ShowJson(s));
  }

  async update(id: string, storage: StorageEntity): Promise<StorageEntity> {
    const foundStorage = await this.prismaService.sql.storages.findUnique({
      where: { id }
    });

    if (!foundStorage) {
      throw new NotFoundException(`Storage with id ${id} not found`);
    }

    const updateStorage = await this.prismaService.sql.storages.update({
      where: { id },
      data: {
        url: storage.url,
        filename: storage.filename,
      }
    });

    return StorageEntity.ShowJson(updateStorage)
  }

  async delete(id: string) {
    const foundStorage = await this.prismaService.sql.storages.findUnique({
      where: {
        id
      }
    });

    if (!foundStorage) {
      throw new NotFoundException(`Storage with id ${id} not found`);
    }

    await this.prismaService.sql.storages.delete({
      where: { id }
    });

    return {
      ...StorageEntity.ShowJson(foundStorage),
      deleted: true
    }

  }
}
