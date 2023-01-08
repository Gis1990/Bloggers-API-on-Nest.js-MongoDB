import { UsersQueryRepository } from "../../users/users.query.repository";
import { BcryptService } from "../../../utils/bcrypt/bcrypt.service";
import { UserAccountDBClass, UserDevicesDataClass } from "../../users/users.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UsersRepository } from "../../users/users.repository";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

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
        private usersQueryRepository: UsersQueryRepository,
        private usersRepository: UsersRepository,
        private bcryptService: BcryptService,
        @InjectModel(UserDevicesDataClass.name) private userDevicesDataModelClass: Model<UserDevicesDataClass>,
    ) {}

    async execute(command: CheckCredentialsCommand): Promise<UserAccountDBClass | null> {
        const user = await this.usersQueryRepository.findByLoginOrEmail(command.loginOrEmail);
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
            return await this.usersQueryRepository.findUserById(user.id);
        } else {
            return null;
        }
    }
}
