import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { MailModule } from "../../utils/email/mail.module";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtAccessTokenStrategy } from "./strategies/jwt.access.token.strategy";
import { BasicStrategy } from "./strategies/basic.strategy";
import { MailService } from "../../utils/email/mail.service";
import { UsersService } from "../users/users.service";
import { UsersRepository } from "../users/users.repository";
import { BcryptService } from "../../utils/bcrypt/bcrypt.service";
import { BcryptModule } from "../../utils/bcrypt/bcrypt.module";
import { JwtRefreshTokenStrategy } from "./strategies/jwt.refresh.token.strategy";

@Module({
    controllers: [AuthController],
    providers: [
        UsersService,
        AuthService,
        LocalStrategy,
        JwtRefreshTokenStrategy,
        JwtAccessTokenStrategy,
        BasicStrategy,
        MailService,
        UsersRepository,
        BcryptService,
    ],
    imports: [PassportModule, JwtModule.register({}), MailModule, BcryptModule],
})
export class AuthModule {}
