import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { Request } from "express";
import { CheckCredentialsUseCase } from "../use-cases/check-credentials-use-case";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private checkCredentialsUseCase: CheckCredentialsUseCase) {
        super({
            usernameField: "loginOrEmail",
            passReqToCallback: true,
        });
    }

    async validate(request: Request, loginOrEmail: string, password: string): Promise<any> {
        const user = await this.checkCredentialsUseCase.execute(
            loginOrEmail,
            password,
            request.ip,
            request.headers["user-agent"],
        );
        if (user) {
            return user;
        } else {
            throw new UnauthorizedException();
        }
    }
}
