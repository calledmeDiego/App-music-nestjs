import { Module, Provider } from '@nestjs/common';



import { PrismaService } from 'src/shared/infrastructure/prisma/services/prisma.service';
import { StorageService } from 'src/storage/application/use-case/storage.service';
import { StorageController } from '../controller/storage.controller';
import { StorageMongoRepository } from '../repository/storage-prisma.repository';
import { FileSystemService } from '../filesystem/file-system.service';
import { StorageSqlserverRepository } from '../repository/storage-sqlserver.repository';
const storageRepoProvider: Provider = {
  provide: 'StorageRepository',
  useClass:
    <string>process.env.DB_PROVIDER === 'mongo' ? StorageMongoRepository : StorageSqlserverRepository
}

@Module({
  controllers: [StorageController],
  providers: [StorageService, PrismaService,
    storageRepoProvider,
    {
      provide: 'FileSystemPort',
      useClass: FileSystemService
    }
  ],

})
export class StorageModule { }
