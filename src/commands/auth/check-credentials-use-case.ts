import { BcryptService } from "../../modules/utils/bcrypt/bcrypt.service";
import { UserAccountClass, UserDevicesDataClass } from "../../schemas/users.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UsersRepository } from "../../repositories/users.repository";
import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { GetUserByIdCommand } from "../../queries/users/get-user-by-id-query";
import { GetUserByLoginOrEmailCommand } from "../../queries/users/get-user-by-login-or-email-query";

export class CheckCredentialsCommand {
    constructor(
        public readonly loginOrEmail: string,
        public readonly password: string,
        public readonly ip: string,
        public readonly title: string | undefined,
    ) {}
}

@CommandHandler(CheckCredentialsCommand)
export class CheckCredentialsUseCase implements ICommandHandler<CheckCredentialsCommand> {
    constructor(
        private queryBus: QueryBus,
        private usersRepository: UsersRepository,
        private bcryptService: BcryptService,
        @InjectModel(UserDevicesDataClass.name) private userDevicesDataModelClass: Model<UserDevicesDataClass>,
    ) {}

    async execute(command: CheckCredentialsCommand): Promise<UserAccountClass | null> {
        const user = await this.queryBus.execute(new GetUserByLoginOrEmailCommand(command.loginOrEmail));
        if (!user) return null;
        await this.usersRepository.addLoginAttempt(user.id, command.ip);
        const isHashesEqual = await this.bcryptService._isHashesEquals(command.password, user.passwordHash);
        if (isHashesEqual && user.emailConfirmation.isConfirmed) {
            const createdUserDevicesData = {
                ip: command.ip,
                lastActiveDate: new Date(),
                title: command.title,
                deviceId: Number(new Date()).toString(),
            };
            const userDevicesData: UserDevicesDataClass = new this.userDevicesDataModelClass(createdUserDevicesData);
            await this.usersRepository.addUserDevicesData(user.id, userDevicesData);
            await this.usersRepository.addCurrentSession(user.id, userDevicesData);
            return await this.queryBus.execute(new GetUserByIdCommand(user.id));
        } else {
            return null;
        }
    }
}
