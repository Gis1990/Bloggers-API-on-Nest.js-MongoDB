import { Controller, Response, Get, Delete, Param, UseGuards, HttpCode, Res, HttpException } from "@nestjs/common";
import { JwtRefreshTokenAuthGuard } from "../../guards/jwtRefreshToken-auth.guard";
import { CurrentUser } from "../auth/decorators/auth.custom.decorators";
import { CurrentUserWithDevicesDataModel } from "../auth/dto/auth.dto";
import { SkipThrottle } from "@nestjs/throttler";
import { deviceIdValidationModel } from "./dto/security.dto";
import { UserDevicesDataClass } from "../users/users.schema";
import { CommandBus } from "@nestjs/cqrs";
import { ReturnAllDevicesCommand } from "./use-cases/return-all-devices-use-case";
import { TerminateAllDevicesCommand } from "./use-cases/terminate-all-devices-use-case";
import { CheckAccessRightsCommand } from "./use-cases/check-access-rights-use-case";
import { SecurityService } from "./security.service";

@SkipThrottle()
@Controller("security")
export class SecurityController {
    constructor(private commandBus: CommandBus, private securityService: SecurityService) {}

    @UseGuards(JwtRefreshTokenAuthGuard)
    @Get("/devices")
    @HttpCode(200)
    async devices(
        @CurrentUser() userWithDeviceData: CurrentUserWithDevicesDataModel,
        @Res({ passthrough: true }) response: Response,
    ): Promise<UserDevicesDataClass[]> {
        return await this.commandBus.execute(new ReturnAllDevicesCommand(userWithDeviceData));
    }

    @UseGuards(JwtRefreshTokenAuthGuard)
    @Delete(":deviceId")
    @HttpCode(204)
    async terminateAllDevices(
        @CurrentUser() userWithDeviceData: CurrentUserWithDevicesDataModel,
        @Res({ passthrough: true }) response: Response,
    ): Promise<boolean> {
        return await this.commandBus.execute(new TerminateAllDevicesCommand(userWithDeviceData));
    }

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
