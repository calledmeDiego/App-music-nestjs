import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { FileSystemPort } from '../../domain/repository/file-system.repository';

@Injectable()
export class FileSystemService implements FileSystemPort {
  private readonly storagePath = path.join(process.cwd(), 'storage');

  async deleteFile(filename: string): Promise<void> {
    const filePath = path.join(this.storagePath, filename);
    await fs.promises.unlink(filePath);
  }
}