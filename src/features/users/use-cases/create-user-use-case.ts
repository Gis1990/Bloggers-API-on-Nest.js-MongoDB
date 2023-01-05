import { Injectable } from "@nestjs/common";
import { InputModelForCreatingNewUser } from "../dto/users.dto";
import { EmailRecoveryCodeClass, UserAccountEmailClass } from "../users.schema";
import { NewUserClassResponseModel } from "../entities/users.entity";
import { UsersRepository } from "../users.repository";

@Injectable()
export class CreateUserUseCase {
    constructor(private usersRepository: UsersRepository) {}

    async execute(
        dto: InputModelForCreatingNewUser,
        passwordHash: string,
        emailConfirmation: UserAccountEmailClass,
        emailRecoveryCodeData: EmailRecoveryCodeClass,
    ): Promise<NewUserClassResponseModel> {
        const createdNewUserDto = {
            id: Number(new Date()).toString(),
            login: dto.login,
            email: dto.email,
            passwordHash: passwordHash,
            createdAt: new Date().toISOString(),
            emailRecoveryCode: emailRecoveryCodeData,
            loginAttempts: [],
            emailConfirmation: emailConfirmation,
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
