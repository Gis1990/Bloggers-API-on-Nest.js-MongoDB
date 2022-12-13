import { Injectable } from "@nestjs/common";
import { UsersRepository } from "../users/users.repository";
import { userDevicesDataClass } from "../users/entities/users.entity";

@Injectable()
export class SecurityService {
    constructor(protected usersRepository: UsersRepository) {}

    async returnAllDevices(userId: string): Promise<userDevicesDataClass[] | null> {
        const user = await this.usersRepository.findUserById(userId);
        if (user) {
            return user.userDevicesData;
        } else {
            return null;
        }
    }
}
