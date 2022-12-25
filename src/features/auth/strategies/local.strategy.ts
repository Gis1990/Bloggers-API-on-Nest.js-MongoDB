import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { Request } from "express";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            usernameField: "loginOrEmail",
            passReqToCallback: true,
        });
    }

    async validate(request: Request, loginOrEmail: string, password: string): Promise<any> {
        const user = await this.authService.checkCredentials(
            loginOrEmail,
            password,
            request.ip,
            request.headers["user-agent"],
        );
        console.log("user", user);
        if (user) {
            return user;
        } else {
            throw new UnauthorizedException();
        }
    }
}
