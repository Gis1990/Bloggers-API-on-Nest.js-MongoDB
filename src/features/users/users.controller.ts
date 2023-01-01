import { Body, Controller, Delete, Get, Post, Query, Param, HttpCode, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { InputModelForCreatingNewUser, ModelForGettingAllUsers, UsersIdValidationModel } from "./dto/users.dto";
import { NewUserClassResponseModel, UserDBClassPagination } from "./entities/users.entity";
import { BasicAuthGuard } from "../auth/guards/basic-auth.guard";
import { UsersQueryRepository } from "./users.query.repository";
import { SkipThrottle } from "@nestjs/throttler";
import { AuthService } from "../auth/auth.service";

@SkipThrottle()
@Controller("users")
export class UsersController {
    constructor(
        protected usersService: UsersService,
        protected usersQueryRepository: UsersQueryRepository,
        protected authService: AuthService,
    ) {}

    @Get()
    async getAllUsers(
        @Query()
        dto: ModelForGettingAllUsers,
    ): Promise<UserDBClassPagination> {
        return await this.usersQueryRepository.getAllUsers(dto);
    }

    // @UseGuards(BasicAuthGuard)
    @Post()
    async createUser(@Body() dto: InputModelForCreatingNewUser): Promise<NewUserClassResponseModel> {
        return await this.authService.createUserWithoutConfirmationEmail(dto);
    }

    // @UseGuards(BasicAuthGuard)
    @Delete(":id")
    @HttpCode(204)
    async deleteUser(@Param() param: UsersIdValidationModel): Promise<boolean> {
        return await this.usersService.deleteUser(param.id);
    }
}
