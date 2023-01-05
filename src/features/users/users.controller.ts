import { Body, Controller, Delete, Get, Post, Query, Param, HttpCode, UseGuards } from "@nestjs/common";
import { InputModelForCreatingNewUser, ModelForGettingAllUsers, UsersIdValidationModel } from "./dto/users.dto";
import { NewUserClassResponseModel, UserDBClassPagination } from "./entities/users.entity";
import { BasicAuthGuard } from "../auth/guards/basic-auth.guard";
import { UsersQueryRepository } from "./users.query.repository";
import { SkipThrottle } from "@nestjs/throttler";
import { DeleteUserUseCase } from "./use-cases/delete-user-use-case";
import { CreateUserWithoutConfirmationEmailUseCase } from "../auth/use-cases/create-user-without-confirmation-email-use-case";

@SkipThrottle()
@Controller("users")
export class UsersController {
    constructor(
        private deleteUserUseCase: DeleteUserUseCase,
        private usersQueryRepository: UsersQueryRepository,
        private createUserWithoutConfirmationEmailUseCase: CreateUserWithoutConfirmationEmailUseCase,
    ) {}

    @Get()
    async getAllUsers(
        @Query()
        dto: ModelForGettingAllUsers,
    ): Promise<UserDBClassPagination> {
        return await this.usersQueryRepository.getAllUsers(dto);
    }

    @UseGuards(BasicAuthGuard)
    @Post()
    async createUser(@Body() dto: InputModelForCreatingNewUser): Promise<NewUserClassResponseModel> {
        return await this.createUserWithoutConfirmationEmailUseCase.execute(dto);
    }

    @UseGuards(BasicAuthGuard)
    @Delete(":id")
    @HttpCode(204)
    async deleteUser(@Param() param: UsersIdValidationModel): Promise<boolean> {
        return await this.deleteUserUseCase.execute(param.id);
    }
}
