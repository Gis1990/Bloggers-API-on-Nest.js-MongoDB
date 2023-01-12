import { UserDevicesDataClass } from "../../super-admin/users/users.schema";
import { CurrentUserWithDevicesDataModel } from "../../auth/dto/auth.dto";
import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { GetUserByIdCommand } from "../../super-admin/users/use-cases/queries/get-user-by-id-query";

export class ReturnAllDevicesCommand {
    constructor(public userWithDeviceData: CurrentUserWithDevicesDataModel) {}
}

@CommandHandler(ReturnAllDevicesCommand)
export class ReturnAllDevicesUseCase implements ICommandHandler<ReturnAllDevicesCommand> {
    constructor(private queryBus: QueryBus) {}

    async execute(command: ReturnAllDevicesCommand): Promise<UserDevicesDataClass[] | null> {
        const user = await this.queryBus.execute(new GetUserByIdCommand(command.userWithDeviceData.id));
        if (user) {
            return user.userDevicesData;
        } else {
            return null;
        }
    }
}
