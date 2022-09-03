import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "../../users/users.service";

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(private configService: ConfigService, private usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>("jwtAccessTokenSecret"),
        });
    }
    async validate(payload: any) {
        const userId = payload.userId;
        let userData;
        if (userId) {
            userData = await this.usersService.findUserById(userId);
        } else {
            throw new UnauthorizedException();
        }
        if (userData) {
            return userData;
        } else {
            throw new UnauthorizedException();
        }
    }
}
