import { Module } from "@nestjs/common";
import { SecurityService } from "./security.service";
import { SecurityController } from "./security.controller";
import { UsersQueryRepository } from "../users/users.query.repository";
import { UsersRepository } from "../users/users.repository";

@Module({
    controllers: [SecurityController],
    providers: [SecurityService, UsersQueryRepository, UsersRepository],
})
export class SecurityModule {}
