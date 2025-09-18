import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Request, Put } from '@nestjs/common';
import { StorageService } from '../../application/use-case/storage.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../config/storage.config';
import { GetIdDTO } from 'src/shared/dto/get-id.dto';

// import { CreateStorageDto } from './dto/create-storage.dto';
// import { UpdateStorageDto } from './dto/update-storage.dto';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async createStorage(@UploadedFile() file: Express.Multer.File ) {
    const PUBLIC_URL = process.env.PUBLIC_URL;
    const fileData = {
      url: `${PUBLIC_URL}/${file.filename}`,
      filename: file.filename
    };

    const data = await this.storageService.createStorage({ url: fileData.url, filename: fileData.filename})

    return data;
  }

  @Get()
  findAllStorages() {
    return this.storageService.findAllStorages();
  }

  @Get(':id')
  findOneStorage(@Param() paramId: GetIdDTO) {
    return this.storageService.findStorageById(paramId.id);
  }

  @Put('/:id')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  updateStorage(@Param() id: GetIdDTO, @UploadedFile() file: Express.Multer.File ) {
    // return this.storageService.update(+id, updateStorageDto);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStorageDto: any) {
    // return this.storageService.update(+id, updateStorageDto);
  }

  @Delete(':id')
  remove(@Param() paramId: GetIdDTO) {
    return this.storageService.removeStorage(paramId.id);
  }
}
