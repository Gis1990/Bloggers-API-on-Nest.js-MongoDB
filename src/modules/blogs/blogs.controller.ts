import { Controller, Delete, Get, HttpCode, Param, Post, Query, UseGuards } from "@nestjs/common";
import { BlogsIdValidationModel, ModelForGettingAllBlogs } from "../../dtos/blogs.dto";
import { BlogViewModelClass, BlogViewModelClassPagination } from "../../entities/blogs.entity";
import { ModelForGettingAllPosts } from "../../dtos/posts.dto";
import { CurrentUser, CurrentUserId } from "../../decorators/auth/auth.custom.decorators";
import { strategyForUnauthorizedUser } from "../../guards/strategy-for-unauthorized-user-guard";
import { SkipThrottle } from "@nestjs/throttler";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { GetAllBlogsCommand } from "../../queries/blogs/get-all-blogs-query";
import { GetBlogByIdWithCorrectViewModelCommand } from "../../queries/blogs/get-blog-by-id-with-correct-view-model-query";
import { GetAllPostsForSpecificBlogCommand } from "../../queries/posts/get-all-posts-for-specific-blog-query";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CurrentUserModel } from "../../dtos/auth.dto";
import { JwtAccessTokenAuthGuard } from "../../guards/jwtAccessToken-auth.guard";
import { SubscribeUserForBlogCommand } from "../../commands/blogs/subscribe-user-for-blog-use-case";
import { UnsubscribeUserForBlogCommand } from "../../commands/blogs/unsubscribe-user-for-blog-use-case";

@ApiTags("Blogs")
@SkipThrottle()
@Controller("blogs")
export class BlogsController {
    constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

    @ApiOperation({ summary: "Subscribe user to blog. Notifications about new posts will be send to Telegram Bot" })
    @ApiResponse({ status: 204, description: "No content" })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @ApiResponse({ status: 404, description: "Not found" })
    @ApiBearerAuth()
    @UseGuards(JwtAccessTokenAuthGuard)
    @Post("/:id/subscription")
    @HttpCode(204)
    async subscribeUserForBlog(
        @Param() params: BlogsIdValidationModel,
        @CurrentUser() user: CurrentUserModel,
    ): Promise<boolean> {
        return await this.commandBus.execute(new SubscribeUserForBlogCommand(user.id, params.id));
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: "Subscribe user to blog. Notifications about new posts will be send to Telegram Bot" })
    @ApiResponse({ status: 204, description: "No content" })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @ApiResponse({ status: 404, description: "Not found" })
    @UseGuards(JwtAccessTokenAuthGuard)
    @Delete("/:id/subscription")
    @HttpCode(204)
    async unsubscribeUserForBlog(
        @Param() params: BlogsIdValidationModel,
        @CurrentUser() user: CurrentUserModel,
    ): Promise<boolean> {
        return await this.commandBus.execute(new UnsubscribeUserForBlogCommand(user.id, params.id));
    }

    @ApiOperation({ summary: "Returns blogs with paging" })
    @ApiResponse({ status: 200, description: "Success", type: BlogViewModelClassPagination })
    @UseGuards(strategyForUnauthorizedUser)
    @Get()
    async getAllBlogs(
        @Query()
        dto: ModelForGettingAllBlogs,
        @CurrentUserId() userId: string,
    ): Promise<BlogViewModelClassPagination> {
        return await this.queryBus.execute(new GetAllBlogsCommand(dto, userId));
    }

    @ApiOperation({ summary: "Returns blog by id" })
    @ApiResponse({ status: 200, description: "Success", type: BlogViewModelClass })
    @ApiResponse({ status: 404, description: "Not found" })
    @UseGuards(strategyForUnauthorizedUser)
    @Get(":id")
    async getBlogById(
        @Param() params: BlogsIdValidationModel,
        @CurrentUserId() userId: string,
    ): Promise<BlogViewModelClass> {
        return await this.queryBus.execute(new GetBlogByIdWithCorrectViewModelCommand(params.id, userId));
    }

    @ApiOperation({ summary: "Returns all posts for specified blog" })
    @ApiResponse({ status: 200, description: "Success", type: BlogViewModelClassPagination })
    @UseGuards(strategyForUnauthorizedUser)
    @Get("/:id/posts")
    async getAllPostsForSpecificBlog(
        @Param() params: BlogsIdValidationModel,
        @Query() model: ModelForGettingAllPosts,
        @CurrentUserId() userId: string,
    ): Promise<BlogViewModelClassPagination> {
        return await this.queryBus.execute(new GetAllPostsForSpecificBlogCommand(model, params.id, userId));
    }
}
