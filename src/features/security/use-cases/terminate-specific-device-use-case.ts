import { Injectable } from "@nestjs/common";
import { UsersRepository } from "../../users/users.repository";

@Injectable()
export class TerminateSpecificDeviceUseCase {
    constructor(private usersRepository: UsersRepository) {}

    async execute(id: string, deviceId: string): Promise<boolean> {
        return await this.usersRepository.terminateSpecificDevice(id, deviceId);
    }
}
