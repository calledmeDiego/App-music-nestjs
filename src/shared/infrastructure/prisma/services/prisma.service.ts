
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { MongoPrismaService } from './mongo-prisma.service';
import { SqlServerPrismaService } from './sqlserver-prisma.service';

@Injectable()
export class PrismaService {

  db: MongoPrismaService | SqlServerPrismaService;

  constructor( ) { 
    const provider = <string>process.env.DB_PROVIDER;

    if (provider === 'mongo') {
      this.db = new MongoPrismaService();
    } else{
      this.db = new SqlServerPrismaService();
    }
  }  
  get mongo() {
    return this.db as MongoPrismaService;
  }

  get sql() {
    return this.db as SqlServerPrismaService;
  }
  
}

