import { Module } from "@nestjs/common";
import { SendEmailForRegistrationUseCase } from "../../../commands/email/send-email-for-registration-use-case";
import { SendEmailForPasswordRecoveryUseCase } from "../../../commands/email/send-email-for-password-recovery-use-case";

@Module({
    controllers: [],
    providers: [SendEmailForRegistrationUseCase, SendEmailForPasswordRecoveryUseCase],
})
export class MailModule {}
