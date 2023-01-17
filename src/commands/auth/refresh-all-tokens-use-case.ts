import { CurrentUserWithDevicesDataModel } from "../../dtos/auth.dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UsersRepository } from "../../repositories/users.repository";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

export class RefreshAllTokensCommand {
    constructor(public readonly user: CurrentUserWithDevicesDataModel) {}
}

@CommandHandler(RefreshAllTokensCommand)
export class RefreshAllTokensUseCase implements ICommandHandler<RefreshAllTokensCommand> {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        private usersRepository: UsersRepository,
    ) {}

    async execute(command: RefreshAllTokensCommand): Promise<string[]> {
        const newLastActiveDate = new Date();
        await this.usersRepository.updateLastActiveDate(command.user.currentSession.deviceId, newLastActiveDate);
        const [newAccessToken, newRefreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    id: command.user.id,
                },
                {
                    secret: this.configService.get<string>("jwtAccessTokenSecret"),
                    expiresIn: "10 minutes",
                },
            ),
            this.jwtService.signAsync(
                {
                    id: command.user.id,
                    ip: command.user.currentSession.ip,
                    title: command.user.currentSession.title,
                    lastActiveDate: newLastActiveDate,
                    deviceId: command.user.currentSession.deviceId,
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
