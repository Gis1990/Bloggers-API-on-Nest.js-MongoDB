import { Injectable } from "@nestjs/common";
import { CurrentUserWithDevicesDataModel } from "../../auth/dto/auth.dto";
import { UsersQueryRepository } from "../../users/users.query.repository";

@Injectable()
export class CheckAccessRightsUseCase {
    constructor(private usersQueryRepository: UsersQueryRepository) {}

    async execute(userWithDeviceData: CurrentUserWithDevicesDataModel, deviceId: string): Promise<boolean> {
        const userByDeviceId = await this.usersQueryRepository.findUserByDeviceId(deviceId);
        if (userByDeviceId) {
            return userWithDeviceData.id === userByDeviceId.id;
        } else {
            return false;
        }
    }
}
