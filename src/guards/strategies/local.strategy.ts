import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { Request } from "express";
import { CheckCredentialsCommand } from "../../commands/auth/check-credentials-use-case";
import { CommandBus } from "@nestjs/cqrs";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private commandBus: CommandBus) {
        super({
            usernameField: "loginOrEmail",
            passReqToCallback: true,
        });
    }

    async validate(request: Request, loginOrEmail: string, password: string): Promise<any> {
        const user = await this.commandBus.execute(
            new CheckCredentialsCommand(loginOrEmail, password, request.ip, request.headers["user-agent"]),
        );
        if (user && !user.banInfo.isBanned) {
            return user;
        } else {
            throw new UnauthorizedException();
        }
    }
}
