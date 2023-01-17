import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { GetUserByIdCommand } from "../../queries/users/get-user-by-id-query";
import { QueryBus } from "@nestjs/cqrs";

@Injectable()
export class strategyForUnauthorizedUser extends PassportStrategy(Strategy, "strategy for unauthorized user") {
    constructor(private configService: ConfigService, private queryBus: QueryBus) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>("jwtAccessTokenSecret"),
        });
    }

    async validate(payload: any) {
        const user = await this.queryBus.execute(new GetUserByIdCommand(payload.id));
        if (user) {
            return user;
        }
    }
}
