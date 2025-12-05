import { Injectable } from '@nestjs/common';
import { Uuid } from 'src/shared/domain/value-object/Uuid.vo';
import { SqlServerPrismaService } from 'src/shared/infrastructure/prisma/services/sqlserver-prisma.service';
import { StorageRepresentation } from 'src/storage/application/representation/storage.representation';

import { StorageEntity } from 'src/storage/domain/entities/storage.entity';
import { StorageRepository } from 'src/storage/domain/repository/storage.repository';

@Injectable()
export class StorageSqlserverRepository implements StorageRepository {

  constructor(private readonly prismaService: SqlServerPrismaService) { }

  async create(storage: StorageEntity): Promise<StorageEntity> {
    const storageCreated = await this.prismaService.storages.create({
      data: {
        filename: storage.filename,
        url: storage.url
      }
    });
    const storageResponse = StorageEntity.FromDbToEntityParse(storageCreated);

    return storageResponse;
  }

  async findById(id: Uuid): Promise<StorageEntity | null> {
    const storageFound = await this.prismaService.storages.findUnique({
      where: {
        id: id.value
      }
    });
    if (!storageFound) return null;

    const storage = StorageEntity.FromDbToEntityParse(storageFound);
    return storage;
  }


  async listAll(): Promise<StorageEntity[]> {
    const allStorages = await this.prismaService.storages.findMany();

    const storages = allStorages.map((s) => StorageEntity.FromDbToEntityParse(s));
    return storages;
  }

  async findManyById(ids: Uuid[]): Promise<StorageEntity[]> {

    const idStrings = ids.map(id => id.value)

    const allStorages = await this.prismaService.storages.findMany({
      where: {
        id: {
          in: idStrings
        }
      }
    });
    const storages = allStorages.map((s) => StorageEntity.FromDbToEntityParse(s));

    return storages;

  }

  async update(id: Uuid, storage: StorageEntity): Promise<StorageEntity> {

    const updateStorage = await this.prismaService.storages.update({
      where: { id: id.value },
      data: {
        url: storage.url,
        filename: storage.filename,
      }
    });
    const storageUpd = StorageEntity.FromDbToEntityParse(updateStorage)

    return storageUpd;

  }

  async delete(id: Uuid) {

    const deletedStorage = await this.prismaService.storages.delete({
      where: { id: id.value }
    });

    const deletedStorageRes = StorageEntity.FromDbToEntityParse(deletedStorage);

    return deletedStorageRes;

  }
}
