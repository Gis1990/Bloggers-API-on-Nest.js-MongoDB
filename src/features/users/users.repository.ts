import { Injectable } from "@nestjs/common";
import {
    LoginAttemptsClass,
    RefreshTokenClass,
    SentEmailsClass,
    UserAccountDBClass,
    UserDBClassPagination,
} from "./entities/users.entity";
import { v4 as uuidv4 } from "uuid";
import { UsersAccountModelClass } from "../../db";
import { ModelForGettingAllUsers } from "./dto/users.dto";

@Injectable()
export class UsersRepository {
    async getAllUsers(dto: ModelForGettingAllUsers): Promise<UserDBClassPagination> {
        const { PageNumber = 1, PageSize = 10 } = dto;
        const skips = PageSize * (PageNumber - 1);
        const cursor = await UsersAccountModelClass.find({}, { _id: 0, id: 1, login: 1 })
            .skip(skips)
            .limit(PageSize)
            .lean();
        const totalCount = await UsersAccountModelClass.count({});
        return new UserDBClassPagination(Math.ceil(totalCount / PageSize), PageNumber, PageSize, totalCount, cursor);
    }
    async findUserById(id: string): Promise<UserAccountDBClass | null> {
        const user = await UsersAccountModelClass.findOne(
            { id: id },
            {
                _id: 0,
                emailConfirmation: 0,
                loginAttempts: 0,
                passwordHash: 0,
                createdAt: 0,
                blacklistedRefreshTokens: 0,
            },
        );
        if (user) {
            return user;
        } else {
            return null;
        }
    }
    async findByLogin(login: string): Promise<UserAccountDBClass | null> {
        return UsersAccountModelClass.findOne({ login: login });
    }
    async findByEmail(email: string): Promise<UserAccountDBClass | null> {
        return UsersAccountModelClass.findOne({ email: email });
    }
    async findUserByConfirmationCode(emailConfirmationCode: string): Promise<UserAccountDBClass | null> {
        return UsersAccountModelClass.findOne({ "emailConfirmation.confirmationCode": emailConfirmationCode });
    }
    async updateConfirmation(id: string): Promise<boolean> {
        const result = await UsersAccountModelClass.updateOne(
            { id: id },
            { $set: { "emailConfirmation.isConfirmed": true } },
        );
        return result.modifiedCount === 1;
    }
    async updateConfirmationCode(id: string): Promise<boolean> {
        const newConfirmationCode = uuidv4();
        const result = await UsersAccountModelClass.updateOne(
            { id: id },
            { $set: { "emailConfirmation.confirmationCode": newConfirmationCode } },
        );
        return result.modifiedCount === 1;
    }
    async addLoginAttempt(id: string, ip: string): Promise<boolean> {
        const loginAttempt: LoginAttemptsClass = new LoginAttemptsClass(new Date(), ip);
        const result = await UsersAccountModelClass.updateOne({ id: id }, { $push: { loginAttempts: loginAttempt } });
        return result.modifiedCount === 1;
    }
    async addEmailLog(email: string): Promise<boolean> {
        const emailData: SentEmailsClass = new SentEmailsClass(Number(new Date()).toString());
        const result = await UsersAccountModelClass.updateOne(
            { email: email },
            { $push: { "emailConfirmation.sentEmails": emailData } },
        );
        return result.modifiedCount === 1;
    }
    async addRefreshTokenIntoBlackList(id: string, token: string): Promise<boolean> {
        const tokenForBlackList: RefreshTokenClass = new RefreshTokenClass(token);
        const result = await UsersAccountModelClass.updateOne(
            { id: id },
            { $push: { blacklistedRefreshTokens: tokenForBlackList } },
        );
        return result.modifiedCount === 1;
    }
    async findRefreshTokenInBlackList(id: string, token: string) {
        const blacklistedToken = UsersAccountModelClass.findOne(
            { id: id, blacklistedRefreshTokens: { $in: { token } } },
            { _id: 1 },
        ).lean();
        return !blacklistedToken;
    }
    async createUser(newUser: UserAccountDBClass): Promise<UserAccountDBClass> {
        await UsersAccountModelClass.insertMany([newUser]);
        return newUser;
    }
    async deleteUserById(id: string): Promise<boolean> {
        const result = await UsersAccountModelClass.deleteOne({ id: id });
        return result.deletedCount === 1;
    }
}
