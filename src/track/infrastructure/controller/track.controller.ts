import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { TrackService } from '../../application/use-case/track.service';
import { TrackEntity } from 'src/track/domain/entities/track.entity';
import { CreateTrackDTO } from '../../application/dto/create-track.dto';
import { GetTrackDTO } from 'src/track/application/dto/get-track.dto';

@Controller('tracks')
export class TrackController {
  constructor(private readonly trackService: TrackService) { }

  @Post()
  postTrack(@Body() body: CreateTrackDTO) {
    // console.log(body)
    return this.trackService.createTrack(body);
  }

  @Get('')
  findAllTracks() {
    return this.trackService.listTracks();
  }

  @Get('/:id')
  findOneTrack(@Param() paramId: GetTrackDTO) {
    return this.trackService.getTrack(paramId);
  }

  @Put('/:id')
  updateTrack(@Param() id: GetTrackDTO, @Body() body: CreateTrackDTO) {
    return this.trackService.updateTrack(id, body);
    // return this.trackService.update(+id, updateTrackDto);
  }

  @Patch(':id')
  update1(@Param('id') id: string, @Body() updateTrackDto: any) {
    // return this.trackService.update(+id, updateTrackDto);
  }

  @Delete('/:id')
  remove(@Param() id: GetTrackDTO) {
    return this.trackService.deleteTrack(id);
  }
}
