import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { MailModule } from "../../utils/email/mail.module";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtAccessTokenStrategy } from "./strategies/jwt.access.token.strategy";
import { BasicStrategy } from "./strategies/basic.strategy";
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
import { AcceptNewPasswordUseCase } from "./use-cases/accept-new-password-use-case";
import { CheckCredentialsUseCase } from "./use-cases/check-credentials-use-case";
import { ConfirmEmailUseCase } from "./use-cases/confirm-email-use-case";
import { CreateUserWithoutConfirmationEmailUseCase } from "./use-cases/create-user-without-confirmation-email-use-case";
import { PasswordRecoveryUseCase } from "./use-cases/password-recovery-use-case";
import { RefreshAllTokensUseCase } from "./use-cases/refresh-all-tokens-use-case";
import { RefreshOnlyRefreshTokenUseCase } from "./use-cases/refresh-only-refresh-token-use-case";
import { RegistrationEmailResendingUseCase } from "./use-cases/registration-email-resending-use-case";
import { CreateUserWithConfirmationEmailUseCase } from "./use-cases/create-user-with-confirmation-email-use-case";
import { CreateUserUseCase } from "../users/use-cases/create-user-use-case";
import { SendEmailForRegistrationUseCase } from "../../utils/email/use-cases/send-email-for-registration-use-case";
import { SendEmailForPasswordRecoveryUseCase } from "../../utils/email/use-cases/send-email-for-password-recovery-use-case";
import { CqrsModule } from "@nestjs/cqrs";
import { SecurityService } from "../security/security.service";

const useCases = [
    AcceptNewPasswordUseCase,
    CheckCredentialsUseCase,
    ConfirmEmailUseCase,
    CreateUserWithConfirmationEmailUseCase,
    CreateUserWithoutConfirmationEmailUseCase,
    PasswordRecoveryUseCase,
    RefreshAllTokensUseCase,
    RefreshOnlyRefreshTokenUseCase,
    RegistrationEmailResendingUseCase,
    CreateUserUseCase,
    SendEmailForRegistrationUseCase,
    SendEmailForPasswordRecoveryUseCase,
];

@Module({
    controllers: [AuthController],
    providers: [
        AuthService,
        SecurityService,
        LocalStrategy,
        JwtRefreshTokenStrategy,
        JwtAccessTokenStrategy,
        BasicStrategy,
        strategyForUnauthorizedUser,
        UsersRepository,
        UsersQueryRepository,
        BcryptService,
        IsEmailExistOrConfirmedConstraint,
        ...useCases,
    ],
    imports: [
        CqrsModule,
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
