import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { IsEmailExistConstraint, IsLoginExistConstraint, IsUsersIdExistConstraint } from "./users.custom.decorators";
import { UsersRepository } from "./users.repository";
import { JwtModule } from "@nestjs/jwt";
import { BcryptService } from "../../utils/bcrypt/bcrypt.service";
import { BcryptModule } from "../../utils/bcrypt/bcrypt.module";

@Module({
    exports: [UsersModule],
    controllers: [UsersController],
    providers: [
        BcryptService,
        UsersService,
        UsersRepository,
        IsUsersIdExistConstraint,
        IsLoginExistConstraint,
        IsEmailExistConstraint,
    ],
    imports: [BcryptModule, JwtModule],
})
export class UsersModule {}
