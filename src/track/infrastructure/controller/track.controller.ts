import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards, Res, HttpStatus } from '@nestjs/common';
import { TrackService } from '../../application/use-case/track.service';
import { CreateTrackDTO } from '../../application/dto/create-track.dto';
import { GetIdDTO } from 'src/shared/application/dto/get-id.dto';
import { AuthGuard } from 'src/auth/infrastructure/guards/auth.guard';
import { RolesGuard } from 'src/auth/infrastructure/guards/roles.guard';
import { Roles } from 'src/auth/infrastructure/decorators/roles.decorator';
import type { Response } from 'express';

@Controller('tracks')
@UseGuards(AuthGuard, RolesGuard)
export class TrackController {
  constructor(private readonly trackService: TrackService) { }

  @Post()
  @Roles('admin')
  async postTrack(@Body() body: CreateTrackDTO, @Res() res: Response) {
    const createdTrack = await this.trackService.createTrack(body);
    return res.status(HttpStatus.CREATED).json(createdTrack);
  }

  @Get('')
  @Roles('user', 'admin')
  async findAllTracks(@Res() res: Response) {
    const foundTracks = await this.trackService.listTracks();
    return res.status(HttpStatus.OK).json(foundTracks);
  }

  @Get('/:id')
  @Roles('user', 'admin')
  async findOneTrack(@Param() paramId: GetIdDTO, @Res() res: Response) {
    const foundTrack = await this.trackService.getTrack(paramId.id);
    return res.status(HttpStatus.OK).json(foundTrack);
  }

  @Put('/:id')
  @Roles('admin')
  async updateTrack(@Param() paramId: GetIdDTO, @Body() body: CreateTrackDTO, @Res() res: Response) {
    const updatedTrack = await this.trackService.updateTrack(paramId.id, body);
    return res.status(HttpStatus.OK).json(updatedTrack);
  }

  @Patch(':id')
  update1(@Param('id') id: string, @Body() updateTrackDto: any) {
    // return this.trackService.update(+id, updateTrackDto);
  }

  @Delete('/:id')
  @Roles('admin')
  async remove(@Param() paramId: GetIdDTO, @Res() res: Response) {
    const deletedTrack = await this.trackService.deleteTrack(paramId.id);
    return  res.status(HttpStatus.OK).json(deletedTrack);
  }

  
}
