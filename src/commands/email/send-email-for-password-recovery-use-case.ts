import * as nodemailer from "nodemailer";
import { ConfigService } from "@nestjs/config";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

export class SendEmailForPasswordRecoveryCommand {
    constructor(public readonly email: string, public readonly passwordRecoveryCode: string) {}
}

@CommandHandler(SendEmailForPasswordRecoveryCommand)
export class SendEmailForPasswordRecoveryUseCase implements ICommandHandler<SendEmailForPasswordRecoveryCommand> {
    constructor(private configService: ConfigService) {}

    async execute(command: SendEmailForPasswordRecoveryCommand) {
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
            text: `https://somesite.com/password-recovery?recoveryCode=${command.passwordRecoveryCode}`,
        });
        return true;
    }
}
