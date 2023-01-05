import { Injectable } from "@nestjs/common";
import { UsersQueryRepository } from "../../users/users.query.repository";
import { BcryptService } from "../../../utils/bcrypt/bcrypt.service";
import { UserAccountDBClass, UserDevicesDataClass } from "../../users/users.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UsersRepository } from "../../users/users.repository";

@Injectable()
export class CheckCredentialsUseCase {
    constructor(
        private usersQueryRepository: UsersQueryRepository,
        private usersRepository: UsersRepository,
        private bcryptService: BcryptService,
        @InjectModel(UserDevicesDataClass.name) private userDevicesDataModelClass: Model<UserDevicesDataClass>,
    ) {}

    async execute(
        loginOrEmail: string,
        password: string,
        ip: string,
        title: string | undefined,
    ): Promise<UserAccountDBClass | null> {
        const user = await this.usersQueryRepository.findByLoginOrEmail(loginOrEmail);
        if (!user) return null;
        await this.usersRepository.addLoginAttempt(user.id, ip);
        const isHashesEqual = await this.bcryptService._isHashesEquals(password, user.passwordHash);
        if (isHashesEqual && user.emailConfirmation.isConfirmed) {
            const createdUserDevicesData = {
                ip: ip,
                lastActiveDate: new Date(),
                title: title,
                deviceId: Number(new Date()).toString(),
            };
            const userDevicesData: UserDevicesDataClass = new this.userDevicesDataModelClass(createdUserDevicesData);
            await this.usersRepository.addUserDevicesData(user.id, userDevicesData);
            await this.usersRepository.addCurrentSession(user.id, userDevicesData);
            return await this.usersQueryRepository.findUserById(user.id);
        } else {
            return null;
        }
    }
}
