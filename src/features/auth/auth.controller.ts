import { Body, Controller, HttpCode, Post, UseGuards, Res, Get } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { InputModelForCreatingNewUser } from "../users/dto/users.dto";
import { currentUserModel, InputModelForCode, InputModelForResendingEmail } from "./dto/auth.dto";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { Response } from "express";
import { AccessTokenClass } from "./auth.model";
import { JwtRefreshTokenAuthGuard } from "./guards/jwtRefreshToken-auth.guard";
import { CurrentUserId, CurrentUser } from "./auth.cutsom.decorators";

export class iusr {
    email: string;
    login: string;
    userId: string;
}

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @Post("registration-confirmation")
    @HttpCode(204)
    async confirmRegistration(@Body() body: InputModelForCode): Promise<boolean> {
        return await this.authService.confirmEmail(body.code);
    }
    @Post("registration")
    @HttpCode(204)
    async createBlogger(@Body() dto: InputModelForCreatingNewUser): Promise<boolean> {
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
        @CurrentUserId() userId: string,
        @Res({ passthrough: true }) response: Response,
    ): Promise<AccessTokenClass> {
        const result = await this.authService.refreshAllTokens(userId);
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
        @CurrentUserId() userId: string,
        @Res({ passthrough: true }) response: Response,
    ): Promise<AccessTokenClass> {
        const result = await this.authService.refreshAllTokens(userId);
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
    async logout(@CurrentUserId() userId: string, @Res({ passthrough: true }) response: Response): Promise<void> {
        const newRefreshToken = await this.authService.refreshOnlyRefreshToken(userId);
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
    async me(@CurrentUser() user: currentUserModel): Promise<currentUserModel> {
        return user;
    }
}
