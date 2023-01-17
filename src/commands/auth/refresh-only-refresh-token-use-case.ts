import { CurrentUserWithDevicesDataModel } from "../../dtos/auth.dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UsersRepository } from "../../repositories/users.repository";
import { SecurityService } from "../../modules/security/security.service";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

export class RefreshOnlyRefreshTokenCommand {
    constructor(public readonly user: CurrentUserWithDevicesDataModel) {}
}

@CommandHandler(RefreshOnlyRefreshTokenCommand)
export class RefreshOnlyRefreshTokenUseCase implements ICommandHandler<RefreshOnlyRefreshTokenCommand> {
    constructor(
        private usersRepository: UsersRepository,
        private securityService: SecurityService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async execute(command: RefreshOnlyRefreshTokenCommand): Promise<string> {
        const newLastActiveDate = new Date();
        await this.usersRepository.updateLastActiveDate(command.user.currentSession.deviceId, newLastActiveDate);
        await this.securityService.terminateSpecificDevice(command.user.id, command.user.currentSession.deviceId);
        return await this.jwtService.signAsync(
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
        );
    }
}
