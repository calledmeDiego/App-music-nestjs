import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from "express";
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './shared/infrastructure/filters/http-exception.filter';

import { SlackLoggerService } from './shared/infrastructure/logging/slack-logger.service';
import { EnvService } from './shared/infrastructure/config/env.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const envService = app.get(EnvService);

  const PUERTO = envService.port;


  //Configurar la carpeta storage como pública
  app.use('/', express.static(join(process.cwd(), 'storage')));

  const slackLogger = app.get(SlackLoggerService);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,   // elimina propiedades que no estén en el DTO
    forbidNonWhitelisted: true, // lanza error si llega algo no definido
    transform: true,   // convierte tipos (ej. strings a numbers)

  }))
    .useGlobalFilters(
      new HttpExceptionFilter(slackLogger)
    );

  app.enableCors();
  await app.listen(PUERTO, () => {
    console.log(`http://localhost:${PUERTO}`);

  });
}
bootstrap();
