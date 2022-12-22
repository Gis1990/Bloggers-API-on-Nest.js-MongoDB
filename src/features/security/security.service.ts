import { Injectable } from "@nestjs/common";
import { userDevicesDataClass } from "../users/entities/users.entity";
import { UsersQueryRepository } from "../users/users.query.repository";

@Injectable()
export class SecurityService {
    constructor(protected usersQueryRepository: UsersQueryRepository) {}

    async returnAllDevices(userId: string): Promise<userDevicesDataClass[] | null> {
        const user = await this.usersQueryRepository.findUserById(userId);
        if (user) {
            return user.userDevicesData;
        } else {
            return null;
        }
    }
}
