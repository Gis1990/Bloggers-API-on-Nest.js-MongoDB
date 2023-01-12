import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { BlogsIdValidationModel, ModelForGettingAllBlogs } from "../blogs/dto/blogs.dto";
import { BlogDBPaginationClass } from "../blogs/entities/blogs.entity";
import { BasicAuthGuard } from "../../guards/basic-auth.guard";
import { SkipThrottle } from "@nestjs/throttler";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import {
    InputModelForBanUnbanUser,
    InputModelForCreatingNewUser,
    ModelForGettingAllUsers,
    UsersIdValidationModel,
} from "./users/dto/users.dto";
import { BindUserWithBlogCommand } from "./users/use-cases/bind-user-with-blog-use-case";
import { UserViewModelClass, UserDBClassPagination } from "./users/entities/users.entity";
import { CreateUserWithoutConfirmationEmailCommand } from "../auth/use-cases/create-user-without-confirmation-email-use-case";
import { DeleteUserCommand } from "./users/use-cases/delete-user-use-case";
import { BanUnbanUserCommand } from "./users/use-cases/ban-unban-user-use-case";
import { GetAllBlogsWithAdditionalInfoCommand } from "../blogs/use-cases/queries/get-all-blogs-with-additional-info-query";
import { GetAllUsersCommand } from "./users/use-cases/queries/get-all-users-query";

@SkipThrottle()
@Controller("sa")
export class SuperAdminController {
    constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

    @UseGuards(BasicAuthGuard)
    @Get("/blogs")
    async getAllBlogs(
        @Query()
        dto: ModelForGettingAllBlogs,
    ): Promise<BlogDBPaginationClass> {
        return await this.queryBus.execute(new GetAllBlogsWithAdditionalInfoCommand(dto));
    }

    @UseGuards(BasicAuthGuard)
    @Put(":blogId/bind-with-user/:userId")
    @HttpCode(204)
    async bindUserWithBlog(
        @Param("blogId") blogId: BlogsIdValidationModel,
        @Param("userId") userId: UsersIdValidationModel,
    ): Promise<boolean> {
        return await this.commandBus.execute(new BindUserWithBlogCommand(blogId.toString(), userId.toString()));
    }

    @UseGuards(BasicAuthGuard)
    @Put("/users/:id/ban")
    @HttpCode(204)
    async banUnbanUser(
        @Body() dto: InputModelForBanUnbanUser,
        @Param() param: UsersIdValidationModel,
    ): Promise<boolean> {
        return await this.commandBus.execute(new BanUnbanUserCommand(dto.isBanned, dto.banReason, param.id));
    }

    @UseGuards(BasicAuthGuard)
    @Get("/users")
    async getAllUsers(
        @Query()
        dto: ModelForGettingAllUsers,
    ): Promise<UserDBClassPagination> {
        return await this.queryBus.execute(new GetAllUsersCommand(dto));
    }

    @UseGuards(BasicAuthGuard)
    @Post("/users")
    async createUser(@Body() dto: InputModelForCreatingNewUser): Promise<UserViewModelClass> {
        return await this.commandBus.execute(new CreateUserWithoutConfirmationEmailCommand(dto));
    }

    @UseGuards(BasicAuthGuard)
    @Delete("/users/:id")
    @HttpCode(204)
    async deleteUser(@Param() param: UsersIdValidationModel): Promise<boolean> {
        return await this.commandBus.execute(new DeleteUserCommand(param.id));
    }
}
