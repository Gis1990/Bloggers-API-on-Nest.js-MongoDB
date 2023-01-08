import { CurrentUserWithDevicesDataModel } from "../../auth/dto/auth.dto";
import { UsersQueryRepository } from "../../users/users.query.repository";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

export class CheckAccessRightsCommand {
    constructor(
        public readonly userWithDeviceData: CurrentUserWithDevicesDataModel,
        public readonly deviceId: string,
    ) {}
}

@CommandHandler(CheckAccessRightsCommand)
export class CheckAccessRightsUseCase implements ICommandHandler<CheckAccessRightsCommand> {
    constructor(private usersQueryRepository: UsersQueryRepository) {}

    async execute(command: CheckAccessRightsCommand): Promise<boolean> {
        const userByDeviceId = await this.usersQueryRepository.findUserByDeviceId(command.deviceId);
        if (userByDeviceId) {
            return command.userWithDeviceData.id === userByDeviceId.id;
        } else {
            return false;
        }
    }
}
