import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Request, Put, HttpStatus, Res } from '@nestjs/common';
import { StorageService } from '../../application/use-case/storage.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../config/storage.config';
import { GetIdDTO } from 'src/shared/application/dto/get-id.dto';
import type { Response } from 'express';
import { UploadedFileError } from 'src/storage/domain/exception/file-upload.exception';


@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async createStorage(@UploadedFile() file: Express.Multer.File, @Res() res: Response) {

    if (!file) {
        throw new UploadedFileError();
    }
    
    const PUBLIC_URL = process.env.PUBLIC_URL;
    const fileData = {
      url: `${PUBLIC_URL}/${file.filename}`,
      filename: file.filename
    };

    const data = await this.storageService.createStorage({ url: fileData.url, filename: fileData.filename })
    return res.status(HttpStatus.CREATED).json(data);
  }

  @Get()
  findAllStorages(@Res() res: Response) {
    const allStorages = this.storageService.findAllStorages();
    return res.status(HttpStatus.OK).json(allStorages);

  }

  @Get(':id')
  findOneStorage(@Param() paramId: GetIdDTO, @Res() res: Response) {
    const foundStorage = this.storageService.findStorageById(paramId.id);
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
  remove(@Param() paramId: GetIdDTO, @Res() res: Response) {
    const deletedStorage = this.storageService.removeStorage(paramId.id);
    return res.status(HttpStatus.OK).json(deletedStorage);
  }
}
