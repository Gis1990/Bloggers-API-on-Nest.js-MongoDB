import { Controller, Response, Get, Delete, Param, UseGuards, HttpCode, Res, HttpException } from "@nestjs/common";
import { JwtRefreshTokenAuthGuard } from "../../guards/jwtRefreshToken-auth.guard";
import { CurrentUser } from "../../decorators/auth/auth.custom.decorators";
import { CurrentUserWithDevicesDataModel } from "../../dtos/auth.dto";
import { SkipThrottle } from "@nestjs/throttler";
import { deviceIdValidationModel } from "../../dtos/security.dto";
import { UserDevicesDataClass } from "../../schemas/users.schema";
import { CommandBus } from "@nestjs/cqrs";
import { ReturnAllDevicesCommand } from "../../commands/security/return-all-devices-use-case";
import { TerminateAllDevicesCommand } from "../../commands/security/terminate-all-devices-use-case";
import { CheckAccessRightsCommand } from "../../commands/security/check-access-rights-use-case";
import { SecurityService } from "./security.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("SecurityDevices")
@SkipThrottle()
@Controller("security")
export class SecurityController {
    constructor(private commandBus: CommandBus, private securityService: SecurityService) {}

    @ApiOperation({ summary: "Returns all devices with active sessions for current user" })
    @ApiResponse({ status: 200, description: "Success", type: [UserDevicesDataClass] })
    @ApiResponse({ status: 401, description: "If the JWT refreshToken inside cookie is missing, expired or incorrect" })
    @UseGuards(JwtRefreshTokenAuthGuard)
    @Get("/devices")
    @HttpCode(200)
    async devices(
        @CurrentUser() userWithDeviceData: CurrentUserWithDevicesDataModel,
        @Res({ passthrough: true }) response: Response,
    ): Promise<UserDevicesDataClass[]> {
        return await this.commandBus.execute(new ReturnAllDevicesCommand(userWithDeviceData));
    }

    @ApiOperation({ summary: "Terminate all other (exclude current) device's sessions" })
    @ApiResponse({ status: 204, description: "No Content" })
    @ApiResponse({ status: 401, description: "If the JWT refreshToken inside cookie is missing, expired or incorrect" })
    @UseGuards(JwtRefreshTokenAuthGuard)
    @Delete("/devices")
    @HttpCode(204)
    async terminateAllDevices(
        @CurrentUser() userWithDeviceData: CurrentUserWithDevicesDataModel,
        @Res({ passthrough: true }) response: Response,
    ): Promise<boolean> {
        return await this.commandBus.execute(new TerminateAllDevicesCommand(userWithDeviceData));
    }

    @ApiOperation({ summary: "Terminate specified device session" })
    @ApiResponse({ status: 204, description: "No Content" })
    @ApiResponse({ status: 401, description: "If the JWT refreshToken inside cookie is missing, expired or incorrect" })
    @ApiResponse({ status: 403, description: "If try to delete the deviceId of other user" })
    @ApiResponse({ status: 404, description: "Not found" })
    @UseGuards(JwtRefreshTokenAuthGuard)
    @Delete("/devices/:deviceId")
    @HttpCode(204)
    async terminateSpecificDevice(
        @Param() params: deviceIdValidationModel,
        @CurrentUser() userWithDeviceData: CurrentUserWithDevicesDataModel,
        @Res({ passthrough: true }) response: Response,
    ): Promise<boolean> {
        const correct = await this.commandBus.execute(
            new CheckAccessRightsCommand(userWithDeviceData, params.deviceId),
        );
        if (!correct) throw new HttpException("Access denied", 403);
        const deviceTerminated = await this.securityService.terminateSpecificDevice(
            userWithDeviceData.id,
            params.deviceId,
        );
        if (deviceTerminated) {
            return true;
        }
    }
}
