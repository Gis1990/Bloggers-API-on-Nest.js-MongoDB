import { Injectable } from "@nestjs/common";
import { UsersRepository } from "./users.repository";
import { InputModelForCreatingNewUser } from "./dto/users.dto";
import { BcryptService } from "../../utils/bcrypt/bcrypt.service";
import { UserAccountEmailClass, UserDevicesDataClass, EmailRecoveryCodeClass } from "./users.schema";
import { NewUserClassResponseModel } from "./entities/users.entity";

@Injectable()
export class UsersService {
    constructor(protected usersRepository: UsersRepository, protected bcryptService: BcryptService) {}

    async createUser(
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

    async deleteUser(userId: string): Promise<boolean> {
        return this.usersRepository.deleteUserById(userId);
    }

    async addPasswordRecoveryCode(userId: string, passwordRecoveryData: EmailRecoveryCodeClass): Promise<boolean> {
        return this.usersRepository.addPasswordRecoveryCode(userId, passwordRecoveryData);
    }

    async updateConfirmationCode(id: string): Promise<boolean> {
        return this.usersRepository.updateConfirmationCode(id);
    }

    async updateLastActiveDate(deviceId: string, newLastActiveDate: Date): Promise<boolean> {
        return this.usersRepository.updateLastActiveDate(deviceId, newLastActiveDate);
    }

    async terminateSpecificDevice(id: string, deviceId: string): Promise<boolean> {
        return this.usersRepository.terminateSpecificDevice(id, deviceId);
    }

    async updatePasswordHash(id: string, passwordHash: string): Promise<boolean> {
        return this.usersRepository.updatePasswordHash(id, passwordHash);
    }

    async addEmailLog(email: string): Promise<boolean> {
        return this.usersRepository.addEmailLog(email);
    }

    async addLoginAttempt(userId: string, ip: string): Promise<boolean> {
        return this.usersRepository.addLoginAttempt(userId, ip);
    }

    async addUserDevicesData(id: string, userDevicesData: UserDevicesDataClass): Promise<boolean> {
        return this.usersRepository.addUserDevicesData(id, userDevicesData);
    }

    async addCurrentSession(id: string, userDevicesData: UserDevicesDataClass): Promise<boolean> {
        return this.usersRepository.addCurrentSession(id, userDevicesData);
    }

    async updateConfirmation(userId: string): Promise<boolean> {
        return this.usersRepository.updateConfirmation(userId);
    }
}
