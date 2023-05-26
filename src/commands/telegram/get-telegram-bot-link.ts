import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { v4 as uuidv4 } from "uuid";
import { UsersRepository } from "../../repositories/users.repository";

export class GetTelegramBotLinkCommand {
    constructor(public readonly id: string) {}
}

@CommandHandler(GetTelegramBotLinkCommand)
export class GetTelegramBotLinkUseCase implements ICommandHandler<GetTelegramBotLinkCommand> {
    constructor(private usersRepository: UsersRepository) {}

    async execute(command: GetTelegramBotLinkCommand): Promise<{ link: string }> {
        const confirmationCodeForTelegram = uuidv4();
        await this.usersRepository.addConfirmationCodeForTelegram(command.id, confirmationCodeForTelegram);
        return { link: `t.me/ForBloggersMyBlogBot?code=${confirmationCodeForTelegram}` };
    }
}
