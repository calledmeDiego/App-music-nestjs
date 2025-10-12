// src/shared/infrastructure/prisma/prisma.module.ts

import { Module, Global } from '@nestjs/common';


import { MongoPrismaService } from '../services/mongo-prisma.service';
import { SqlServerPrismaService } from '../services/sqlserver-prisma.service';
import { PrismaService } from '../services/prisma.service';
import { EnvModule } from '../../config/env.module';
import { EnvService } from '../../config/env.service';


// Este módulo implementa un patrón de base de datos condicional que permite cambiar entre MongoDB y SQL Server dinámicamente basado en variables de entorno.
@Global() // Hacemos que sea accesible globalmente (opcional)
@Module({
    imports: [EnvModule],
    providers: [       
        // 3. PROVEEDOR DE VALOR CONDICIONAL (El que toma la decisión)
        {
            provide: 'DATABASE_INSTANCE',
            // Usamos useFactory para la lógica de decisión, ¡pero solo dentro de este módulo!
            useFactory: async (envService: EnvService) => {
                const dbProvider = envService.dbProvider.trim();

                if (dbProvider === 'mongo') {
                    const mongoService = new MongoPrismaService();
                    await mongoService.onModuleInit();
                    return mongoService;
                } else {
                    const sqlService = new SqlServerPrismaService();
                    await sqlService.onModuleInit();
                    return sqlService;
                }
            },
            inject: [EnvService],
        },

    ],
    exports: ['DATABASE_INSTANCE'],
})
export class DatabaseModule { }