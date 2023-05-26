import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CqrsModule } from "@nestjs/cqrs";
import { IntegrationsController } from "./integrations.controller";
import { BlogClass, BlogsSchema } from "../../schemas/blogs.schema";
import {
    EmailRecoveryCodeClass,
    EmailRecoveryCodeSchema,
    LoginAttemptsClass,
    LoginAttemptsSchema,
    UserAccountClass,
    UserAccountEmailClass,
    UserAccountEmailSchema,
    UserDevicesDataClass,
    UserDevicesDataSchema,
    UsersAccountSchema,
} from "../../schemas/users.schema";
import { GetTelegramBotLinkUseCase } from "../../commands/telegram/get-telegram-bot-link";
import { UsersRepository } from "../../repositories/users.repository";
import { TelegramPayloadProcessingUseCase } from "../../commands/telegram/telegram-payload-processing-use-case";
import { UsersQueryRepository } from "../../query-repositories/users.query.repository";

const useCases = [GetTelegramBotLinkUseCase, TelegramPayloadProcessingUseCase];

@Module({
    imports: [
        CqrsModule,
        MongooseModule.forFeature([
            {
                name: BlogClass.name,
                schema: BlogsSchema,
            },
            {
                name: UserAccountClass.name,
                schema: UsersAccountSchema,
            },
            {
                name: UserAccountEmailClass.name,
                schema: UserAccountEmailSchema,
            },
            {
                name: UserDevicesDataClass.name,
                schema: UserDevicesDataSchema,
            },
            {
                name: EmailRecoveryCodeClass.name,
                schema: EmailRecoveryCodeSchema,
            },
            {
                name: LoginAttemptsClass.name,
                schema: LoginAttemptsSchema,
            },
        ]),
    ],
    controllers: [IntegrationsController],
    providers: [UsersRepository, UsersQueryRepository, ...useCases],
})
export class IntegrationsModule {}
