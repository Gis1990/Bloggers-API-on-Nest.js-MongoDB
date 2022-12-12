import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { BasicStrategy as Strategy } from "passport-http";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        super({
            passReqToCallback: true,
        });
    }

    public validate = async (req, login, password): Promise<boolean> => {
        const loginFromConfig = this.configService.get<string>("login");
        const passwordFromConfig = this.configService.get<string>("password");
        if (loginFromConfig === login && passwordFromConfig === password) {
            return true;
        } else {
            throw new UnauthorizedException();
        }
    };
}
