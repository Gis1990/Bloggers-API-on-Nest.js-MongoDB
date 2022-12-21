// import { Controller, Request, Response, Get, Post, Delete, Param } from "@nestjs/common";
// import { SecurityService } from "./security.service";
// import { userDevicesDataClass } from "../users/entities/users.entity";
//
// @Controller("security")
// export class SecurityController {
//     constructor(private readonly securityService: SecurityService) {}
//
//     @Get("/devices")
//     async devices(@Request() req: Request, @Response() res: Response): Promise<userDevicesDataClass[]> {
//         return await this.securityService.returnAllDevices(req.cookies.refreshToken);
//     }
//
//     @Post("/devices")
//     async terminateAllDevices(@Request() req: Request, @Response() res: Response): Promise<boolean> {
//         return await this.securityService.terminateAllDevices(req.cookies.refreshToken);
//     }
//
//     @Delete("/devices/:deviceId")
//     async terminateSpecificDevice(
//         @Request() req: Request,
//         @Response() res: Response,
//         @Param("deviceId") deviceId: string,
//     ) {
//         const exist = await this.securityService.authCredentialsCheck(req.cookies.refreshToken);
//         if (!exist) {
//             res.sendStatus(401);
//             return;
//         }
//         const correct = await this.securityService.checkAccessRights(req.cookies.refreshToken, deviceId);
//         if (!correct) {
//             res.sendStatus(403);
//             return;
//         }
//         const deviceTerminated = await this.securityService.terminateSpecificDevice(req.cookies.refreshToken, deviceId);
//         if (deviceTerminated) {
//             res.sendStatus(204);
//         } else {
//             res.sendStatus(401);
//         }
//     }
// }
