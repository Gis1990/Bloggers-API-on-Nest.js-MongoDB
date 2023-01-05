import { Module } from "@nestjs/common";
import { SendEmailForRegistrationUseCase } from "./use-cases/send-email-for-registration-use-case";
import { SendEmailForPasswordRecoveryUseCase } from "./use-cases/send-email-for-password-recovery-use-case";

@Module({
    controllers: [],
    providers: [SendEmailForRegistrationUseCase, SendEmailForPasswordRecoveryUseCase],
})
export class MailModule {}
