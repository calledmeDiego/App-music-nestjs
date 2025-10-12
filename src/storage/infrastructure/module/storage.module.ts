import { Module, Provider } from '@nestjs/common';



import { PrismaService } from 'src/shared/infrastructure/prisma/services/prisma.service';
import { StorageService } from 'src/storage/application/use-case/storage.service';
import { StorageController } from '../controller/storage.controller';
import { StorageMongoRepository } from '../repository/storage-mongo.repository';
import { FileSystemService } from '../filesystem/file-system.service';
import { StorageSqlserverRepository } from '../repository/storage-sqlserver.repository';
import { EnvService } from 'src/shared/infrastructure/config/env.service';
import { DatabaseModule } from 'src/shared/infrastructure/prisma/module/database.module';
import { EnvModule } from 'src/shared/infrastructure/config/env.module';
import { AuthModule } from 'src/auth/infrastructure/module/auth.module';

@Module({
  imports: [DatabaseModule, EnvModule, AuthModule],
  controllers: [StorageController],
  providers: [StorageService, PrismaService,    
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
