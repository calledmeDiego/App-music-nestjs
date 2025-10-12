import { Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";

import { EnvService } from "./env.service";

@Module({
    imports: [
        NestConfigModule.forRoot({
            isGlobal: true,
        })
    ],
    providers: [EnvService],
    exports: [EnvService]
})
export class EnvModule {}