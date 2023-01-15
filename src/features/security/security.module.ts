import { Module } from "@nestjs/common";
import { SecurityService } from "./security.service";
import { SecurityController } from "./security.controller";
import { UsersQueryRepository } from "../super-admin/users/users.query.repository";
import { UsersRepository } from "../super-admin/users/users.repository";
import { IsDeviceIdExistConstraint } from "./decorators/security.devices.custom.decorators";
import { MongooseModule } from "@nestjs/mongoose";
import {
    BannedUsersBySuperAdminClass,
    BannedUsersSchema,
    LoginAttemptsClass,
    LoginAttemptsSchema,
    UserAccountClass,
    UsersAccountSchema,
} from "../super-admin/users/users.schema";
import { CheckAccessRightsUseCase } from "./use-cases/check-access-rights-use-case";
import { TerminateAllDevicesUseCase } from "./use-cases/terminate-all-devices-use-case";
import { ReturnAllDevicesUseCase } from "./use-cases/return-all-devices-use-case";
import { CqrsModule } from "@nestjs/cqrs";
import { GetUserByIdQuery } from "../super-admin/users/use-cases/queries/get-user-by-id-query";
import { GetUserByDeviceIdQuery } from "../super-admin/users/use-cases/queries/get-user-by-device-id-query";

const useCases = [CheckAccessRightsUseCase, TerminateAllDevicesUseCase, ReturnAllDevicesUseCase];
const queries = [GetUserByIdQuery, GetUserByDeviceIdQuery];

@Module({
    controllers: [SecurityController],
    providers: [
        SecurityService,
        UsersQueryRepository,
        UsersRepository,
        IsDeviceIdExistConstraint,
        ...useCases,
        ...queries,
    ],
    imports: [
        CqrsModule,
        MongooseModule.forFeature([
            {
                name: UserAccountClass.name,
                schema: UsersAccountSchema,
            },
            {
                name: LoginAttemptsClass.name,
                schema: LoginAttemptsSchema,
            },
            {
                name: BannedUsersBySuperAdminClass.name,
                schema: BannedUsersSchema,
            },
        ]),
    ],
})
export class SecurityModule {}
