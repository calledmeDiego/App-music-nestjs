import { Injectable } from '@nestjs/common';
import { MongoPrismaService } from 'src/shared/infrastructure/prisma/services/mongo-prisma.service';
import { PrismaService } from 'src/shared/infrastructure/prisma/services/prisma.service';
import { StorageRepresentation } from 'src/storage/application/representation/storage.representation';

import { StorageEntity } from 'src/storage/domain/entities/storage.entity';
import { StorageRepository } from 'src/storage/domain/repository/storage.repository';

@Injectable()
export class StorageMongoRepository implements StorageRepository {

  constructor(private readonly prismaService: MongoPrismaService) { }

  async create(storage: StorageEntity): Promise<StorageEntity> {
    const storageCreated = await this.prismaService.storages.create({
      data: {
        filename: storage.filename,
        url: storage.url
      }
    });

    const storageResponse = StorageEntity.toParse(storageCreated);

    return storageResponse;
  }

  async findById(id: string): Promise<StorageEntity|null> {
    const storageFound = await this.prismaService.storages.findUnique({
      where: {
        id
      }
    });
    if(!storageFound) return null;
 
    const storage = StorageEntity.toParse(storageFound);
    return storage;
  }


  async listAll(): Promise<StorageEntity[]> {
    const allStorages = await this.prismaService.storages.findMany();

    const storages = allStorages.map((s) => StorageEntity.toParse(s));
    return storages;
  }

  async findManyById(ids: string[]): Promise<StorageEntity[]> {
    const allStorages = await this.prismaService.storages.findMany({
      where: {
        id: {
          in: ids
        }
      }
    });

    const storages = allStorages.map((s) => StorageEntity.toParse(s));

    return storages;
  }

  async update(id: string, storage: StorageEntity): Promise<any> {

    const updateStorage = await this.prismaService.storages.update({
      where: { id },
      data: {
        url: storage.url,
        filename: storage.filename,
      }
    });

    return StorageRepresentation.fromStorage(updateStorage).format();
  }

  async delete(id: string) {

    let deletedStorage = await this.prismaService.storages.delete({
      where: { id }
    });

    deletedStorage = StorageEntity.toParse(deletedStorage);

    return deletedStorage;

  }
}
