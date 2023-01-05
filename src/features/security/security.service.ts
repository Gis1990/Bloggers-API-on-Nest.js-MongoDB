import { Injectable } from "@nestjs/common";
import { UsersQueryRepository } from "../users/users.query.repository";
import { CurrentUserWithDevicesDataModel } from "../auth/dto/auth.dto";

@Injectable()
export class SecurityService {
    constructor(protected usersQueryRepository: UsersQueryRepository) {}

    async checkAccessRights(userWithDeviceData: CurrentUserWithDevicesDataModel, deviceId: string): Promise<boolean> {
        const userByDeviceId = await this.usersQueryRepository.findUserByDeviceId(deviceId);
        if (userByDeviceId) {
            return userWithDeviceData.id === userByDeviceId.id;
        } else {
            return false;
        }
    }
}
