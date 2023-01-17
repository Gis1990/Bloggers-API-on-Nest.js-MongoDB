import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { GetUserByIdCommand } from "../../queries/users/get-user-by-id-query";
import { QueryBus } from "@nestjs/cqrs";

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(private configService: ConfigService, private queryBus: QueryBus) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>("jwtAccessTokenSecret"),
        });
    }

    async validate(payload: any) {
        const userId = payload.id;
        let userData;
        if (userId) {
            userData = await this.queryBus.execute(new GetUserByIdCommand(userId));
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
