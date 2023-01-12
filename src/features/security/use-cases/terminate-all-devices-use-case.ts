import { CurrentUserWithDevicesDataModel } from "../../auth/dto/auth.dto";
import { UsersRepository } from "../../super-admin/users/users.repository";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

export class TerminateAllDevicesCommand {
    constructor(public readonly userWithDeviceData: CurrentUserWithDevicesDataModel) {}
}

@CommandHandler(TerminateAllDevicesCommand)
export class TerminateAllDevicesUseCase implements ICommandHandler<TerminateAllDevicesCommand> {
    constructor(private usersRepository: UsersRepository) {}

    async execute(command: TerminateAllDevicesCommand): Promise<boolean> {
        return await this.usersRepository.terminateAllDevices(
            command.userWithDeviceData.id,
            command.userWithDeviceData.currentSession,
        );
    }
}
