import { ObjectId } from "mongodb";
import { Injectable } from "@nestjs/common";
import { UsersRepository } from "./users.repository";
import {
    NewUserClassResponseModel,
    UserAccountDBClass,
    UserAccountEmailClass,
    UserDBClassPagination,
} from "./users.model";
import { InputModelForCreatingNewUser, ModelForGettingAllUsers } from "./dto/users.dto";
import { BcryptService } from "../../utils/bcrypt/bcrypt.service";
import * as fns from "date-fns";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class UsersService {
    constructor(protected usersRepository: UsersRepository, protected bcryptService: BcryptService) {}
    async getAllUsers(dto: ModelForGettingAllUsers): Promise<UserDBClassPagination> {
        return this.usersRepository.getAllUsers(dto);
    }
    async createUserWithConfirmationEmail(newUser: UserAccountDBClass): Promise<boolean> {
        await this.usersRepository.createUser(newUser);
        return true;
    }
    async createUserWithoutConfirmationEmail(dto: InputModelForCreatingNewUser): Promise<NewUserClassResponseModel> {
        const passwordHash = await this.bcryptService._generateHash(dto.password);
        const emailConfirmation: UserAccountEmailClass = new UserAccountEmailClass(
            [],
            uuidv4(),
            fns.add(new Date(), { hours: 1 }),
            true,
        );
        const newUser: UserAccountDBClass = new UserAccountDBClass(
            new ObjectId(),
            Number(new Date()).toString(),
            dto.login,
            dto.email,
            passwordHash,
            new Date().toISOString(),
            [],
            emailConfirmation,
            [],
        );
        const user = await this.usersRepository.createUser(newUser);
        return (({ id, login }) => ({ id, login }))(user);
    }
    async findUserById(id: string): Promise<UserAccountDBClass | null> {
        return this.usersRepository.findUserById(id);
    }
    async findUserByConfirmationCode(code: string): Promise<UserAccountDBClass | null> {
        return this.usersRepository.findUserByConfirmationCode(code);
    }
    async findByLogin(loginOrEmail: string): Promise<UserAccountDBClass | null> {
        return this.usersRepository.findByLogin(loginOrEmail);
    }
    async findByEmail(loginOrEmail: string): Promise<UserAccountDBClass | null> {
        return this.usersRepository.findByEmail(loginOrEmail);
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
    async updateConfirmation(userId: string): Promise<boolean> {
        return this.usersRepository.updateConfirmation(userId);
    }
    async addRefreshTokenIntoBlackList(id: string, token: string): Promise<boolean> {
        return this.usersRepository.addRefreshTokenIntoBlackList(id, token);
    }
    async findRefreshTokenInBlackList(id: string, token: string): Promise<boolean> {
        return this.usersRepository.findRefreshTokenInBlackList(id, token);
    }
}
