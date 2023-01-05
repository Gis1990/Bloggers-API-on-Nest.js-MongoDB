import { Injectable } from "@nestjs/common";
import { UserDevicesDataClass } from "../../users/users.schema";
import { CurrentUserWithDevicesDataModel } from "../../auth/dto/auth.dto";
import { UsersQueryRepository } from "../../users/users.query.repository";

@Injectable()
export class ReturnAllDevicesUseCase {
    constructor(private usersQueryRepository: UsersQueryRepository) {}

    async execute(userWithDeviceData: CurrentUserWithDevicesDataModel): Promise<UserDevicesDataClass[] | null> {
        const user = await this.usersQueryRepository.findUserById(userWithDeviceData.id);
        if (user) {
            return user.userDevicesData;
        } else {
            return null;
        }
    }
}
