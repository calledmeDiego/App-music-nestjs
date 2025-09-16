import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from "express";
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PUERTO:string | number = process.env.PORT ?? 3000;

  //Configurar la carpeta storage como pública
  app.use('/',express.static(join(process.cwd(), 'storage')));

  app.useGlobalPipes(new ValidationPipe({
     whitelist: true,   // elimina propiedades que no estén en el DTO
    forbidNonWhitelisted: true, // lanza error si llega algo no definido
    transform: true,   // convierte tipos (ej. strings a numbers)

  }))
  .useGlobalFilters(
    new HttpExceptionFilter()
  );

  app.enableCors();
  await app.listen(PUERTO, () => {
    console.log(`http://localhost:${PUERTO}`);

  });
}
bootstrap();
