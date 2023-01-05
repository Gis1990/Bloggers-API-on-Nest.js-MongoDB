import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SendEmailForRegistrationUseCase {
    constructor(private configService: ConfigService) {}

    async execute(email: string, confirmationCode: string) {
        const mailPass = this.configService.get<string>("mailPass");
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "anton.pavlovskiy1990@gmail.com",
                pass: mailPass,
            },
        });
        const info = await transport.sendMail({
            from: "Anton Pavlovskiy",
            to: email,
            subject: "email confirmation",
            text: `https://somesite.com/confirm-email?code=${confirmationCode}`,
        });
        return true;
    }
}
