import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { UsersQueryRepository } from "../../users/users.query.repository";

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(private configService: ConfigService, private usersQueryRepository: UsersQueryRepository) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>("jwtAccessTokenSecret"),
        });
    }

    async validate(payload: any) {
        console.log("payload", payload.serId);
        const userId = payload.userId;
        let userData;
        if (userId) {
            userData = await this.usersQueryRepository.findUserById(userId);
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
