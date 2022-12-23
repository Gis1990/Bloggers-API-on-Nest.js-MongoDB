import { Injectable } from "@nestjs/common";
import {
    LoginAttemptsClass,
    SentEmailsClass,
    UserAccountDBClass,
    userDevicesDataClass,
    UserRecoveryCodeClass,
} from "./entities/users.entity";
import { v4 as uuidv4 } from "uuid";
import { UsersAccountModelClass } from "../../db";

@Injectable()
export class UsersRepository {
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

    async addCurrentSession(id: string, userDevicesData: userDevicesDataClass): Promise<boolean> {
        const result = await UsersAccountModelClass.updateOne(
            { id: id },
            { $set: { currentSession: userDevicesData } },
        );
        return result.modifiedCount === 1;
    }

    async updateLastActiveDate(userDevicesData: userDevicesDataClass, newLastActiveDate: Date): Promise<boolean> {
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
