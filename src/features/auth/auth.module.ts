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
import { UsersQueryRepository } from "../users/users.query.repository";
import { strategyForUnauthorizedUser } from "./strategies/strategy.for.unauthorized.user";
import { IsEmailExistOrConfirmedConstraint } from "../users/users.custom.decorators";
import { MongooseModule } from "@nestjs/mongoose";
import {
    LoginAttemptsClass,
    LoginAttemptsSchema,
    UserAccountDBClass,
    UserAccountEmailClass,
    UserAccountEmailSchema,
    UserDevicesDataClass,
    UserDevicesDataSchema,
    EmailRecoveryCodeClass,
    EmailRecoveryCodeSchema,
    UsersAccountSchema,
} from "../users/users.schema";

@Module({
    controllers: [AuthController],
    providers: [
        UsersService,
        AuthService,
        LocalStrategy,
        JwtRefreshTokenStrategy,
        JwtAccessTokenStrategy,
        BasicStrategy,
        strategyForUnauthorizedUser,
        MailService,
        UsersRepository,
        UsersQueryRepository,
        BcryptService,
        IsEmailExistOrConfirmedConstraint,
    ],
    imports: [
        PassportModule,
        JwtModule.register({}),
        MailModule,
        BcryptModule,
        MongooseModule.forFeature([
            {
                name: UserAccountDBClass.name,
                schema: UsersAccountSchema,
            },
            {
                name: UserAccountEmailClass.name,
                schema: UserAccountEmailSchema,
            },
            {
                name: UserDevicesDataClass.name,
                schema: UserDevicesDataSchema,
            },
            {
                name: EmailRecoveryCodeClass.name,
                schema: EmailRecoveryCodeSchema,
            },
            {
                name: LoginAttemptsClass.name,
                schema: LoginAttemptsSchema,
            },
        ]),
    ],
})
export class AuthModule {}
