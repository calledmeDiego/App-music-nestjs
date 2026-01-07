import { Global, Module, Provider } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";

import { AuthModule } from './auth/infrastructure/module/auth.module';
import { TrackModule } from './track/infrastructure/module/track.module';
import { StorageModule } from './storage/infrastructure/module/storage.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SlackLoggerService } from './shared/infrastructure/logging/slack-logger.service';

import { EnvService } from './shared/infrastructure/config/env.service';
import { MongoPrismaService } from './shared/infrastructure/prisma/services/mongo-prisma.service';
import { EventEmitterService } from './shared/infrastructure/services/event-emitter.service';

import { eventBusDefinition } from './shared/domain/events/event-bus';
import { DATABASE_INSTANCE } from './shared/domain/constants/db-instance';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    // Sistema de eventos
    EventEmitterModule.forRoot(),

    // Feature Modules
    AuthModule,
    TrackModule,
    StorageModule
  ],
  controllers: [],
  providers: [ 
    // Logging
    SlackLoggerService, 
    // Configuracion
    EnvService ,

    // Base de datos a utilizar
    {
      provide: DATABASE_INSTANCE,
      // Usamos useFactory para la lógica de decisión, pero solo dentro de este módulo
      useFactory: async (envService: EnvService) => {
        const dbProvider = envService.dbProvider.trim();

        if (!globalThis['dbInstance']) {
          if (dbProvider === 'mongo') {
            const mongoService = new MongoPrismaService();
            await mongoService.onModuleInit();
            globalThis['dbInstance'] = mongoService;
          } 
          // else {
          //   const sqlService = new SqlServerPrismaService();
          //   await sqlService.onModuleInit();
          //   globalThis['dbInstance'] = sqlService;
          // }
        }
        return globalThis['dbInstance'];
      },
      inject: [EnvService],
    },
    // Bus de eventos propio
    {
      provide: eventBusDefinition.name,
      useClass: EventEmitterService
    }
  ],

  exports: [
    SlackLoggerService, 
    EnvService, 
    DATABASE_INSTANCE,
    eventBusDefinition.name]
})
export class AppModule { }
