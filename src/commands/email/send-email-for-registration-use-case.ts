import * as nodemailer from "nodemailer";
import { ConfigService } from "@nestjs/config";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

export class SendEmailForRegistrationCommand {
    constructor(public readonly email: string, public readonly confirmationCode: string) {}
}

@CommandHandler(SendEmailForRegistrationCommand)
export class SendEmailForRegistrationUseCase implements ICommandHandler<SendEmailForRegistrationCommand> {
    constructor(private configService: ConfigService) {}

    async execute(command: SendEmailForRegistrationCommand) {
        const mailPass = this.configService.get<string>("mailPass");
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "anton.pavlovskiy1990@gmail.com",
                pass: mailPass,
            },
        });
        await transport.sendMail({
            from: "Anton Pavlovskiy",
            to: command.email,
            subject: "Password recovery",
            text: `https://somesite.com/password-recovery?recoveryCode=${command.confirmationCode}`,
        });
        return true;
    }
}
