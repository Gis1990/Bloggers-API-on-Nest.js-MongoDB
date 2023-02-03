import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
    LoginAttemptsClass,
    SentEmailsClass,
    UserAccountClass,
    UserDevicesDataClass,
    EmailRecoveryCodeClass,
    ExtendedBanInfoClass,
} from "../schemas/users.schema";
import { BanDataForUserDto, CreatedNewUserDto } from "../dtos/users.dto";

@Injectable()
export class UsersRepository {
    constructor(
        @InjectModel(UserAccountClass.name) private usersAccountModelClass: Model<UserAccountClass>,
        @InjectModel(LoginAttemptsClass.name) private loginAttemptsModelClass: Model<LoginAttemptsClass>,
    ) {}

    async userConfirmedEmail(id: string): Promise<boolean> {
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

    async createUser(newUser: CreatedNewUserDto): Promise<UserAccountClass> {
        const user = new this.usersAccountModelClass(newUser);
        await user.save();
        return user;
    }

    async deleteUserById(id: string): Promise<boolean> {
        const result = await this.usersAccountModelClass.deleteOne({ id: id });
        return result.deletedCount === 1;
    }

    async banUnbanUserBySuperAdmin(banData: BanDataForUserDto, userId: string): Promise<boolean> {
        await this.usersAccountModelClass.updateOne({ id: userId }, { $set: { userDevicesData: [] } });
        const result = await this.usersAccountModelClass.updateOne({ id: userId }, { $set: { banInfo: banData } });
        return result.modifiedCount === 1;
    }

    async banUnbanUserByBloggerForBlog(
        isBanned: boolean,
        banReason: string,
        blogId: string,
        userId: string,
    ): Promise<boolean> {
        let result;
        const banData: ExtendedBanInfoClass = {
            isBanned: isBanned,
            banDate: new Date(),
            banReason: banReason,
            blogId: blogId,
        };
        const blogIsAlreadyBanned = await this.usersAccountModelClass.findOne({
            $and: [{ id: userId }, { "banInfoForBlogs.blogId": blogId }, { "banInfoForBlogs.isBanned": true }],
        });
        if (blogIsAlreadyBanned && isBanned) {
            return true;
        }
        if (isBanned) {
            result = await this.usersAccountModelClass.updateOne(
                { id: userId },
                { $push: { banInfoForBlogs: banData } },
            );
        } else {
            result = await this.usersAccountModelClass.updateOne(
                { id: userId },
                { $pull: { banInfoForBlogs: { blogId: blogId } } },
            );
        }
        return result.modifiedCount === 1;
    }
}
