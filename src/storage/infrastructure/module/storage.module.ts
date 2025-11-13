import { Module } from '@nestjs/common';
import { StorageService } from 'src/storage/application/use-case/storage.service';
import { StorageController } from '../controller/storage.controller';
import { StorageMongoRepository } from '../repository/storage-mongo.repository';
import { FileSystemService } from '../filesystem/file-system.service';
import { StorageSqlserverRepository } from '../repository/storage-sqlserver.repository';
import { EnvService } from 'src/shared/infrastructure/config/env.service';


import { AuthModule } from 'src/auth/infrastructure/module/auth.module';

@Module({
  imports: [ AuthModule],
  controllers: [StorageController],
  providers: [StorageService,
    {
      provide: 'StorageRepository',
      useFactory: (dbInstance: any, envService: EnvService) => {
        const dbProvider = envService.dbProvider.trim();
        return dbProvider === 'mongo' ? new StorageMongoRepository(dbInstance) : new StorageSqlserverRepository(dbInstance);
      },
      inject: ['DATABASE_INSTANCE', EnvService]

    },
    {
      provide: 'FileSystemPort',
      useClass: FileSystemService
    }
  ],
  exports: ['StorageRepository']

})
export class StorageModule { }
