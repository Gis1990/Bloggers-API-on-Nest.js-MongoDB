import { Module } from "@nestjs/common";
import { SecurityService } from "./security.service";
import { SecurityController } from "./security.controller";
import { UsersQueryRepository } from "../users/users.query.repository";
import { UsersRepository } from "../users/users.repository";
import { IsDeviceIdExistConstraint } from "./security.devices.custom.decorators";

@Module({
    controllers: [SecurityController],
    providers: [SecurityService, UsersQueryRepository, UsersRepository, IsDeviceIdExistConstraint],
})
export class SecurityModule {}
