import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient as SqlServerPrismaClient } from "../../../../../prisma/sqlserver/generated"

@Injectable()
export class SqlServerPrismaService extends SqlServerPrismaClient implements OnModuleInit, OnModuleDestroy {

    async onModuleInit() {
        await this.$connect()
        console.log('Conectado a SQL Server')
    }

    async onModuleDestroy() {
        await this.$disconnect()
    }

}