import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from "express";
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './shared/infrastructure/filters/http-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { SlackLoggerService } from './shared/infrastructure/logging/slack-logger.service';
import { EnvService } from './shared/infrastructure/config/env.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const envService = app.get(EnvService);

  const PUERTO = envService.port;

  const config = new DocumentBuilder()
    .setTitle('Api de servicio de streaming de música - Soundwave')
    .setDescription(`
# 🎵 SoundWave API - Plataforma Musical

API completa para gestión de música, artistas y contenido audio digital.

## 🎧 Módulos Principales

### **🔐 Autenticación (Auth)**
- Registro de usuarios y artistas
- Inicio de sesión seguro con JWT
- Gestión de perfiles de usuario
- Roles: Usuario corriente, Administrador

### **📁 Almacenamiento (Storage)**
- Subida segura de archivos de audio
- Gestión de recursos multimedia
- URLs públicas para streaming

### **🎶 Gestión de Pistas (Tracks)**
- CRUD completo de canciones y pistas
- Metadatos de audio: duración, artista
- Sistema de reproducción y streaming

## 🎤 Funcionalidades Musicales

### **Para Usuarios corrientes**
- Buscar música

## 🛠 Stack Tecnológico
- **Backend**: NestJS con Clean Architecture + DDD
- **Bases de Datos**: MongoDB (flexible) / SQL Server (estructurado)
- **Almacenamiento**: Sistema de archivos
- **Audio**: Procesamiento de archivos de audio
- **Seguridad**: JWT + encriptación de contraseñas
`)
    .setVersion('1.0')
    .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT', // Opcional
      name: 'JWT',
      description: 'Ingresa el token JWT',
      in: 'header',
    },
    'JWT-auth' 
  )
    .build();
  const documentFactory = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);


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
    console.log(`🚀 Application running on: http://localhost:${PUERTO}`);
    console.log(`📚 Swagger docs: http://localhost:${PUERTO}/api`);

  });
}
bootstrap();
