import { Injectable } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class TelegramAdapter {
    async sendNotificationForUsers(token: string, blogName: string, recipientId: number) {
        await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
            chat_id: recipientId,
            text: `New post published for blog ${blogName}`,
        });
    }

    async setWebhook(token: string, url: string) {
        await axios.post(`https://api.telegram.org/bot${token}/setWebhook`, {
            url: url,
        });
    }
}
