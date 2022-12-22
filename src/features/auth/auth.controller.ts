import { Body, Controller, HttpCode, Post, UseGuards, Res, Get } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { InputModelForCreatingNewUser } from "../users/dto/users.dto";
import {
    CurrentUserModel,
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

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("password-recovery")
    @HttpCode(204)
    async passwordRecovery(@Body() dto: InputModelForPasswordRecovery): Promise<boolean> {
        return await this.authService.passwordRecovery(dto);
    }

    @Post("new-Password")
    @HttpCode(204)
    async newPassword(@Body() dto: InputModelForNewPassword): Promise<boolean> {
        return await this.authService.acceptNewPassword(dto);
    }

    @Post("registration-confirmation")
    @HttpCode(204)
    async confirmRegistration(@Body() body: InputModelForCode): Promise<boolean> {
        return await this.authService.confirmEmail(body.code);
    }

    @Post("registration")
    @HttpCode(204)
    async createBlog(@Body() dto: InputModelForCreatingNewUser): Promise<boolean> {
        return await this.authService.createUserWithConfirmationEmail(dto);
    }

    @Post("registration-email-resending")
    @HttpCode(204)
    async registrationEmailResending(@Body() dto: InputModelForResendingEmail): Promise<boolean> {
        return await this.authService.registrationEmailResending(dto);
    }

    @UseGuards(LocalAuthGuard)
    @Post("login")
    @HttpCode(200)
    async login(
        @CurrentUser() userWithDeviceData: CurrentUserWithDevicesDataModel,
        @Res({ passthrough: true }) response: Response,
    ): Promise<AccessTokenClass> {
        const result = await this.authService.refreshAllTokens(userWithDeviceData);
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
        const result = await this.authService.refreshAllTokens(userWithDeviceData);
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
        const newRefreshToken = await this.authService.refreshOnlyRefreshToken(userWithDeviceData);
        response.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 200000 * 1000, // 20 seconds
        });
        return;
    }

    @UseGuards(JwtRefreshTokenAuthGuard)
    @Get("me")
    @HttpCode(200)
    async me(@CurrentUser() user: CurrentUserModel): Promise<CurrentUserModel> {
        return user;
    }
}
