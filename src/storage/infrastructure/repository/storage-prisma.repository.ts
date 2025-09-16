import { Injectable } from '@nestjs/common';
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

    return new StorageEntity(storageCreated.id, storageCreated.url, storageCreated.filename, storageCreated.createdAt, storageCreated.updatedAt);
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

    return allStorages.map((s)=> new StorageEntity(
      s.id, 
      s.url,
      s.filename,
      s.createdAt,
      s.updatedAt
    ));
  }
  //dto create
  // create(createStorageDto: any) {
  //   return 'This action adds a new storage';
  // }

  // findAll() {
  //   return `This action returns all storage`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} storage`;
  // }


}
