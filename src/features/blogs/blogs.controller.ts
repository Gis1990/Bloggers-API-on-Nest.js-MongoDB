import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import {
    BlogsIdValidationModel,
    InputModelForCreatingBlog,
    InputModelForUpdatingBlog,
    ModelForGettingAllBlogs,
} from "./dto/blogs.dto";
import { BlogViewModelClass, BlogDBPaginationClass } from "./entities/blogs.entity";
import { PostDBPaginationClass, PostViewModelClass } from "../posts/entities/posts.entity";
import { InputModelForCreatingNewPostForSpecificBlog, ModelForGettingAllPosts } from "../posts/dto/posts.dto";
import { BlogsQueryRepository } from "./blogs.query.repository";
import { BasicAuthGuard } from "../auth/guards/basic-auth.guard";
import { CurrentUserId } from "../auth/auth.cutsom.decorators";
import { strategyForUnauthorizedUser } from "../auth/guards/strategy-for-unauthorized-user-guard";
import { SkipThrottle } from "@nestjs/throttler";
import { BlogDBClass } from "./blogs.schema";
import { PostsQueryRepository } from "../posts/posts.query.repository";
import { UpdateBlogCommand } from "./use-cases/update-blog-use-case";
import { CreateBlogCommand } from "./use-cases/create-blog-use-case";
import { DeleteBlogCommand } from "./use-cases/delete-blog-use-case";
import { CommandBus } from "@nestjs/cqrs";
import { CreatePostCommand } from "../posts/use-cases/create-post-use-case";

@SkipThrottle()
@Controller("blogs")
export class BlogsController {
    constructor(
        private commandBus: CommandBus,
        private blogsQueryRepository: BlogsQueryRepository,
        private postsQueryRepository: PostsQueryRepository,
    ) {}

    @Get()
    async getAllBlogs(
        @Query()
        dto: ModelForGettingAllBlogs,
    ): Promise<BlogDBPaginationClass> {
        return await this.blogsQueryRepository.getAllBlogs(dto);
    }

    @Get(":id")
    async getBlog(@Param() params: BlogsIdValidationModel): Promise<BlogDBClass> {
        return await this.blogsQueryRepository.getBlogById(params.id);
    }

    @UseGuards(BasicAuthGuard)
    @Post()
    async createBlog(@Body() dto: InputModelForCreatingBlog): Promise<BlogViewModelClass> {
        return await this.commandBus.execute(new CreateBlogCommand(dto));
    }

    @UseGuards(BasicAuthGuard)
    @Put(":id")
    @HttpCode(204)
    async updateBlog(
        @Param() params: BlogsIdValidationModel,
        @Body() dto: InputModelForUpdatingBlog,
    ): Promise<boolean> {
        return await this.commandBus.execute(new UpdateBlogCommand(params.id, dto));
    }

    @UseGuards(BasicAuthGuard)
    @Delete(":id")
    @HttpCode(204)
    async deleteBlog(@Param() params: BlogsIdValidationModel): Promise<boolean> {
        return await this.commandBus.execute(new DeleteBlogCommand(params.id));
    }

    @UseGuards(strategyForUnauthorizedUser)
    @Get("/:id/posts")
    async getAllPostsForSpecificBlog(
        @Param() params: BlogsIdValidationModel,
        @Query() model: ModelForGettingAllPosts,
        @CurrentUserId() userId: string,
    ): Promise<PostDBPaginationClass> {
        return await this.postsQueryRepository.getAllPostsForSpecificBlog(model, params.id, userId);
    }

    @UseGuards(BasicAuthGuard)
    @Post("/:id/posts")
    async createNewPostForSpecificBlog(
        @Param() params: BlogsIdValidationModel,
        @Body() model: InputModelForCreatingNewPostForSpecificBlog,
    ): Promise<PostViewModelClass> {
        const dto = { ...model, blogId: params.id };
        return await this.commandBus.execute(new CreatePostCommand(dto));
    }
}
