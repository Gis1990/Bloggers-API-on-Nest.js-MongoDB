import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { MailModule } from "../utils/email/mail.module";
import { LocalStrategy } from "../../guards/strategies/local.strategy";
import { JwtAccessTokenStrategy } from "../../guards/strategies/jwt.access.token.strategy";
import { BasicStrategy } from "../../guards/strategies/basic.strategy";
import { UsersRepository } from "../../repositories/users.repository";
import { BcryptService } from "../utils/bcrypt/bcrypt.service";
import { BcryptModule } from "../utils/bcrypt/bcrypt.module";
import { JwtRefreshTokenStrategy } from "../../guards/strategies/jwt.refresh.token.strategy";
import { UsersQueryRepository } from "../../query-repositories/users.query.repository";
import { strategyForUnauthorizedUser } from "../../guards/strategies/strategy.for.unauthorized.user";
import { IsEmailExistOrConfirmedConstraint } from "../../decorators/users/users.custom.decorators";
import { MongooseModule } from "@nestjs/mongoose";
import {
    LoginAttemptsClass,
    LoginAttemptsSchema,
    UserAccountClass,
    UserAccountEmailClass,
    UserAccountEmailSchema,
    UserDevicesDataClass,
    UserDevicesDataSchema,
    EmailRecoveryCodeClass,
    EmailRecoveryCodeSchema,
    UsersAccountSchema,
    BanInfoClass,
    BanInfoSchema,
} from "../../schemas/users.schema";
import { AcceptNewPasswordUseCase } from "../../commands/auth/accept-new-password-use-case";
import { CheckCredentialsUseCase } from "../../commands/auth/check-credentials-use-case";
import { ConfirmEmailUseCase } from "../../commands/auth/confirm-email-use-case";
import { CreateUserWithoutConfirmationEmailUseCase } from "../../commands/auth/create-user-without-confirmation-email-use-case";
import { PasswordRecoveryUseCase } from "../../commands/auth/password-recovery-use-case";
import { RefreshAllTokensUseCase } from "../../commands/auth/refresh-all-tokens-use-case";
import { RefreshOnlyRefreshTokenUseCase } from "../../commands/auth/refresh-only-refresh-token-use-case";
import { RegistrationEmailResendingUseCase } from "../../commands/auth/registration-email-resending-use-case";
import { CreateUserWithConfirmationEmailUseCase } from "../../commands/auth/create-user-with-confirmation-email-use-case";
import { CreateUserUseCase } from "../../commands/users/create-user-use-case";
import { SendEmailForRegistrationUseCase } from "../../commands/email/send-email-for-registration-use-case";
import { SendEmailForPasswordRecoveryUseCase } from "../../commands/email/send-email-for-password-recovery-use-case";
import { CqrsModule } from "@nestjs/cqrs";
import { SecurityService } from "../security/security.service";
import { GetUserByIdQuery } from "../../queries/users/get-user-by-id-query";
import { GetUserByRecoveryCodeQuery } from "../../queries/users/get-user-by-recovery-code-query";
import { GetUserByConfirmationCodeQuery } from "../../queries/users/get-user-by-confirmation-code-query";
import { GetUserByLoginOrEmailQuery } from "../../queries/users/get-user-by-login-or-email-query";

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

const queries = [
    GetUserByIdQuery,
    GetUserByRecoveryCodeQuery,
    GetUserByConfirmationCodeQuery,
    GetUserByLoginOrEmailQuery,
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
        ...queries,
    ],
    imports: [
        CqrsModule,
        PassportModule,
        JwtModule.register({}),
        MailModule,
        BcryptModule,
        MongooseModule.forFeature([
            {
                name: UserAccountClass.name,
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
            {
                name: BanInfoClass.name,
                schema: BanInfoSchema,
            },
        ]),
    ],
})
export class AuthModule {}
