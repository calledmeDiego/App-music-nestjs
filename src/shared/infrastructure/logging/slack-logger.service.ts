import { Injectable } from "@nestjs/common";
import { IncomingWebhook } from "@slack/webhook";
import { EnvService } from "../config/env.service";

@Injectable()
export class SlackLoggerService {
    private webHook: IncomingWebhook;

    constructor(private readonly envService: EnvService) {
        this.webHook = new IncomingWebhook(this.envService.urlSlackWebhook);
    }

    async sendMessage(message: string) {
        try {
            await this.webHook.send({ text: message });
        } catch (err: any) {
            // El dominio ya no existe
            if (err.original?.code === "ENOTFOUND") {
                console.warn('Slack Webhook inválido o expirado')
                return;
            }
            // Slack revocó el webhook
            if (err.original?.response?.status === 410) {
                console.warn("Slack webhook revocado.");
                return;
            }
            // URL incorrecta o borrada (404 Not Found)
            if (err.original?.response?.status === 404) {
                console.warn("Slack webhook no encontrado (404).");
                return;
            }
            console.error('Error enviado a slack: ', err);
        }
    }
}