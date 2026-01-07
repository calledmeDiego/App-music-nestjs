# 🎵 SoundWave API - Clean Architecture + DDD

API musical construida con NestJS siguiendo principios de Clean Architecture y Domain-Driven Design, lo que permite la portabilidad de la capa de persistencia.

## 🚀 Características Principales

- **Gestión de canciones y artistas**
- **Sistema de autenticación con JWT** 
- **Almacenamiento de archivos de audio** 
- **Arquitectura limpia y mantenible**
- **Documentación Swagger interactiva**


## 📦 Instalación Rápida
Pasos para implementar la aplicación en local.
```bash
# 1. Clonar repositorio
git clone https://github.com/calledmeDiego/App-music-nestjs.git

# 2. Instalar dependencias
npm install

# 3. Instalar dependencias de Prisma
npm run postinstall

# 4. Configurar entorno
cp .env.example .env

# 5. Ejecutar en desarrollo
npm run start:dev
```

## 📖 Documentación de la API

Accede a la documentación interactiva completa en:

### 🔗 **Swagger UI**: http://localhost:3001/api

### ¿Qué puedes hacer en Swagger?
- ✅ **Ver todos los endpoints disponibles**
- ✅ **Probar la API directamente desde el navegador** 
- ✅ **Ver ejemplos de requests y responses** 
- ✅ **Autenticarte fácilmente con el botón "Authorize" para acceder a los servicios** 

### 🎯 Primeros pasos en Swagger:
1. Ve a http://localhost:3001/api
2. Registrate en `POST /auth/register`
3. Inicia sesión en `POST /auth/login` y copia el JWT
2. Haz clic en **`Authorize`** ⬆️ (esquina superior derecha)
3. Ingresa tu token JWT: `<tu-token>`
4. ¡Ya puedes probar todos los endpoints!

## 🛠️ Tecnologías Clave
* **Backend:** NestJS + TypeScript
* **ORM/Database Client:** Prisma ORM
* **Bases de Datos:** SQL Server / MongoDB (Configuración condicional)
* **Autenticación:** JWT (JSON Web Tokens)
* **Validación**: class-validator + DTOs
* **Arquitectura**: Clean Architecture + DDD


## 📹 Basado en

Este proyecto está inspirado en el tutorial:
**[Mi manera de aprender NODE JS y Express BACKEND curso desde cero MySQL o MongoDB]** por [Leifer Mendez]
🔗 [Enlace al video de YouTube](https://youtu.be/xRXHQlqA3Ak?si=2xVv7VGYVwTkqdt8)

## 📄 Licencia

Este proyecto es de uso gratuito y libre. ¡Siéntete libre de usarlo, modificarlo y distribuirlo!

## ✒️ Autores

* **Diego Gabriel Cárdenas Luna** - *Desarrollo y arquitectura* - [calledmeDiego](https://github.com/calledmeDiego)
* **[Leifer Mendez]** - *Inspiración y base inicial*


## 🎁 Agradecimientos

Si este proyecto te fue útil:
- ⭐ Dale una estrella al repositorio
- 🐛 Reporta bugs o sugiere mejoras
- 📺 Mira el [video original](https://github.com/calledmeDiego) para más contexto

## 🎁 Branches

- `master`: soporta SQL Server y MongoDB
- `cloud-mongo`: versión en producción (Solo MongoDB)


🎵 Desarrollado con pasión por [Diego Gabriel](https://github.com/calledmeDiego)