import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UsersRepository } from "../../repositories/users.repository";

export class BanUnbanUserBySuperAdminCommand {
    constructor(public readonly isBanned: boolean, public readonly banReason: string, public readonly userId: string) {}
}

@CommandHandler(BanUnbanUserBySuperAdminCommand)
export class BanUnbanUserBySuperAdminUseCase implements ICommandHandler<BanUnbanUserBySuperAdminCommand> {
    constructor(private usersRepository: UsersRepository) {}

    async execute(command: BanUnbanUserBySuperAdminCommand): Promise<boolean> {
        const banData = {
            isBanned: command.isBanned,
            banDate: new Date(),
            banReason: command.banReason,
            userId: command.userId,
        };
        if (!command.isBanned) {
            banData.banDate = null;
            banData.banReason = null;
        }
        return this.usersRepository.banUnbanUserBySuperAdmin(banData, command.userId);
    }
}
