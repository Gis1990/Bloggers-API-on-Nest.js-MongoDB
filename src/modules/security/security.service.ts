import { Injectable } from "@nestjs/common";
import { UsersRepository } from "../../repositories/users.repository";

@Injectable()
export class SecurityService {
    constructor(private usersRepository: UsersRepository) {}

    async terminateSpecificDevice(id: string, deviceId: string): Promise<boolean> {
        return await this.usersRepository.terminateSpecificDevice(id, deviceId);
    }
}
