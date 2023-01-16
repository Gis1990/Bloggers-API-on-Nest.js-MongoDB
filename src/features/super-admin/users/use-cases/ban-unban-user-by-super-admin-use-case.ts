import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UsersRepository } from "../users.repository";

export class BanUnbanUserBySuperAdminCommand {
    constructor(public readonly isBanned: boolean, public readonly banReason: string, public readonly userId: string) {}
}

@CommandHandler(BanUnbanUserBySuperAdminCommand)
export class BanUnbanUserBySuperAdminUseCase implements ICommandHandler<BanUnbanUserBySuperAdminCommand> {
    constructor(private usersRepository: UsersRepository) {}

    async execute(command: BanUnbanUserBySuperAdminCommand): Promise<boolean> {
        return this.usersRepository.banUnbanUserBySuperAdmin(command.isBanned, command.banReason, command.userId);
    }
}
