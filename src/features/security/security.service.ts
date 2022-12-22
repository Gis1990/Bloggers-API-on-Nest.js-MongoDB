import { Injectable } from "@nestjs/common";
import { userDevicesDataClass } from "../users/entities/users.entity";
import { UsersQueryRepository } from "../users/users.query.repository";
import { CurrentUserWithDevicesDataModel } from "../auth/dto/auth.dto";
import { UsersRepository } from "../users/users.repository";

@Injectable()
export class SecurityService {
    constructor(protected usersQueryRepository: UsersQueryRepository, protected usersRepository: UsersRepository) {}

    async returnAllDevices(
        userWithDeviceData: CurrentUserWithDevicesDataModel,
    ): Promise<userDevicesDataClass[] | null> {
        const user = await this.usersQueryRepository.findUserById(userWithDeviceData.userId);
        if (user) {
            return user.userDevicesData;
        } else {
            return null;
        }
    }

    async terminateAllDevices(userWithDeviceData: CurrentUserWithDevicesDataModel): Promise<boolean> {
        return await this.usersRepository.terminateAllDevices(
            userWithDeviceData.userId,
            userWithDeviceData.userDevicesData[0],
        );
    }

    async terminateSpecificDevice(
        userWithDeviceData: CurrentUserWithDevicesDataModel,
        deviceId: string,
    ): Promise<boolean> {
        return await this.usersRepository.terminateSpecificDevice(userWithDeviceData.userId, deviceId);
    }

    async checkAccessRights(userWithDeviceData: CurrentUserWithDevicesDataModel, deviceId: string): Promise<boolean> {
        const userByDeviceId = await this.usersQueryRepository.findUserByDeviceId(deviceId);
        if (userByDeviceId) {
            return userWithDeviceData.userId === userByDeviceId.id;
        } else {
            return false;
        }
    }
}
