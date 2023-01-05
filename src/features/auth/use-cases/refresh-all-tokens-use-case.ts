import { Injectable } from "@nestjs/common";
import { CurrentUserWithDevicesDataModel } from "../dto/auth.dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UsersRepository } from "../../users/users.repository";

@Injectable()
export class RefreshAllTokensUseCase {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        private usersRepository: UsersRepository,
    ) {}

    async execute(user: CurrentUserWithDevicesDataModel): Promise<string[]> {
        const newLastActiveDate = new Date();
        await this.usersRepository.updateLastActiveDate(user.currentSession.deviceId, newLastActiveDate);
        const [newAccessToken, newRefreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    id: user.id,
                },
                {
                    secret: this.configService.get<string>("jwtAccessTokenSecret"),
                    expiresIn: "10 minutes",
                },
            ),
            this.jwtService.signAsync(
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
            ),
        ]);
        return [newAccessToken, newRefreshToken];
    }
}
