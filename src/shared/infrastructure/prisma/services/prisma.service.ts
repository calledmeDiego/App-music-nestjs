
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { MongoPrismaService } from './mongo-prisma.service';
import { SqlServerPrismaService } from './sqlserver-prisma.service';

@Injectable()
export class PrismaService {


  constructor(
    @Inject('DATABASE_INSTANCE') public db: MongoPrismaService | SqlServerPrismaService
   ) { 
    
  }  
 
  
}

