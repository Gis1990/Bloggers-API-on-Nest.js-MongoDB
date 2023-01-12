import { Injectable } from "@nestjs/common";
import { UsersRepository } from "../super-admin/users/users.repository";

@Injectable()
export class SecurityService {
    constructor(protected usersRepository: UsersRepository) {}

    async terminateSpecificDevice(id: string, deviceId: string): Promise<boolean> {
        return await this.usersRepository.terminateSpecificDevice(id, deviceId);
    }
}
