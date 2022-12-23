import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersQueryRepository } from "../../users/users.query.repository";

@Injectable()
export class strategyForUnauthorizedUser extends PassportStrategy(Strategy, "strategy for unauthorized user") {
    constructor(private configService: ConfigService, private usersQueryRepository: UsersQueryRepository) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>("jwtAccessTokenSecret"),
        });
    }

    async validate(payload: any) {
        const user = await this.usersQueryRepository.findUserById(payload.id);
        if (user) {
            return user;
        }
    }
}
