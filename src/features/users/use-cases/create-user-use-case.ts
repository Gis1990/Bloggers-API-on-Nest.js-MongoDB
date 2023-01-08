import { InputModelForCreatingNewUser } from "../dto/users.dto";
import { EmailRecoveryCodeClass, UserAccountEmailClass } from "../users.schema";
import { NewUserClassResponseModel } from "../entities/users.entity";
import { UsersRepository } from "../users.repository";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

export class CreateUserCommand {
    constructor(
        public readonly dto: InputModelForCreatingNewUser,
        public readonly passwordHash: string,
        public readonly emailConfirmation: UserAccountEmailClass,
        public readonly emailRecoveryCodeData: EmailRecoveryCodeClass,
    ) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
    constructor(private usersRepository: UsersRepository) {}

    async execute(command: CreateUserCommand): Promise<NewUserClassResponseModel> {
        const createdNewUserDto = {
            id: Number(new Date()).toString(),
            login: command.dto.login,
            email: command.dto.email,
            passwordHash: command.passwordHash,
            createdAt: new Date().toISOString(),
            emailRecoveryCode: command.emailRecoveryCodeData,
            loginAttempts: [],
            emailConfirmation: command.emailConfirmation,
            userDevicesData: [],
            currentSession: {
                ip: "ip",
                lastActiveDate: new Date(),
                title: "title",
                deviceId: "deviceId",
            },
        };
        return await this.usersRepository.createUser(createdNewUserDto);
    }
}
