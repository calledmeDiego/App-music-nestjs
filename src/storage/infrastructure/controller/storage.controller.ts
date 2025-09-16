import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Request } from '@nestjs/common';
import { StorageService } from '../../application/use-case/storage.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../config/storage.config';

// import { CreateStorageDto } from './dto/create-storage.dto';
// import { UpdateStorageDto } from './dto/update-storage.dto';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async createStorage(@Body() createStorageDto: any, @UploadedFile() file: Express.Multer.File ) {

    const PUBLIC_URL = process.env.PUBLIC_URL;

    const fileData = {
      url: `${PUBLIC_URL}/${file.filename}`,
      filename: file.filename
    };

    const data = await this.storageService.createStorage(fileData.url, fileData.filename)

    return data;
  }

  @Get()
  findAllStorages() {
    return this.storageService.findAllStorages();
  }

  @Get(':id')
  findOneStorage(@Param('id') id: string) {
    return this.storageService.findStorageById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStorageDto: any) {
    return this.storageService.update(+id, updateStorageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storageService.remove(+id);
  }
}
