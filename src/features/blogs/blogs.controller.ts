import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { BlogsIdValidationModel, ModelForGettingAllBlogs } from "./dto/blogs.dto";
import { BlogClassPagination, BlogViewModelClass } from "./entities/blogs.entity";
import { PostClassPagination } from "../posts/entities/posts.entity";
import { ModelForGettingAllPosts } from "../posts/dto/posts.dto";
import { CurrentUserId } from "../auth/decorators/auth.custom.decorators";
import { strategyForUnauthorizedUser } from "../../guards/strategy-for-unauthorized-user-guard";
import { SkipThrottle } from "@nestjs/throttler";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { GetAllBlogsCommand } from "./use-cases/queries/get-all-blogs-query";
import { GetBlogByIdWithCorrectViewModelCommand } from "./use-cases/queries/get-blog-by-id-with-correct-view-model-query";
import { GetAllPostsForSpecificBlogCommand } from "../posts/use-cases/queries/get-all-posts-for-specific-blog-query";

@SkipThrottle()
@Controller("blogs")
export class BlogsController {
    constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

    @Get()
    async getAllBlogs(
        @Query()
        dto: ModelForGettingAllBlogs,
    ): Promise<BlogClassPagination> {
        return await this.queryBus.execute(new GetAllBlogsCommand(dto));
    }

    @Get(":id")
    async getBlogById(@Param() params: BlogsIdValidationModel): Promise<BlogViewModelClass> {
        return await this.queryBus.execute(new GetBlogByIdWithCorrectViewModelCommand(params.id));
    }

    @UseGuards(strategyForUnauthorizedUser)
    @Get("/:id/posts")
    async getAllPostsForSpecificBlog(
        @Param() params: BlogsIdValidationModel,
        @Query() model: ModelForGettingAllPosts,
        @CurrentUserId() userId: string,
    ): Promise<PostClassPagination> {
        return await this.queryBus.execute(new GetAllPostsForSpecificBlogCommand(model, params.id, userId));
    }
}
