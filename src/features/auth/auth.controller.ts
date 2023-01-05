import { Body, Controller, HttpCode, Post, UseGuards, Res, Get } from "@nestjs/common";
import { InputModelForCreatingNewUser } from "../users/dto/users.dto";
import {
    CurrentUserModel,
    CurrentUserModelForMeEndpoint,
    CurrentUserWithDevicesDataModel,
    InputModelForCode,
    InputModelForNewPassword,
    InputModelForPasswordRecovery,
    InputModelForResendingEmail,
} from "./dto/auth.dto";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { Response } from "express";
import { AccessTokenClass } from "./entities/auth.entity";
import { JwtRefreshTokenAuthGuard } from "./guards/jwtRefreshToken-auth.guard";
import { CurrentUser } from "./auth.cutsom.decorators";
import { SkipThrottle } from "@nestjs/throttler";
import { JwtAccessTokenAuthGuard } from "./guards/jwtAccessToken-auth.guard";
import { PasswordRecoveryUseCase } from "./use-cases/password-recovery-use-case";
import { AcceptNewPasswordUseCase } from "./use-cases/accept-new-password-use-case";
import { ConfirmEmailUseCase } from "./use-cases/confirm-email-use-case";
import { CreateUserWithConfirmationEmailUseCase } from "./use-cases/create-user-with-confirmation-email-use-case";
import { RegistrationEmailResendingUseCase } from "./use-cases/registration-email-resending-use-case";
import { RefreshAllTokensUseCase } from "./use-cases/refresh-all-tokens-use-case";
import { RefreshOnlyRefreshTokenUseCase } from "./use-cases/refresh-only-refresh-token-use-case";

@SkipThrottle()
@Controller("auth")
export class AuthController {
    constructor(
        private passwordRecoveryUseCase: PasswordRecoveryUseCase,
        private acceptNewPasswordUseCase: AcceptNewPasswordUseCase,
        private confirmEmailUseCase: ConfirmEmailUseCase,
        private createUserWithConfirmationEmailUseCase: CreateUserWithConfirmationEmailUseCase,
        private registrationEmailResendingUseCase: RegistrationEmailResendingUseCase,
        private refreshAllTokensUseCase: RefreshAllTokensUseCase,
        private refreshOnlyRefreshTokenUseCase: RefreshOnlyRefreshTokenUseCase,
    ) {}

    @SkipThrottle(false)
    @Post("password-recovery")
    @HttpCode(204)
    async passwordRecovery(@Body() dto: InputModelForPasswordRecovery): Promise<boolean> {
        return await this.passwordRecoveryUseCase.execute(dto);
    }

    @SkipThrottle(false)
    @Post("new-Password")
    @HttpCode(204)
    async newPassword(@Body() dto: InputModelForNewPassword): Promise<boolean> {
        return await this.acceptNewPasswordUseCase.execute(dto);
    }

    @SkipThrottle(false)
    @Post("registration-confirmation")
    @HttpCode(204)
    async confirmRegistration(@Body() body: InputModelForCode): Promise<boolean> {
        return await this.confirmEmailUseCase.execute(body.code);
    }

    @SkipThrottle(false)
    @Post("registration")
    @HttpCode(204)
    async createBlog(@Body() dto: InputModelForCreatingNewUser): Promise<boolean> {
        return await this.createUserWithConfirmationEmailUseCase.execute(dto);
    }

    @SkipThrottle(false)
    @Post("registration-email-resending")
    @HttpCode(204)
    async registrationEmailResending(@Body() dto: InputModelForResendingEmail): Promise<boolean> {
        return await this.registrationEmailResendingUseCase.execute(dto);
    }

    @SkipThrottle(false)
    @UseGuards(LocalAuthGuard)
    @Post("login")
    @HttpCode(200)
    async login(
        @CurrentUser() userWithDeviceData: CurrentUserWithDevicesDataModel,
        @Res({ passthrough: true }) response: Response,
    ): Promise<AccessTokenClass> {
        const result = await this.refreshAllTokensUseCase.execute(userWithDeviceData);
        const accessToken = result[0];
        const refreshToken = result[1];
        response.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 200000 * 1000, // 20 seconds
        });
        return new AccessTokenClass(accessToken);
    }

    @UseGuards(JwtRefreshTokenAuthGuard)
    @Post("refresh-token")
    @HttpCode(200)
    async refreshAllTokens(
        @CurrentUser() userWithDeviceData: CurrentUserWithDevicesDataModel,
        @Res({ passthrough: true }) response: Response,
    ): Promise<AccessTokenClass> {
        const result = await this.refreshAllTokensUseCase.execute(userWithDeviceData);
        const accessToken = result[0];
        const refreshToken = result[1];
        response.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 200000 * 1000, // 20 seconds
        });
        return new AccessTokenClass(accessToken);
    }

    @UseGuards(JwtRefreshTokenAuthGuard)
    @Post("logout")
    @HttpCode(204)
    async logout(
        @CurrentUser() userWithDeviceData: CurrentUserWithDevicesDataModel,
        @Res({ passthrough: true }) response: Response,
    ): Promise<void> {
        const newRefreshToken = await this.refreshOnlyRefreshTokenUseCase.execute(userWithDeviceData);
        response.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 200000 * 1000, // 20 seconds
        });
        return;
    }

    @UseGuards(JwtAccessTokenAuthGuard)
    @Get("me")
    @HttpCode(200)
    async me(@CurrentUser() user: CurrentUserModel): Promise<CurrentUserModelForMeEndpoint> {
        return {
            email: user.email,
            login: user.login,
            userId: user.id,
        };
    }
}
