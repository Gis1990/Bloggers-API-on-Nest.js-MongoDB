import { Injectable } from "@nestjs/common";
import { CurrentUserWithDevicesDataModel } from "../dto/auth.dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { TerminateSpecificDeviceUseCase } from "../../security/use-cases/terminate-specific-device-use-case";
import { UsersRepository } from "../../users/users.repository";

@Injectable()
export class RefreshOnlyRefreshTokenUseCase {
    constructor(
        private usersRepository: UsersRepository,
        private jwtService: JwtService,
        private configService: ConfigService,
        private terminateSpecificDeviceUseCase: TerminateSpecificDeviceUseCase,
    ) {}

    async execute(user: CurrentUserWithDevicesDataModel): Promise<string> {
        const newLastActiveDate = new Date();
        await this.usersRepository.updateLastActiveDate(user.currentSession.deviceId, newLastActiveDate);
        await this.terminateSpecificDeviceUseCase.execute(user.id, user.currentSession.deviceId);
        return await this.jwtService.signAsync(
            {
                id: user.id,
                ip: user.currentSession.ip,
                title: user.currentSession.title,
                lastActiveDate: newLastActiveDate,
                deviceId: user.currentSession.deviceId,
            },
            {
                secret: this.configService.get<string>("jwtRefreshTokenSecret"),
                expiresIn: "10 minutes",
            },
        );
    }
}
