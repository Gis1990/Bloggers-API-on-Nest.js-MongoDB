import { Module } from "@nestjs/common";
import { SecurityService } from "./security.service";
import { SecurityController } from "./security.controller";
import { UsersQueryRepository } from "../users/users.query.repository";
import { UsersRepository } from "../users/users.repository";
import { IsDeviceIdExistConstraint } from "./security.devices.custom.decorators";
import { MongooseModule } from "@nestjs/mongoose";
import { LoginAttemptsClass, LoginAttemptsSchema, UserAccountDBClass, UsersAccountSchema } from "../users/users.schema";
import { CheckAccessRightsUseCase } from "./use-cases/check-access-rights-use-case";
import { TerminateAllDevicesUseCase } from "./use-cases/terminate-all-devices-use-case";
import { ReturnAllDevicesUseCase } from "./use-cases/return-all-devices-use-case";
import { CqrsModule } from "@nestjs/cqrs";

const useCases = [CheckAccessRightsUseCase, TerminateAllDevicesUseCase, ReturnAllDevicesUseCase];

@Module({
    controllers: [SecurityController],
    providers: [SecurityService, UsersQueryRepository, UsersRepository, IsDeviceIdExistConstraint, ...useCases],
    imports: [
        CqrsModule,
        MongooseModule.forFeature([
            {
                name: UserAccountDBClass.name,
                schema: UsersAccountSchema,
            },
            {
                name: LoginAttemptsClass.name,
                schema: LoginAttemptsSchema,
            },
        ]),
    ],
})
export class SecurityModule {}
