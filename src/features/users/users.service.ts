import { ObjectId } from "mongodb";
import { Injectable } from "@nestjs/common";
import { UsersRepository } from "./users.repository";
import {
    NewUserClassResponseModel,
    UserAccountDBClass,
    UserAccountEmailClass,
    userDevicesDataClass,
    UserRecoveryCodeClass,
} from "./entities/users.entity";
import { InputModelForCreatingNewUser } from "./dto/users.dto";
import { BcryptService } from "../../utils/bcrypt/bcrypt.service";
import { v4 as uuidv4 } from "uuid";
import { add } from "date-fns";

@Injectable()
export class UsersService {
    constructor(protected usersRepository: UsersRepository, protected bcryptService: BcryptService) {}

    async createUserWithConfirmationEmail(newUser: UserAccountDBClass): Promise<boolean> {
        await this.usersRepository.createUser(newUser);
        return true;
    }

    async createUserWithoutConfirmationEmail(dto: InputModelForCreatingNewUser): Promise<NewUserClassResponseModel> {
        const passwordHash = await this.bcryptService._generateHash(dto.password);
        const emailConfirmation: UserAccountEmailClass = new UserAccountEmailClass(
            [],
            uuidv4(),
            add(new Date(), { hours: 1 }),
            true,
        );
        const emailRecoveryCodeData: UserRecoveryCodeClass = new UserRecoveryCodeClass("", new Date());
        const newUser: UserAccountDBClass = new UserAccountDBClass(
            new ObjectId(),
            Number(new Date()).toString(),
            dto.login,
            dto.email,
            passwordHash,
            new Date().toISOString(),
            emailRecoveryCodeData,
            [],
            emailConfirmation,
            [],
            {},
        );
        const user = await this.usersRepository.createUser(newUser);
        return (({ id, login, email, createdAt }) => ({ id, login, email, createdAt }))(user);
    }

    async deleteUser(userId: string): Promise<boolean> {
        return this.usersRepository.deleteUserById(userId);
    }

    async updateConfirmationCode(id: string): Promise<boolean> {
        return this.usersRepository.updateConfirmationCode(id);
    }

    async addEmailLog(email: string): Promise<boolean> {
        return this.usersRepository.addEmailLog(email);
    }

    async addLoginAttempt(userId: string, ip: string): Promise<boolean> {
        return this.usersRepository.addLoginAttempt(userId, ip);
    }

    async addUserDevicesData(id: string, userDevicesData: userDevicesDataClass): Promise<boolean> {
        return this.usersRepository.addUserDevicesData(id, userDevicesData);
    }

    async addCurrentSession(id: string, userDevicesData: userDevicesDataClass): Promise<boolean> {
        return this.usersRepository.addCurrentSession(id, userDevicesData);
    }

    async updateConfirmation(userId: string): Promise<boolean> {
        return this.usersRepository.updateConfirmation(userId);
    }
}
