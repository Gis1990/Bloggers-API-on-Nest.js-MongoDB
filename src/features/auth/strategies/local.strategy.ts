import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { Request } from "express";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            usernameField: "login",
            passReqToCallback: true,
        });
    }

    async validate(request: Request, login: string, password: string): Promise<any> {
        const userId = await this.authService.checkCredentials(login, password, request.ip);
        if (userId) {
            return { userId: userId };
        } else {
            throw new UnauthorizedException();
        }
    }
}
