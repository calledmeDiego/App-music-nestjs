import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { TrackService } from '../../application/use-case/track.service';
import { CreateTrackDTO } from '../../application/dto/create-track.dto';
import { GetIdDTO } from 'src/shared/application/dto/get-id.dto';
import { AuthGuard } from 'src/auth/infrastructure/guards/auth.guard';
import { RolesGuard } from 'src/auth/infrastructure/guards/roles.guard';
import { Roles } from 'src/auth/infrastructure/decorators/roles.decorator';

@Controller('tracks')
@UseGuards(AuthGuard, RolesGuard)
export class TrackController {
  constructor(private readonly trackService: TrackService) { }

  @Post()
  @Roles('admin')
  postTrack(@Body() body: CreateTrackDTO) {

    return this.trackService.createTrack(body);
  }

  @Get('')
  @Roles('user', 'admin')
  findAllTracks() {
    
    return this.trackService.listTracks();
  }

  @Get('/:id')
  @Roles('user', 'admin')
  findOneTrack(@Param() paramId: GetIdDTO) {
    return this.trackService.getTrack(paramId.id);
  }

  @Put('/:id')
  @Roles('admin')
  updateTrack(@Param() paramId: GetIdDTO, @Body() body: CreateTrackDTO) {
    return this.trackService.updateTrack(paramId.id, body);
    // return this.trackService.update(+id, updateTrackDto);
  }

  @Patch(':id')
  update1(@Param('id') id: string, @Body() updateTrackDto: any) {
    // return this.trackService.update(+id, updateTrackDto);
  }

  @Delete('/:id')
  @Roles('admin')
  remove(@Param() paramId: GetIdDTO) {
    return this.trackService.deleteTrack(paramId.id);
  }
}
