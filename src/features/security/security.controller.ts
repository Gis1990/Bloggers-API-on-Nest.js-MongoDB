import { Controller, Response, Get, Delete, Param, UseGuards, HttpCode, Res } from "@nestjs/common";
import { SecurityService } from "./security.service";
import { userDevicesDataClass } from "../users/entities/users.entity";
import { JwtRefreshTokenAuthGuard } from "../auth/guards/jwtRefreshToken-auth.guard";
import { CurrentUser } from "../auth/auth.cutsom.decorators";
import { CurrentUserWithDevicesDataModel } from "../auth/dto/auth.dto";
import { SkipThrottle } from "@nestjs/throttler";
import { deviceIdValidationModel } from "./dto/security.dto";

@SkipThrottle()
@Controller("security")
export class SecurityController {
    constructor(private readonly securityService: SecurityService) {}

    @UseGuards(JwtRefreshTokenAuthGuard)
    @Get("/devices")
    @HttpCode(200)
    async devices(
        @CurrentUser() userWithDeviceData: CurrentUserWithDevicesDataModel,
        @Res({ passthrough: true }) response: Response,
    ): Promise<userDevicesDataClass[]> {
        return await this.securityService.returnAllDevices(userWithDeviceData);
    }

    @UseGuards(JwtRefreshTokenAuthGuard)
    @Delete("/devices")
    @HttpCode(204)
    async terminateAllDevices(
        @CurrentUser() userWithDeviceData: CurrentUserWithDevicesDataModel,
        @Res({ passthrough: true }) response: Response,
    ): Promise<boolean> {
        return await this.securityService.terminateAllDevices(userWithDeviceData);
    }

    @UseGuards(JwtRefreshTokenAuthGuard)
    @Delete("/devices/:deviceId")
    @HttpCode(204)
    async terminateSpecificDevice(
        @Param() params: deviceIdValidationModel,
        @CurrentUser() userWithDeviceData: CurrentUserWithDevicesDataModel,
        @Res({ passthrough: true }) response: Response,
        @Param("deviceId") deviceId: string,
    ): Promise<boolean> {
        const correct = await this.securityService.checkAccessRights(userWithDeviceData, deviceId);
        if (!correct) {
            return false;
        }
        const deviceTerminated = await this.securityService.terminateSpecificDevice(userWithDeviceData, deviceId);
        if (deviceTerminated) {
            return true;
        }
    }
}
