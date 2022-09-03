import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { UsersService } from "../../users/users.service";

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
    constructor(private configService: ConfigService, private usersService: UsersService) {
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
        const oldRefreshToken = request.cookies?.refreshToken;
        const user = await this.usersService.findUserById(payload.userId);
        const blacklistedToken = await this.usersService.findRefreshTokenInBlackList(payload.userId, oldRefreshToken);
        await this.usersService.addRefreshTokenIntoBlackList(user.id, oldRefreshToken);
        if (user && !blacklistedToken) {
            return user;
        } else {
            throw new UnauthorizedException();
        }
    }
}
