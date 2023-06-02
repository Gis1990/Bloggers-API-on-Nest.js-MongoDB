import { Body, Controller, HttpCode, Post, UseGuards, Res, Get } from "@nestjs/common";
import { InputModelForCreatingNewUser } from "../../dtos/users.dto";
import {
    CurrentUserModel,
    CurrentUserModelForMeEndpoint,
    CurrentUserWithDevicesDataModel,
    InputModelForCode,
    InputModelForNewPassword,
    InputModelForPasswordRecovery,
    InputModelForResendingEmail,
    LoginDto,
} from "../../dtos/auth.dto";
import { LocalAuthGuard } from "../../guards/local-auth.guard";
import { Response } from "express";
import { AccessTokenClass } from "../../entities/auth.entities";
import { JwtRefreshTokenAuthGuard } from "../../guards/jwtRefreshToken-auth.guard";
import { CurrentUser } from "../../decorators/auth/auth.custom.decorators";
import { SkipThrottle } from "@nestjs/throttler";
import { JwtAccessTokenAuthGuard } from "../../guards/jwtAccessToken-auth.guard";
import { CommandBus } from "@nestjs/cqrs";
import { PasswordRecoveryCommand } from "../../commands/auth/password-recovery-use-case";
import { AcceptNewPasswordCommand } from "../../commands/auth/accept-new-password-use-case";
import { ConfirmEmailCommand } from "../../commands/auth/confirm-email-use-case";
import { CreateUserWithConfirmationEmailCommand } from "../../commands/auth/create-user-with-confirmation-email-use-case";
import { RegistrationEmailResendingCommand } from "../../commands/auth/registration-email-resending-use-case";
import { RefreshAllTokensCommand } from "../../commands/auth/refresh-all-tokens-use-case";
import { RefreshOnlyRefreshTokenCommand } from "../../commands/auth/refresh-only-refresh-token-use-case";
import { ApiBody, ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { APIErrorResult } from "../../dtos/blogs.dto";

@SkipThrottle()
@ApiTags("Auth")
@Controller("auth")
export class AuthController {
    constructor(private commandBus: CommandBus) {}

    @ApiOperation({
        summary: "Password recovery via Email confirmation. Email should be sent with RecoveryCode inside",
    })
    @ApiResponse({
        status: 204,
        description: "Even if current email is not registered (for prevent user's email detection)",
    })
    @ApiResponse({ status: 400, description: "If the inputModel has invalid email" })
    @ApiResponse({ status: 429, description: "More than 5 attempts from one IP-address during 10 seconds" })
    @SkipThrottle(false)
    @Post("password-recovery")
    @HttpCode(204)
    async passwordRecovery(@Body() dto: InputModelForPasswordRecovery): Promise<boolean> {
        return await this.commandBus.execute(new PasswordRecoveryCommand(dto));
    }

    @ApiOperation({
        summary: "Confirm Password recovery",
    })
    @ApiResponse({
        status: 204,
        description: "If code is valid and new password is accepted",
    })
    @ApiResponse({
        status: 400,
        description:
            "If the inputModel has incorrect value (for incorrect password length) or RecoveryCode is incorrect or expired",
    })
    @ApiResponse({ status: 429, description: "More than 5 attempts from one IP-address during 10 seconds" })
    @SkipThrottle(false)
    @Post("new-Password")
    @HttpCode(204)
    async newPassword(@Body() dto: InputModelForNewPassword): Promise<boolean> {
        return await this.commandBus.execute(new AcceptNewPasswordCommand(dto));
    }

    @ApiOperation({
        summary: "Try login user to the system",
    })
    @ApiBody({ type: LoginDto })
    @ApiResponse({
        status: 200,
        description: "Returns JWT accessToken in body and JWT refreshToken in cookie (http-only, secure).",
        type: AccessTokenClass,
    })
    @ApiResponse({
        status: 400,
        description: "If the inputModel has incorrect values",
        type: APIErrorResult,
    })
    @ApiResponse({ status: 401, description: "If the password or login is wrong" })
    @ApiResponse({ status: 429, description: "More than 5 attempts from one IP-address during 10 seconds" })
    @SkipThrottle(false)
    @UseGuards(LocalAuthGuard)
    @Post("login")
    @HttpCode(200)
    async login(
        @CurrentUser() userWithDeviceData: CurrentUserWithDevicesDataModel,
        @Res({ passthrough: true }) response: Response,
    ): Promise<AccessTokenClass> {
        const result = await this.commandBus.execute(new RefreshAllTokensCommand(userWithDeviceData));
        const accessToken = result[0];
        const refreshToken = result[1];
        response.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 200000 * 1000, // 20 seconds
        });
        return new AccessTokenClass(accessToken);
    }

    @ApiOperation({
        summary: "Confirm registration",
    })
    @ApiResponse({
        status: 204,
        description: "Email was verified. Account was activated",
    })
    @ApiResponse({
        status: 400,
        description: "If the confirmation code is incorrect, expired or already been applied",
        type: APIErrorResult,
    })
    @ApiResponse({ status: 429, description: "More than 5 attempts from one IP-address during 10 seconds" })
    @SkipThrottle(false)
    @Post("registration-confirmation")
    @HttpCode(204)
    async confirmRegistration(@Body() body: InputModelForCode): Promise<boolean> {
        return await this.commandBus.execute(new ConfirmEmailCommand(body.code));
    }

    @ApiOperation({
        summary: "Registration in the system. Email with confirmation code will be send to passed email address",
    })
    @ApiResponse({
        status: 204,
        description: "Input data is accepted. Email with confirmation code will be send to passed email address",
    })
    @ApiResponse({
        status: 400,
        description:
            "If the inputModel has incorrect values (in particular if the user with the given email or password already exists)",
        type: APIErrorResult,
    })
    @ApiResponse({ status: 429, description: "More than 5 attempts from one IP-address during 10 seconds" })
    @SkipThrottle(false)
    @Post("registration")
    @HttpCode(204)
    async createBlog(@Body() dto: InputModelForCreatingNewUser): Promise<boolean> {
        return await this.commandBus.execute(new CreateUserWithConfirmationEmailCommand(dto));
    }

    @ApiOperation({
        summary: "Resend confirmation registration Email if user exists",
    })
    @ApiResponse({
        status: 204,
        description:
            "Input data is accepted.Email with confirmation code will be send to passed email address.Confirmation code should be inside link as query param, for example: https://some-front.com/confirm-registration?code=youtcodehere",
    })
    @ApiResponse({
        status: 400,
        description: "If the inputModel has incorrect values",
        type: APIErrorResult,
    })
    @ApiResponse({ status: 429, description: "More than 5 attempts from one IP-address during 10 seconds" })
    @SkipThrottle(false)
    @Post("registration-email-resending")
    @HttpCode(204)
    async registrationEmailResending(@Body() dto: InputModelForResendingEmail): Promise<boolean> {
        return await this.commandBus.execute(new RegistrationEmailResendingCommand(dto));
    }

    @ApiOperation({
        summary:
            "Generate new pair of access and refresh tokens (in cookie client must send correct refreshToken that will be revoked after refreshing)\n" +
            "Device LastActiveDate should be overrode by issued Date of new refresh token",
    })
    @ApiResponse({
        status: 200,
        description: "Returns JWT accessToken in body and JWT refreshToken in cookie (http-only, secure).",
        type: AccessTokenClass,
    })
    @ApiResponse({ status: 401, description: "If the JWT refreshToken inside cookie is missing, expired or incorrect" })
    @ApiCookieAuth()
    @UseGuards(JwtRefreshTokenAuthGuard)
    @Post("refresh-token")
    @HttpCode(200)
    async refreshAllTokens(
        @CurrentUser() userWithDeviceData: CurrentUserWithDevicesDataModel,
        @Res({ passthrough: true }) response: Response,
    ): Promise<AccessTokenClass> {
        const result = await this.commandBus.execute(new RefreshAllTokensCommand(userWithDeviceData));
        const accessToken = result[0];
        const refreshToken = result[1];
        response.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 200000 * 1000, // 20 seconds
        });
        return new AccessTokenClass(accessToken);
    }

    @ApiOperation({
        summary: "In cookie client must send correct refreshToken that will be revoked",
    })
    @ApiResponse({
        status: 204,
        description: "No content",
    })
    @ApiResponse({ status: 401, description: "If the JWT refreshToken inside cookie is missing, expired or incorrect" })
    @ApiCookieAuth()
    @UseGuards(JwtRefreshTokenAuthGuard)
    @Post("logout")
    @HttpCode(204)
    async logout(
        @CurrentUser() userWithDeviceData: CurrentUserWithDevicesDataModel,
        @Res({ passthrough: true }) response: Response,
    ): Promise<void> {
        const newRefreshToken = await this.commandBus.execute(new RefreshOnlyRefreshTokenCommand(userWithDeviceData));
        response.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 200000 * 1000, // 20 seconds
        });
        return;
    }

    @ApiOperation({
        summary: "Get information about current user",
    })
    @ApiResponse({
        status: 200,
        description: "Success",
        type: CurrentUserModelForMeEndpoint,
    })
    @ApiResponse({ status: 401, description: "Unauthorized" })
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
