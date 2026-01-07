import { Module } from '@nestjs/common';

import { StorageService } from 'src/storage/application/use-case/storage.service';
import { StorageController } from '../controller/storage.controller';

import { StorageMongoRepository } from '../repository/storage-mongo.repository';
// import { StorageSqlserverRepository } from '../repository/storage-sqlserver.repository';
import { FileSystemService } from '../filesystem/file-system.service';

import { EnvService } from 'src/shared/infrastructure/config/env.service';
import { AuthModule } from 'src/auth/infrastructure/module/auth.module';

import { StorageEventHandler } from '../subscriber/storage-event.handler';

import { storageRepositoryName } from 'src/storage/domain/repository/storage.repository';
import { fileSystemPortName } from 'src/storage/domain/repository/file-system.repository';
import { DATABASE_INSTANCE } from 'src/shared/domain/constants/db-instance';

@Module({
  imports: [ AuthModule],
  controllers: [StorageController],
  providers: [StorageService,StorageEventHandler,
    {
      provide: storageRepositoryName,
      useFactory: (dbInstance: any, envService: EnvService) => {
        const dbProvider = envService.dbProvider.trim();
        return dbProvider === 'mongo' ? new StorageMongoRepository(dbInstance) : 'new StorageSqlserverRepository(dbInstance)';
      },
      inject: [DATABASE_INSTANCE, EnvService]
    },
    {
      provide: fileSystemPortName,
      useClass: FileSystemService
    }
  ],
  exports: [storageRepositoryName]

})
export class StorageModule { }
