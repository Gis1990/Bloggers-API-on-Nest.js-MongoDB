import { Injectable } from "@nestjs/common";
import { UsersQueryRepository } from "../users/users.query.repository";
import { CurrentUserWithDevicesDataModel } from "../auth/dto/auth.dto";
import { UsersRepository } from "../users/users.repository";
import { UserDevicesDataClass } from "../users/users.schema";

@Injectable()
export class SecurityService {
    constructor(protected usersQueryRepository: UsersQueryRepository, protected usersRepository: UsersRepository) {}

    async returnAllDevices(
        userWithDeviceData: CurrentUserWithDevicesDataModel,
    ): Promise<UserDevicesDataClass[] | null> {
        const user = await this.usersQueryRepository.findUserById(userWithDeviceData.id);
        if (user) {
            return user.userDevicesData;
        } else {
            return null;
        }
    }

    async terminateAllDevices(userWithDeviceData: CurrentUserWithDevicesDataModel): Promise<boolean> {
        return await this.usersRepository.terminateAllDevices(userWithDeviceData.id, userWithDeviceData.currentSession);
    }

    async terminateSpecificDevice(
        userWithDeviceData: CurrentUserWithDevicesDataModel,
        deviceId: string,
    ): Promise<boolean> {
        return await this.usersRepository.terminateSpecificDevice(userWithDeviceData.id, deviceId);
    }

    async checkAccessRights(userWithDeviceData: CurrentUserWithDevicesDataModel, deviceId: string): Promise<boolean> {
        const userByDeviceId = await this.usersQueryRepository.findUserByDeviceId(deviceId);
        if (userByDeviceId) {
            return userWithDeviceData.id === userByDeviceId.id;
        } else {
            return false;
        }
    }
}
