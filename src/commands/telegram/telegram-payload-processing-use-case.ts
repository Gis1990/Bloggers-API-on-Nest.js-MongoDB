import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UsersRepository } from "../../repositories/users.repository";
import { UsersQueryRepository } from "../../query-repositories/users.query.repository";

export class TelegramPayloadProcessingCommand {
    constructor(public readonly payload: any) {}
}

@CommandHandler(TelegramPayloadProcessingCommand)
export class TelegramPayloadProcessingUseCase implements ICommandHandler<TelegramPayloadProcessingCommand> {
    constructor(private usersRepository: UsersRepository, private usersQueryRepository: UsersQueryRepository) {}

    async execute(command: TelegramPayloadProcessingCommand): Promise<boolean> {
        let user;
        if (!!command.payload.message) {
            if (command.payload.message.text.split("=")[0] === "/start code") {
                user = await this.usersQueryRepository.getUserByConfirmationCodeForTelegram(
                    command.payload.message.text.split("=")[1],
                );
                await this.usersRepository.addTelegramId(user.id, command.payload.message.from.id);
            }
        }
        return true;
    }
}
