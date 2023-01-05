import { Injectable } from "@nestjs/common";
import { CurrentUserWithDevicesDataModel } from "../../auth/dto/auth.dto";
import { UsersRepository } from "../../users/users.repository";

@Injectable()
export class TerminateAllDevicesUseCase {
    constructor(private usersRepository: UsersRepository) {}

    async execute(userWithDeviceData: CurrentUserWithDevicesDataModel): Promise<boolean> {
        return await this.usersRepository.terminateAllDevices(userWithDeviceData.id, userWithDeviceData.currentSession);
    }
}
