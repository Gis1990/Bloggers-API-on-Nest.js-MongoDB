import { UserDevicesDataClass } from "../../users/users.schema";
import { CurrentUserWithDevicesDataModel } from "../../auth/dto/auth.dto";
import { UsersQueryRepository } from "../../users/users.query.repository";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

export class ReturnAllDevicesCommand {
    constructor(public readonly userWithDeviceData: CurrentUserWithDevicesDataModel) {}
}

@CommandHandler(ReturnAllDevicesCommand)
export class ReturnAllDevicesUseCase implements ICommandHandler<ReturnAllDevicesCommand> {
    constructor(private usersQueryRepository: UsersQueryRepository) {}

    async execute(command: ReturnAllDevicesCommand): Promise<UserDevicesDataClass[] | null> {
        const user = await this.usersQueryRepository.getUserById(command.userWithDeviceData.id);
        if (user) {
            return user.userDevicesData;
        } else {
            return null;
        }
    }
}
