import { Controller, Delete, Get, HttpCode, Param, Post, Query, UseGuards } from "@nestjs/common";
import { BlogsIdValidationModel, ModelForGettingAllBlogs } from "../../dtos/blogs.dto";
import { BlogViewModelClassPagination } from "../../entities/blogs.entity";
import { ModelForGettingAllPosts } from "../../dtos/posts.dto";
import { CurrentUser, CurrentUserId } from "../../decorators/auth/auth.custom.decorators";
import { strategyForUnauthorizedUser } from "../../guards/strategy-for-unauthorized-user-guard";
import { SkipThrottle } from "@nestjs/throttler";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { GetAllBlogsCommand } from "../../queries/blogs/get-all-blogs-query";
import { GetBlogByIdWithCorrectViewModelCommand } from "../../queries/blogs/get-blog-by-id-with-correct-view-model-query";
import { GetAllPostsForSpecificBlogCommand } from "../../queries/posts/get-all-posts-for-specific-blog-query";
import { ApiTags } from "@nestjs/swagger";
import { CurrentUserModel } from "../../dtos/auth.dto";
import { JwtAccessTokenAuthGuard } from "../../guards/jwtAccessToken-auth.guard";
import { SubscribeUserForBlogCommand } from "../../commands/blogs/subscribe-user-for-blog-use-case";
import { UnsubscribeUserForBlogCommand } from "../../commands/blogs/unsubscribe-user-for-blog-use-case";
import process from "process";

@ApiTags("Blogs")
@SkipThrottle()
@Controller("blogs")
export class BlogsController {
    constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

    @UseGuards(JwtAccessTokenAuthGuard)
    @Post("/:id/subscription")
    @HttpCode(204)
    async subscribeUserForBlog(
        @Param() params: BlogsIdValidationModel,
        @CurrentUser() user: CurrentUserModel,
    ): Promise<boolean> {
        return await this.commandBus.execute(new SubscribeUserForBlogCommand(user.id, params.id));
    }

    @UseGuards(JwtAccessTokenAuthGuard)
    @Delete("/:id/subscription")
    @HttpCode(204)
    async unsubscribeUserForBlog(
        @Param() params: BlogsIdValidationModel,
        @CurrentUser() user: CurrentUserModel,
    ): Promise<boolean> {
        return await this.commandBus.execute(new UnsubscribeUserForBlogCommand(user.id, params.id));
    }

    @Get()
    async getAllBlogs(
        @Query()
        dto: ModelForGettingAllBlogs,
    ): Promise<BlogViewModelClassPagination> {
        return await this.queryBus.execute(new GetAllBlogsCommand(dto));
    }

    @Get(":id")
    async getBlogById(@Param() params: BlogsIdValidationModel): Promise<BlogViewModelClassPagination> {
        return await this.queryBus.execute(new GetBlogByIdWithCorrectViewModelCommand(params.id));
    }

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
