import { Injectable } from "@nestjs/common";

@Injectable()
export class EnvService { 

    readonly port = process.env.PORT || 3000 ;
    readonly dbProvider = <string>process.env.DB_PROVIDER || 'mongo';
    readonly mongoUrl = <string>process.env.MONGODB_URL;
    readonly sqlServerUrl = <string>process.env.SQLSERVER_URL;
    readonly publicUrl = <string>process.env.PUBLIC_URL;
    readonly jwtSecret = <string>process.env.JWT_SECRET || 'changeme';
    readonly urlSlackWebhook = <string>process.env.SLACK_WEBHOOK;
    
}