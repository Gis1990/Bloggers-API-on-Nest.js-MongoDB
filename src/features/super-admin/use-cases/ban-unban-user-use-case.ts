import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UsersRepository } from "../../users/users.repository";

export class BanUnbanUserCommand {
    constructor(public isBanned: boolean, public banReason: string, public userId: string) {}
}

@CommandHandler(BanUnbanUserCommand)
export class BanUnbanUserUseCase implements ICommandHandler<BanUnbanUserCommand> {
    constructor(private usersRepository: UsersRepository) {}

    async execute(command: BanUnbanUserCommand): Promise<boolean> {
        return this.usersRepository.banUnbanUser(command.isBanned, command.banReason, command.userId);
    }
}
