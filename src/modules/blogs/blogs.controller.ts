import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { BlogsIdValidationModel, ModelForGettingAllBlogs } from "../../dtos/blogs.dto";
import { BlogViewModelClassPagination } from "../../entities/blogs.entity";
import { ModelForGettingAllPosts } from "../../dtos/posts.dto";
import { CurrentUserId } from "../../decorators/auth/auth.custom.decorators";
import { strategyForUnauthorizedUser } from "../../guards/strategy-for-unauthorized-user-guard";
import { SkipThrottle } from "@nestjs/throttler";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { GetAllBlogsCommand } from "../../queries/blogs/get-all-blogs-query";
import { GetBlogByIdWithCorrectViewModelCommand } from "../../queries/blogs/get-blog-by-id-with-correct-view-model-query";
import { GetAllPostsForSpecificBlogCommand } from "../../queries/posts/get-all-posts-for-specific-blog-query";

@SkipThrottle()
@Controller("blogs")
export class BlogsController {
    constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

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
