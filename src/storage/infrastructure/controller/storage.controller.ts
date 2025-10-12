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


@Controller('storage')
@UseGuards(AuthGuard, RolesGuard)
export class StorageController {
  constructor(private readonly storageService: StorageService) { }

  @Post()
  @Roles('admin')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async createStorage(@UploadedFile() file: Express.Multer.File, @Res() res: Response) {

    if (!file) {
      throw new UploadedFileError();
    }
    const data = await this.storageService.createStorage(file)
    return res.status(HttpStatus.CREATED).json(data);
  }

  @Get()
  @Roles('user','admin')
  async findAllStorages(@Res() res: Response) {
    const allStorages = await this.storageService.findAllStorages();
    return res.status(HttpStatus.OK).json(allStorages);

  }

  @Get(':id')
  @Roles('user','admin')
  async findOneStorage(@Param() paramId: GetIdDTO, @Res() res: Response) {
    const foundStorage = await this.storageService.findStorageById(paramId.id);
    return res.status(HttpStatus.OK).json(foundStorage);

  }

  @Put('/:id')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  updateStorage(@Param() id: GetIdDTO, @UploadedFile() file: Express.Multer.File) {
    // return this.storageService.update(+id, updateStorageDto);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStorageDto: any) {
    // return this.storageService.update(+id, updateStorageDto);
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param() paramId: GetIdDTO, @Res() res: Response) {
    const deletedStorage = await this.storageService.removeStorage(paramId.id);
    return res.status(HttpStatus.OK).json(deletedStorage);
  }
}
