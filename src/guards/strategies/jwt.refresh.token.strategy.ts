import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { GetUserByIdCommand } from "../../queries/users/get-user-by-id-query";
import { QueryBus } from "@nestjs/cqrs";

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
    constructor(private configService: ConfigService, private queryBus: QueryBus) {
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
        const user = await this.queryBus.execute(new GetUserByIdCommand(payload.id));
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
        user.currentSession = {
            ip: payload.ip,
            title: payload.title,
            lastActiveDate: payload.lastActiveDate,
            deviceId: payload.deviceId,
        };
        return user;
    }
}
