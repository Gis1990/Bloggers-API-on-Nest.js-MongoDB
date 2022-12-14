import { Injectable } from "@nestjs/common";
import {
    LoginAttemptsClass,
    SentEmailsClass,
    UserAccountDBClass,
    UserDBClassPagination,
    userDevicesDataClass,
    UserRecoveryCodeClass,
} from "./entities/users.entity";
import { v4 as uuidv4 } from "uuid";
import { UsersAccountModelClass } from "../../db";
import { ModelForGettingAllUsers } from "./dto/users.dto";

@Injectable()
export class UsersRepository {
    async getAllUsers(dto: ModelForGettingAllUsers): Promise<UserDBClassPagination> {
        const {
            searchLoginTerm = null,
            searchEmailTerm = null,
            pageNumber = 1,
            pageSize = 10,
            sortBy = "createdAt",
            sortDirection = "desc",
        } = dto;
        const skips = pageSize * (pageNumber - 1);
        let cursor;
        let totalCount;
        const sortObj: any = {};
        if (!searchLoginTerm || !searchEmailTerm) {
            if (sortDirection === "desc") {
                sortObj[sortBy] = -1;
                cursor = await UsersAccountModelClass.find(
                    {},
                    {
                        _id: 0,
                        id: 1,
                        login: 1,
                        email: 1,
                        createdAt: 1,
                    },
                )
                    .sort(sortObj)
                    .skip(skips)
                    .limit(pageSize)
                    .lean();
                totalCount = await UsersAccountModelClass.count({});
            } else {
                sortObj[sortBy] = 1;
                cursor = await UsersAccountModelClass.find(
                    {},
                    {
                        _id: 0,
                        id: 1,
                        login: 1,
                        email: 1,
                        createdAt: 1,
                    },
                )
                    .sort(sortObj)
                    .skip(skips)
                    .limit(pageSize)
                    .lean();
                totalCount = await UsersAccountModelClass.count({});
            }
        } else {
            if (sortDirection === "desc") {
                sortObj[sortBy] = -1;
                cursor = await UsersAccountModelClass.find(
                    {
                        $or: [
                            { login: { $regex: searchLoginTerm, $options: "i" } },
                            { email: { $regex: searchEmailTerm, $options: "i" } },
                        ],
                    },
                    { _id: 0, id: 1, login: 1, email: 1, createdAt: 1 },
                )
                    .sort(sortObj)
                    .skip(skips)
                    .limit(pageSize)
                    .lean();
                totalCount = await UsersAccountModelClass.count({
                    $or: [
                        { login: { $regex: searchLoginTerm, $options: "i" } },
                        { email: { $regex: searchEmailTerm, $options: "i" } },
                    ],
                });
            } else {
                sortObj[sortBy] = 1;
                cursor = await UsersAccountModelClass.find(
                    {
                        $or: [
                            { login: { $regex: searchLoginTerm, $options: "i" } },
                            { email: { $regex: searchEmailTerm, $options: "i" } },
                        ],
                    },
                    { _id: 0, id: 1, login: 1, email: 1, createdAt: 1 },
                )
                    .sort(sortObj)
                    .skip(skips)
                    .limit(pageSize)
                    .lean();
                totalCount = await UsersAccountModelClass.count({
                    $or: [
                        { login: { $regex: searchLoginTerm, $options: "i" } },
                        { email: { $regex: searchEmailTerm, $options: "i" } },
                    ],
                });
            }
        }
        return new UserDBClassPagination(Math.ceil(totalCount / pageSize), pageNumber, pageSize, totalCount, cursor);
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

    async findByLoginOrEmail(loginOrEmail: string): Promise<UserAccountDBClass | null> {
        return UsersAccountModelClass.findOne({ $or: [{ email: loginOrEmail }, { login: loginOrEmail }] });
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

    async addPasswordRecoveryCode(id: string, passwordRecoveryData: UserRecoveryCodeClass): Promise<boolean> {
        const result = await UsersAccountModelClass.updateOne(
            { id: id },
            { $set: { emailRecoveryCode: passwordRecoveryData } },
        );
        return result.modifiedCount === 1;
    }

    async updatePasswordHash(id: string, passwordHash: string): Promise<boolean> {
        const result = await UsersAccountModelClass.updateOne({ id: id }, { $set: { passwordHash: passwordHash } });
        return result.modifiedCount === 1;
    }

    async addUserDevicesData(id: string, userDevicesData: userDevicesDataClass): Promise<boolean> {
        const result = await UsersAccountModelClass.updateOne(
            { id: id },
            { $push: { userDevicesData: userDevicesData } },
        );
        return result.modifiedCount === 1;
    }

    async updateLastActiveDate(
        id: string,
        userDevicesData: userDevicesDataClass,
        newLastActiveDate: string,
    ): Promise<boolean> {
        const result = await UsersAccountModelClass.updateOne(
            { "userDevicesData.deviceId": userDevicesData.deviceId },
            { $set: { "userDevicesData.$.lastActiveDate": newLastActiveDate } },
        );
        return result.modifiedCount === 1;
    }

    async terminateAllDevices(id: string, userDevicesData: userDevicesDataClass): Promise<boolean> {
        await UsersAccountModelClass.updateOne({ id: id }, { $set: { userDevicesData: [] } });
        const result = await UsersAccountModelClass.updateOne(
            { id: id },
            { $push: { userDevicesData: userDevicesData } },
        );
        return result.modifiedCount === 1;
    }

    async terminateSpecificDevice(id: string, deviceId: string): Promise<boolean> {
        const result = await UsersAccountModelClass.updateOne(
            { id: id },
            { $pull: { userDevicesData: { deviceId: deviceId } } },
        );
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

    async createUser(newUser: UserAccountDBClass): Promise<UserAccountDBClass> {
        await UsersAccountModelClass.insertMany([newUser]);
        return newUser;
    }

    async deleteUserById(id: string): Promise<boolean> {
        const result = await UsersAccountModelClass.deleteOne({ id: id });
        return result.deletedCount === 1;
    }
}
