import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SendEmailForPasswordRecoveryUseCase {
    constructor(private configService: ConfigService) {}

    async execute(email: string, passwordRecoveryCode: string) {
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
            subject: "Password recovery",
            text: `https://somesite.com/password-recovery?recoveryCode=${passwordRecoveryCode}`,
        });
        return true;
    }
}
