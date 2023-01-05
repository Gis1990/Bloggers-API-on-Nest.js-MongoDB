import { Controller, Response, Get, Delete, Param, UseGuards, HttpCode, Res, HttpException } from "@nestjs/common";
import { JwtRefreshTokenAuthGuard } from "../auth/guards/jwtRefreshToken-auth.guard";
import { CurrentUser } from "../auth/auth.cutsom.decorators";
import { CurrentUserWithDevicesDataModel } from "../auth/dto/auth.dto";
import { SkipThrottle } from "@nestjs/throttler";
import { deviceIdValidationModel } from "./dto/security.dto";
import { UserDevicesDataClass } from "../users/users.schema";
import { ReturnAllDevicesUseCase } from "./use-cases/return-all-devices-use-case";
import { TerminateAllDevicesUseCase } from "./use-cases/terminate-all-devices-use-case";
import { TerminateSpecificDeviceUseCase } from "./use-cases/terminate-specific-device-use-case";
import { CheckAccessRightsUseCase } from "./use-cases/check-access-rights-use-case";

@SkipThrottle()
@Controller("security")
export class SecurityController {
    constructor(
        private returnAllDevicesUseCase: ReturnAllDevicesUseCase,
        private terminateAllDevicesUseCase: TerminateAllDevicesUseCase,
        private terminateSpecificDeviceUseCase: TerminateSpecificDeviceUseCase,
        private checkAccessRightsUseCase: CheckAccessRightsUseCase,
    ) {}

    @UseGuards(JwtRefreshTokenAuthGuard)
    @Get("/devices")
    @HttpCode(200)
    async devices(
        @CurrentUser() userWithDeviceData: CurrentUserWithDevicesDataModel,
        @Res({ passthrough: true }) response: Response,
    ): Promise<UserDevicesDataClass[]> {
        return await this.returnAllDevicesUseCase.execute(userWithDeviceData);
    }

    @UseGuards(JwtRefreshTokenAuthGuard)
    @Delete(":deviceId")
    @HttpCode(204)
    async terminateAllDevices(
        @CurrentUser() userWithDeviceData: CurrentUserWithDevicesDataModel,
        @Res({ passthrough: true }) response: Response,
    ): Promise<boolean> {
        return await this.terminateAllDevicesUseCase.execute(userWithDeviceData);
    }

    @UseGuards(JwtRefreshTokenAuthGuard)
    @Delete("/devices/:deviceId")
    @HttpCode(204)
    async terminateSpecificDevice(
        @Param() params: deviceIdValidationModel,
        @CurrentUser() userWithDeviceData: CurrentUserWithDevicesDataModel,
        @Res({ passthrough: true }) response: Response,
    ): Promise<boolean> {
        const correct = await this.checkAccessRightsUseCase.execute(userWithDeviceData, params.deviceId);
        if (!correct) throw new HttpException("Access denied", 403);
        const deviceTerminated = await this.terminateSpecificDeviceUseCase.execute(
            userWithDeviceData.id,
            params.deviceId,
        );
        if (deviceTerminated) {
            return true;
        }
    }
}
