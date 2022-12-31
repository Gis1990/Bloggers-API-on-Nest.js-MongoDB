import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
    LoginAttemptsClass,
    SentEmailsClass,
    UserAccountDBClass,
    UserAccountDocument,
    UserDevicesDataClass,
    EmailRecoveryCodeClass,
} from "./users.schema";
import { CreatedNewUserDto } from "./dto/users.dto";
import { NewUserClassResponseModel } from "./entities/users.entity";

@Injectable()
export class UsersRepository {
    constructor(
        @InjectModel(UserAccountDBClass.name) private usersAccountModelClass: Model<UserAccountDocument>,
        @InjectModel(LoginAttemptsClass.name) private loginAttemptsModelClass: Model<LoginAttemptsClass>,
    ) {}

    async updateConfirmation(id: string): Promise<boolean> {
        const result = await this.usersAccountModelClass.updateOne(
            { id: id },
            { $set: { "emailConfirmation.isConfirmed": true } },
        );
        return result.modifiedCount === 1;
    }

    async updateConfirmationCode(id: string): Promise<boolean> {
        const newConfirmationCode = uuidv4();
        const result = await this.usersAccountModelClass.updateOne(
            { id: id },
            { $set: { "emailConfirmation.confirmationCode": newConfirmationCode } },
        );
        return result.modifiedCount === 1;
    }

    async addLoginAttempt(id: string, ip: string): Promise<boolean> {
        const createdLoginAttemptDto = {
            attemptDate: new Date(),
            ip: ip,
        };
        const loginAttempt: LoginAttemptsClass = new this.loginAttemptsModelClass(createdLoginAttemptDto);
        const result = await this.usersAccountModelClass.updateOne(
            { id: id },
            { $push: { loginAttempts: loginAttempt } },
        );
        return result.modifiedCount === 1;
    }

    async addPasswordRecoveryCode(id: string, passwordRecoveryData: EmailRecoveryCodeClass): Promise<boolean> {
        const result = await this.usersAccountModelClass.updateOne(
            { id: id },
            { $set: { emailRecoveryCode: passwordRecoveryData } },
        );
        return result.modifiedCount === 1;
    }

    async updatePasswordHash(id: string, passwordHash: string): Promise<boolean> {
        const result = await this.usersAccountModelClass.updateOne(
            { id: id },
            { $set: { passwordHash: passwordHash } },
        );
        return result.modifiedCount === 1;
    }

    async addUserDevicesData(id: string, userDevicesData: UserDevicesDataClass): Promise<boolean> {
        const result = await this.usersAccountModelClass.updateOne(
            { id: id },
            { $push: { userDevicesData: userDevicesData } },
        );
        return result.modifiedCount === 1;
    }

    async addCurrentSession(id: string, userDevicesData: UserDevicesDataClass): Promise<boolean> {
        const result = await this.usersAccountModelClass.updateOne(
            { id: id },
            { $set: { currentSession: userDevicesData } },
        );
        return result.modifiedCount === 1;
    }

    async updateLastActiveDate(deviceId: string, newLastActiveDate: Date): Promise<boolean> {
        const result = await this.usersAccountModelClass.updateOne(
            { "userDevicesData.deviceId": deviceId },
            { $set: { "userDevicesData.$.lastActiveDate": newLastActiveDate } },
        );
        return result.modifiedCount === 1;
    }

    async terminateAllDevices(id: string, userDevicesData: UserDevicesDataClass): Promise<boolean> {
        await this.usersAccountModelClass.updateOne({ id: id }, { $set: { userDevicesData: [] } });
        const result = await this.usersAccountModelClass.updateOne(
            { id: id },
            { $push: { userDevicesData: userDevicesData } },
        );
        return result.modifiedCount === 1;
    }

    async terminateSpecificDevice(id: string, deviceId: string): Promise<boolean> {
        const result = await this.usersAccountModelClass.updateOne(
            { id: id },
            { $pull: { userDevicesData: { deviceId: deviceId } } },
        );
        return result.modifiedCount === 1;
    }

    async addEmailLog(email: string): Promise<boolean> {
        const emailData: SentEmailsClass = new SentEmailsClass();
        const result = await this.usersAccountModelClass.updateOne(
            { email: email },
            { $push: { "emailConfirmation.sentEmails": emailData } },
        );
        return result.modifiedCount === 1;
    }

    async createUser(newUser: CreatedNewUserDto): Promise<NewUserClassResponseModel> {
        const user = new this.usersAccountModelClass(newUser);
        await user.save();
        const {
            _id,
            passwordHash,
            emailRecoveryCode,
            loginAttempts,
            emailConfirmation,
            userDevicesData,
            currentSession,
            ...restUser
        } = user.toObject();
        return restUser;
    }

    async deleteUserById(id: string): Promise<boolean> {
        const result = await this.usersAccountModelClass.deleteOne({ id: id });
        return result.deletedCount === 1;
    }
}
