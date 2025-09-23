import { Injectable } from "@nestjs/common";
import { IncomingWebhook } from "@slack/webhook";

@Injectable()
export class SlackLoggerService {
    private webHook: IncomingWebhook;

    constructor() {
        this.webHook = new IncomingWebhook(<string>process.env.SLACK_WEBHOOK);
    }

    async sendMessage(message: string) {
        try {
            await this.webHook.send({ text: message });
        } catch (err) {
            console.error('Error enviado a slack: ', err);
        }
    }
}