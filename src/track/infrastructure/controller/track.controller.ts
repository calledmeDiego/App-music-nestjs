import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards, Res, HttpStatus } from '@nestjs/common';
import { TrackService } from '../../application/use-case/track.service';
import { CreateTrackDTO } from '../../application/dto/create-track.dto';
import { GetIdDTO } from 'src/shared/application/dto/get-id.dto';
import { AuthGuard } from 'src/auth/infrastructure/guards/auth.guard';
import { RolesGuard } from 'src/auth/infrastructure/guards/roles.guard';
import { Roles } from 'src/auth/infrastructure/decorators/roles.decorator';
import type { Response } from 'express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Tracks - Endpoints de pistas de música')
@Controller('tracks')
@UseGuards(AuthGuard, RolesGuard)
export class TrackController {
  constructor(private readonly trackService: TrackService) { }

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Sube y registra un archivo al repositorio. * [SOLO ADMINISTRADORES]' })
  @ApiBearerAuth('JWT-auth')
  @ApiBody({
    type: CreateTrackDTO,
    description: 'Estructura del JSON para crear una nueva canción'
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Canción creada exitosamente.',
    schema: {
      example: {
        id: 'ID',
        name: 'In Bloom',
        album: 'Nevermind',
        media: {
          id: 'ID',
          url: 'URL del archivo',
          filename: 'Nombre del archivo',
          createdAt: 'Fecha de creación',
        },
        cover: 'https://example.com/cover.jpg',
        artist: {
          name: 'Nirvana',
          nickname: 'Nirvana',
          nationality: 'Estadounidense'
        },
        duration: {
          start: 0,
          end: 180
        },
        createdAt: '2023-10-13T20:00:00.000Z'
      }
    }
  })
  async postTrack(@Body() body: CreateTrackDTO, @Res() res: Response) {
    const createdTrack = await this.trackService.createTrack(body);
    return res.status(HttpStatus.CREATED).json(createdTrack);
  }

  @Get('')
  @Roles('user', 'admin')
  @ApiOperation({ summary: 'Obtiene todas las canciones subidas al sistema.' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Canciones obtenidos exitosamente.',
    schema: {
      example: {
        array: {
          id: 'ID',
          name: 'In Bloom',
          album: 'Nevermind',
          media: {
            id: 'ID',
            url: 'URL del archivo',
            filename: 'Nombre del archivo',
            createdAt: 'Fecha de creación',
          },
          cover: 'https://example.com/cover.jpg',
          artist: {
            name: 'Nirvana',
            nickname: 'Nirvana',
            nationality: 'Estadounidense'
          },
          duration: {
            start: 0,
            end: 180
          },
          createdAt: '2023-10-13T20:00:00.000Z'
        }
      }
    }
  })
  async findAllTracks(@Res() res: Response) {
    const foundTracks = await this.trackService.listTracks();
    return res.status(HttpStatus.OK).json(foundTracks);
  }

  @Get('/:id')
  @Roles('user', 'admin')
  @ApiOperation({ summary: 'Obtiene una canción subida al sistema.' })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID único del archivo',
    example: 'ID',
    required: true
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Canción obtenida exitosamente.',
    schema: {
      example: {
        id: 'ID',
        name: 'In Bloom',
        album: 'Nevermind',
        media: {
          id: 'ID',
          url: 'URL del archivo',
          filename: 'Nombre del archivo',
          createdAt: 'Fecha de creación',
        },
        cover: 'https://example.com/cover.jpg',
        artist: {
          name: 'Nirvana',
          nickname: 'Nirvana',
          nationality: 'Estadounidense'
        },
        duration: {
          start: 0,
          end: 180
        },
        createdAt: '2023-10-13T20:00:00.000Z'
      }
    }
  })
  async findOneTrack(@Param() paramId: GetIdDTO, @Res() res: Response) {
    const foundTrack = await this.trackService.getTrack(paramId.id);
    return res.status(HttpStatus.OK).json(foundTrack);
  }

  @Put('/:id')
  @Roles('admin')
  @ApiOperation({ summary: 'Obtiene y actualiza una canción subida al sistema. * [SOLO ADMINISTRADORES]' })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID único del archivo',
    example: 'ID',
    required: true
  })
  @ApiBody({
    type: CreateTrackDTO,
    description: 'Estructura del JSON para editar la canción'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Canción editada exitosamente.',
    schema: {
      example: {
        id: 'ID',
        name: 'In Bloom',
        album: 'Nevermind',
        media: {
          id: 'ID',
          url: 'URL del archivo',
          filename: 'Nombre del archivo',
          createdAt: 'Fecha de creación',
        },
        cover: 'https://example.com/cover.jpg',
        artist: {
          name: 'Nirvana',
          nickname: 'Nirvana',
          nationality: 'Estadounidense'
        },
        duration: {
          start: 0,
          end: 180
        },
        createdAt: '2023-10-13T20:00:00.000Z'
      }
    }
  })
  async updateTrack(@Param() paramId: GetIdDTO, @Body() body: CreateTrackDTO, @Res() res: Response) {
    const updatedTrack = await this.trackService.updateTrack(paramId.id, body);
    return res.status(HttpStatus.OK).json(updatedTrack);
  }

  @Delete('/:id')
  @Roles('admin')
  @ApiOperation({ summary: 'Elimina una canción subida al sistema de forma parcial. * [SOLO ADMINISTRADORES]' })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID único del archivo',
    example: 'ID',
    required: true
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Canción eliminada exitosamente.',
    schema: {
      example: {
        deletedTrack: true
      }
    }
  })
  async remove(@Param() paramId: GetIdDTO, @Res() res: Response) {
    const deletedTrack = await this.trackService.deleteTrack(paramId.id);
    return res.status(HttpStatus.OK).json(deletedTrack);
  }


}
