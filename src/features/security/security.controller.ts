import { Body, Controller, Get, UseGuards } from "@nestjs/common";
import { SecurityService } from "./security.service";
import { userDevicesDataClass } from "../users/entities/users.entity";
import { JwtRefreshTokenAuthGuard } from "../auth/guards/jwtRefreshToken-auth.guard";

@Controller("security")
export class SecurityController {
    constructor(protected securityService: SecurityService) {}

    @UseGuards(JwtRefreshTokenAuthGuard)
    @Get("/devices")
    async devices(
        @Body()
        userId: string,
    ): Promise<userDevicesDataClass[]> {
        return await this.securityService.returnAllDevices(userId);
    }
}
