import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Request, Put, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { StorageService } from '../../application/use-case/storage.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../config/storage.config';
import { GetIdDTO } from 'src/shared/application/dto/get-id.dto';
import type { Response } from 'express';
import { UploadedFileError } from 'src/storage/domain/exception/file-upload.exception';
import { AuthGuard } from 'src/auth/infrastructure/guards/auth.guard';
import { RolesGuard } from 'src/auth/infrastructure/guards/roles.guard';
import { Roles } from 'src/auth/infrastructure/decorators/roles.decorator';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Storage - Endpoints de archivos audio o imagen')
@Controller('storage')
@UseGuards(AuthGuard, RolesGuard)
export class StorageController {
  constructor(private readonly storageService: StorageService) { }

  @Post()
  @Roles('admin')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  @ApiOperation({ summary: 'Sube y registra un archivo al repositorio. * [SOLO ADMINISTRADORES]' })
  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Archivo a subir al sistema',
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo a subir (imágenes, audio, documentos, etc.)'
        }
      },
      required: ['file']
    }
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Archivo subido exitosamente.',
    schema: {
      example: {
        id: 'ID',
        url: 'URL del archivo',
        filename: 'Nombre del archivo',
        createdAt: 'Fecha de creación',

      }
    }
  })
  async createStorage(@UploadedFile() file: Express.Multer.File, @Res() res: Response) {

    if (!file) {
      throw new UploadedFileError();
    }
    const data = await this.storageService.createStorage(file)
    return res.status(HttpStatus.CREATED).json(data);
  }

  @Get()
  @Roles('user', 'admin')
  @ApiOperation({ summary: 'Obtiene todos los archivos subidos al sistema. ' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Archivos obtenidos exitosamente.',
    schema: {
      example: {
        array: {
          id: 'ID',
          url: 'URL del archivo',
          filename: 'Nombre del archivo',
          createdAt: 'Fecha de creación',
        }

      }
    }
  })
  async findAllStorages(@Res() res: Response) {
    const allStorages = await this.storageService.findAllStorages();
    return res.status(HttpStatus.OK).json(allStorages);

  }

  @Get(':id')
  @Roles('user', 'admin')
  @ApiOperation({ summary: 'Obtiene un archivo subido al sistema.' })
  @ApiBearerAuth('JWT-auth') // ✅ Documenta que requiere token JWT
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID único del archivo',
    example: '550e8400-e29b-41d4-a716-446655440000 ó 68c85c4c9b701c7afd9590d0',
    required: true
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Archivo obtenido exitosamente.',
    schema: {
      example: {
        id: 'ID',
        url: 'URL del archivo',
        filename: 'Nombre del archivo',
        createdAt: 'Fecha de creación',
      }
    }
  })
  async findOneStorage(@Param() paramId: GetIdDTO, @Res() res: Response) {
    const foundStorage = await this.storageService.findStorageById(paramId.id);
    return res.status(HttpStatus.OK).json(foundStorage);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Elimina un archivo subido al sistema. * [SOLO ADMINISTRADORES]' })
  @ApiBearerAuth('JWT-auth') 
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID único del archivo',
    example: '550e8400-e29b-41d4-a716-446655440000 ó 68c85c4c9b701c7afd9590d0',
    required: true
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Archivo eliminado exitosamente.',
    schema: {
      example: {
        id: 'ID',
        url: 'URL del archivo',
        filename: 'Nombre del archivo',
        createdAt: 'Fecha de creación',
        deleted: true
      }
    }
  })
  async remove(@Param() paramId: GetIdDTO, @Res() res: Response) {
    const deletedStorage = await this.storageService.removeStorage(paramId.id);
    return res.status(HttpStatus.OK).json(deletedStorage);
  }
}
