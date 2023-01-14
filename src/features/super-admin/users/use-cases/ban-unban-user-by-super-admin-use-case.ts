import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UsersRepository } from "../users.repository";

export class BanUnbanUserBySuperAdminCommand {
    constructor(public isBanned: boolean, public banReason: string, public userId: string) {}
}

@CommandHandler(BanUnbanUserBySuperAdminCommand)
export class BanUnbanUserBySuperAdminUseCase implements ICommandHandler<BanUnbanUserBySuperAdminCommand> {
    constructor(private usersRepository: UsersRepository) {}

    async execute(command: BanUnbanUserBySuperAdminCommand): Promise<boolean> {
        return this.usersRepository.banUnbanUserBySuperAdmin(command.isBanned, command.banReason, command.userId);
    }
}
