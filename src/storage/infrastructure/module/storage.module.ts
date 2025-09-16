import { Module } from '@nestjs/common';



import { PrismaService } from 'src/prisma.service';
import { StorageService } from 'src/storage/application/use-case/storage.service';
import { StorageController } from '../controller/storage.controller';
import { StoragePrismaRepository } from '../repository/storage-prisma.repository';

@Module({
  controllers: [StorageController],
  providers: [StorageService, PrismaService,
    {
      provide: 'StorageRepository',
      useClass: StoragePrismaRepository
    }
  ],

})
export class StorageModule { }
