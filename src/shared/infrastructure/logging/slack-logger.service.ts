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
        } catch (err) {
            console.error('Error enviado a slack: ', err);
        }
    }
}