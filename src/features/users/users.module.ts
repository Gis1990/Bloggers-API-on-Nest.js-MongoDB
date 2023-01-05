import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { IsEmailExistConstraint, IsLoginExistConstraint, IsUsersIdExistConstraint } from "./users.custom.decorators";
import { UsersRepository } from "./users.repository";
import { JwtModule } from "@nestjs/jwt";
import { BcryptService } from "../../utils/bcrypt/bcrypt.service";
import { BcryptModule } from "../../utils/bcrypt/bcrypt.module";
import { UsersQueryRepository } from "./users.query.repository";
import { MongooseModule } from "@nestjs/mongoose";
import {
    LoginAttemptsClass,
    LoginAttemptsSchema,
    UserAccountDBClass,
    UserAccountEmailClass,
    UserAccountEmailSchema,
    UserDevicesDataClass,
    UserDevicesDataSchema,
    EmailRecoveryCodeClass,
    EmailRecoveryCodeSchema,
    UsersAccountSchema,
} from "./users.schema";
import { AuthService } from "../auth/auth.service";
import { AuthModule } from "../auth/auth.module";
import { DeleteUserUseCase } from "./use-cases/delete-user-use-case";
import { CreateUserUseCase } from "./use-cases/create-user-use-case";
import { CreateUserWithoutConfirmationEmailUseCase } from "../auth/use-cases/create-user-without-confirmation-email-use-case";

const useCases = [DeleteUserUseCase, CreateUserUseCase, CreateUserWithoutConfirmationEmailUseCase];

@Module({
    exports: [UsersModule],
    controllers: [UsersController],
    providers: [
        BcryptService,
        AuthService,
        UsersRepository,
        UsersQueryRepository,
        IsUsersIdExistConstraint,
        IsLoginExistConstraint,
        IsEmailExistConstraint,
        ...useCases,
    ],
    imports: [
        AuthModule,
        BcryptModule,
        JwtModule,
        MongooseModule.forFeature([
            {
                name: UserAccountDBClass.name,
                schema: UsersAccountSchema,
            },
            {
                name: UserAccountEmailClass.name,
                schema: UserAccountEmailSchema,
            },
            {
                name: UserDevicesDataClass.name,
                schema: UserDevicesDataSchema,
            },
            {
                name: EmailRecoveryCodeClass.name,
                schema: EmailRecoveryCodeSchema,
            },
            {
                name: LoginAttemptsClass.name,
                schema: LoginAttemptsSchema,
            },
        ]),
    ],
})
export class UsersModule {}
