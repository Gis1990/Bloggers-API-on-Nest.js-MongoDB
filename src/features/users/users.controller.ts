import { Body, Controller, Delete, Get, Post, Query, Param, HttpCode, UseGuards } from "@nestjs/common";
import { InputModelForCreatingNewUser, ModelForGettingAllUsers, UsersIdValidationModel } from "./dto/users.dto";
import { UserViewModelClass, UserDBClassPagination } from "./entities/users.entity";
import { BasicAuthGuard } from "../../guards/basic-auth.guard";
import { UsersQueryRepository } from "./users.query.repository";
import { SkipThrottle } from "@nestjs/throttler";
import { CreateUserWithoutConfirmationEmailCommand } from "../auth/use-cases/create-user-without-confirmation-email-use-case";
import { CommandBus } from "@nestjs/cqrs";
import { DeleteUserCommand } from "./use-cases/delete-user-use-case";

@SkipThrottle()
@Controller("users")
export class UsersController {
    constructor(private commandBus: CommandBus, private usersQueryRepository: UsersQueryRepository) {}

    @Get()
    async getAllUsers(
        @Query()
        dto: ModelForGettingAllUsers,
    ): Promise<UserDBClassPagination> {
        return await this.usersQueryRepository.getAllUsers(dto);
    }

    @UseGuards(BasicAuthGuard)
    @Post()
    async createUser(@Body() dto: InputModelForCreatingNewUser): Promise<UserViewModelClass> {
        return await this.commandBus.execute(new CreateUserWithoutConfirmationEmailCommand(dto));
    }

    @UseGuards(BasicAuthGuard)
    @Delete(":id")
    @HttpCode(204)
    async deleteUser(@Param() param: UsersIdValidationModel): Promise<boolean> {
        return await this.commandBus.execute(new DeleteUserCommand(param.id));
    }
}
