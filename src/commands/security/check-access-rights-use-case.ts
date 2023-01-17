import { CurrentUserWithDevicesDataModel } from "../../dtos/auth.dto";
import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { GetUserByDeviceIdCommand } from "../../queries/users/get-user-by-device-id-query";

export class CheckAccessRightsCommand {
    constructor(
        public readonly userWithDeviceData: CurrentUserWithDevicesDataModel,
        public readonly deviceId: string,
    ) {}
}

@CommandHandler(CheckAccessRightsCommand)
export class CheckAccessRightsUseCase implements ICommandHandler<CheckAccessRightsCommand> {
    constructor(private queryBus: QueryBus) {}

    async execute(command: CheckAccessRightsCommand): Promise<boolean> {
        const userByDeviceId = await this.queryBus.execute(new GetUserByDeviceIdCommand(command.deviceId));
        if (userByDeviceId) {
            return command.userWithDeviceData.id === userByDeviceId.id;
        } else {
            return false;
        }
    }
}
