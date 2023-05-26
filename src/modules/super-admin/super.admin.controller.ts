import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import {
    APIErrorResult,
    BlogsIdValidationModel,
    BlogsIdValidationModelWhenBlogIsBanned,
    InputModelForBanUnbanBlog,
    ModelForGettingAllBlogs,
} from "../../dtos/blogs.dto";
import { BasicAuthGuard } from "../../guards/basic-auth.guard";
import { SkipThrottle } from "@nestjs/throttler";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import {
    InputModelForBanUnbanUser,
    InputModelForCreatingNewUser,
    ModelForGettingAllUsers,
    UsersIdValidationModel,
} from "../../dtos/users.dto";
import { BindUserWithBlogCommand } from "../../commands/users/bind-user-with-blog-use-case";
import { UserViewModelClass, UserViewModelClassPagination } from "../../entities/users.entity";
import { CreateUserWithoutConfirmationEmailCommand } from "../../commands/auth/create-user-without-confirmation-email-use-case";
import { DeleteUserCommand } from "../../commands/users/delete-user-use-case";
import { BanUnbanUserBySuperAdminCommand } from "../../commands/users/ban-unban-user-by-super-admin-use-case";
import { GetAllBlogsForSuperAdminCommand } from "../../queries/blogs/get-all-blogs-for-super-admin-query";
import { GetAllUsersCommand } from "../../queries/users/get-all-users-query";
import { BanUnbanBlogBySuperAdminCommand } from "../../commands/blogs/ban-unban-blog-by-super-admin-use-case";
import { BlogViewModelForAdminPaginationClass } from "../../entities/blogs.entity";
import {
    InputModelForCreatingAndUpdatingQuestion,
    InputModelForPublishUnpublishQuestion,
    ModelForGettingAllQuestions,
    QuestionIdValidationModel,
} from "../../dtos/quiz.dto";
import { CreateQuestionCommand } from "../../commands/quiz/create-question-use-case";
import { QuestionViewModelClass, QuestionViewModelPaginationClass } from "../../entities/quiz.entity";
import { GetAllQuestionsCommand } from "../../queries/quiz/get-all-questions-query";
import { DeleteQuestionCommand } from "../../commands/quiz/delete-question-use-case";
import { UpdateQuestionCommand } from "../../commands/quiz/update-question-use-case";
import { PublishUnpublishQuestionCommand } from "../../commands/quiz/publish-unpublish-question-use-case";
import { ApiBasicAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@SkipThrottle()
@ApiResponse({ status: 401, description: "Unauthorized" })
@Controller("sa")
export class SuperAdminController {
    constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

    @ApiBasicAuth()
    @ApiTags("Blogs")
    @ApiOperation({ summary: "Ban/Unban blog" })
    @ApiResponse({ status: 204, description: "No content" })
    @ApiResponse({
        status: 400,
        description: "If the inputModel has incorrect values",
        type: APIErrorResult,
    })
    @UseGuards(BasicAuthGuard)
    @Put("/blogs/:id/ban")
    @HttpCode(204)
    async banUnbanBlog(
        @Param() param: BlogsIdValidationModelWhenBlogIsBanned,
        @Body() dto: InputModelForBanUnbanBlog,
    ): Promise<boolean> {
        return await this.commandBus.execute(new BanUnbanBlogBySuperAdminCommand(dto.isBanned, param.id));
    }

    @ApiBasicAuth()
    @ApiTags("Blogs")
    @ApiOperation({ summary: "Returns blogs with paging" })
    @ApiResponse({ status: 200, description: "Success", type: BlogViewModelForAdminPaginationClass })
    @UseGuards(BasicAuthGuard)
    @Get("/blogs")
    async getAllBlogsForSuperAdmin(
        @Query()
        dto: ModelForGettingAllBlogs,
    ): Promise<BlogViewModelForAdminPaginationClass> {
        return await this.queryBus.execute(new GetAllBlogsForSuperAdminCommand(dto));
    }

    @ApiBasicAuth()
    @ApiTags("Blogs")
    @ApiOperation({ summary: "Bind Blog with user (if blog doesn't have an owner yet)" })
    @ApiResponse({ status: 204, description: "No content" })
    @ApiResponse({
        status: 400,
        description: "If the inputModel has incorrect values",
        type: APIErrorResult,
    })
    @UseGuards(BasicAuthGuard)
    @Put(":blogId/bind-with-user/:userId")
    @HttpCode(204)
    async bindUserWithBlog(
        @Param("blogId") blogId: BlogsIdValidationModel,
        @Param("userId") userId: UsersIdValidationModel,
    ): Promise<boolean> {
        return await this.commandBus.execute(new BindUserWithBlogCommand(blogId.toString(), userId.toString()));
    }

    @ApiBasicAuth()
    @ApiTags("Users")
    @ApiOperation({ summary: "Ban/Unban user" })
    @ApiResponse({ status: 204, description: "No Content" })
    @ApiResponse({
        status: 400,
        description: "If the inputModel has incorrect values",
        type: APIErrorResult,
    })
    @UseGuards(BasicAuthGuard)
    @Put("/users/:id/ban")
    @HttpCode(204)
    async banUnbanUserBySuperAdmin(
        @Body() dto: InputModelForBanUnbanUser,
        @Param() param: UsersIdValidationModel,
    ): Promise<boolean> {
        return await this.commandBus.execute(
            new BanUnbanUserBySuperAdminCommand(dto.isBanned, dto.banReason, param.id),
        );
    }

    @ApiBasicAuth()
    @ApiTags("Users")
    @ApiOperation({ summary: "Returns all users" })
    @ApiResponse({ status: 200, description: "Success", type: UserViewModelClassPagination })
    @UseGuards(BasicAuthGuard)
    @Get("/users")
    async getAllUsers(
        @Query()
        dto: ModelForGettingAllUsers,
    ): Promise<UserViewModelClassPagination> {
        return await this.queryBus.execute(new GetAllUsersCommand(dto));
    }

    @ApiBasicAuth()
    @ApiTags("Users")
    @ApiOperation({ summary: "Add a new user to the system" })
    @ApiResponse({
        status: 201,
        description: "Returns the newly created user",
        type: UserViewModelClass,
    })
    @ApiResponse({
        status: 400,
        description: "If the inputModel has incorrect values",
        type: APIErrorResult,
    })
    @UseGuards(BasicAuthGuard)
    @Post("/users")
    async createUser(@Body() dto: InputModelForCreatingNewUser): Promise<UserViewModelClass> {
        return await this.commandBus.execute(new CreateUserWithoutConfirmationEmailCommand(dto));
    }

    @ApiBasicAuth()
    @ApiTags("Users")
    @ApiOperation({ summary: "Delete user specified by Id " })
    @ApiResponse({ status: 204, description: "No content" })
    @ApiResponse({ status: 404, description: "If specified user is not exists" })
    @UseGuards(BasicAuthGuard)
    @Delete("/users/:id")
    @HttpCode(204)
    async deleteUser(@Param() param: UsersIdValidationModel): Promise<boolean> {
        return await this.commandBus.execute(new DeleteUserCommand(param.id));
    }

    @ApiBasicAuth()
    @ApiTags("QuizQuestions")
    @ApiOperation({ summary: "Returns all questions with pagination and filtering" })
    @ApiResponse({ status: 200, description: "Success", type: QuestionViewModelPaginationClass })
    @UseGuards(BasicAuthGuard)
    @Get("/quiz/questions")
    async getAllQuestions(
        @Query()
        dto: ModelForGettingAllQuestions,
    ): Promise<QuestionViewModelPaginationClass> {
        return await this.queryBus.execute(new GetAllQuestionsCommand(dto));
    }

    @ApiBasicAuth()
    @ApiTags("QuizQuestions")
    @ApiOperation({ summary: "Create question" })
    @ApiResponse({ status: 201, description: "Created", type: QuestionViewModelClass })
    @ApiResponse({
        status: 400,
        description: "If the inputModel has incorrect values",
        type: APIErrorResult,
    })
    @UseGuards(BasicAuthGuard)
    @Post("/quiz/questions")
    async createQuestion(@Body() dto: InputModelForCreatingAndUpdatingQuestion): Promise<QuestionViewModelClass> {
        return await this.commandBus.execute(new CreateQuestionCommand(dto));
    }

    @ApiBasicAuth()
    @ApiTags("QuizQuestions")
    @ApiOperation({ summary: "Delete question" })
    @ApiResponse({ status: 204, description: "No content" })
    @ApiResponse({ status: 404, description: "Not found" })
    @UseGuards(BasicAuthGuard)
    @Delete("/quiz/questions/:id")
    @HttpCode(204)
    async deleteQuestion(@Param() param: QuestionIdValidationModel): Promise<boolean> {
        return await this.commandBus.execute(new DeleteQuestionCommand(param.id));
    }

    @ApiBasicAuth()
    @ApiTags("QuizQuestions")
    @ApiOperation({ summary: "Update question" })
    @ApiResponse({ status: 204, description: "No content" })
    @ApiResponse({
        status: 400,
        description: "If the inputModel has incorrect values",
        type: APIErrorResult,
    })
    @ApiResponse({ status: 404, description: "Not found" })
    @UseGuards(BasicAuthGuard)
    @Put("/quiz/questions/:id")
    @HttpCode(204)
    async updateQuestion(
        @Body() dto: InputModelForCreatingAndUpdatingQuestion,
        @Param() param: QuestionIdValidationModel,
    ): Promise<boolean> {
        return await this.commandBus.execute(new UpdateQuestionCommand(dto, param.id));
    }

    @ApiBasicAuth()
    @ApiTags("QuizQuestions")
    @ApiOperation({ summary: "Publish/Unpublish question" })
    @ApiResponse({ status: 204, description: "No content" })
    @ApiResponse({
        status: 400,
        description: "If the inputModel has incorrect values",
        type: APIErrorResult,
    })
    @UseGuards(BasicAuthGuard)
    @Put("/quiz/questions/:id/publish")
    @HttpCode(204)
    async publishUnpublishQuestion(
        @Body() dto: InputModelForPublishUnpublishQuestion,
        @Param() param: QuestionIdValidationModel,
    ): Promise<boolean> {
        return await this.commandBus.execute(new PublishUnpublishQuestionCommand(dto, param.id));
    }
}
