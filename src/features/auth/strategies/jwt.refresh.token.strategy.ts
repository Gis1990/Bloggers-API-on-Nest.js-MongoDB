import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { UsersQueryRepository } from "../../users/users.query.repository";

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
    constructor(private configService: ConfigService, private usersQueryRepository: UsersQueryRepository) {
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
        const user = await this.usersQueryRepository.findUserById(payload.id);
        const lastActiveDateFromDB = new Date(
            user?.userDevicesData.find((item) => item.deviceId === payload.deviceId)?.lastActiveDate,
        );
        const lastActiveDateFromJWT = new Date(payload.lastActiveDate);
        if (user && lastActiveDateFromJWT.getTime() === lastActiveDateFromDB.getTime()) {
            return user;
        } else {
            throw new UnauthorizedException();
        }
    }
}
