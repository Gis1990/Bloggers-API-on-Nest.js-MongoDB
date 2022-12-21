import { Body, Controller, Delete, Get, Post, Query, UseGuards, Param, HttpCode } from "@nestjs/common";
import { UsersService } from "./users.service";
import { InputModelForCreatingNewUser, ModelForGettingAllUsers, UsersIdValidationModel } from "./dto/users.dto";
import { NewUserClassResponseModel, UserDBClassPagination } from "./entities/users.entity";
import { BasicAuthGuard } from "../auth/guards/basic-auth.guard";

@Controller("users")
export class UsersController {
    constructor(protected usersService: UsersService) {}

    @Get()
    async getAllUsers(
        @Query()
        dto: ModelForGettingAllUsers,
    ): Promise<UserDBClassPagination> {
        return await this.usersService.getAllUsers(dto);
    }

    @UseGuards(BasicAuthGuard)
    @Post()
    async createBlog(@Body() dto: InputModelForCreatingNewUser): Promise<NewUserClassResponseModel> {
        return await this.usersService.createUserWithoutConfirmationEmail(dto);
    }

    @UseGuards(BasicAuthGuard)
    @Delete(":id")
    @HttpCode(204)
    async deleteUser(@Param() param: UsersIdValidationModel): Promise<boolean> {
        return await this.usersService.deleteUser(param.id);
    }
}
