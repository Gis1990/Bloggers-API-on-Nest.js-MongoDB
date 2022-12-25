import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { UsersQueryRepository } from "../../users/users.query.repository";
import { UsersService } from "../../users/users.service";

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
    constructor(
        private configService: ConfigService,
        private usersQueryRepository: UsersQueryRepository,
        private usersService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request?.cookies?.refreshToken;
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>("jwtRefreshTokenSecret"),
            passReqToCallback: true,
        });
    }

    async validate(request: Request, payload: any) {
        const sessionAdded = await this.usersService.addCurrentSession(payload.id, {
            ip: payload.ip,
            title: payload.title,
            lastActiveDate: payload.lastActiveDate,
            deviceId: payload.deviceId,
        });
        if (!sessionAdded) {
            throw new UnauthorizedException();
        }

        const user = await this.usersQueryRepository.findUserById(payload.id);
        if (!user) {
            throw new UnauthorizedException();
        }

        const userDeviceData = user.userDevicesData.find((item) => item.deviceId === payload.deviceId);
        if (!userDeviceData) {
            throw new UnauthorizedException();
        }

        const lastActiveDateFromDB = new Date(userDeviceData.lastActiveDate);
        const lastActiveDateFromJWT = new Date(payload.lastActiveDate);
        if (lastActiveDateFromJWT.getTime() !== lastActiveDateFromDB.getTime()) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
