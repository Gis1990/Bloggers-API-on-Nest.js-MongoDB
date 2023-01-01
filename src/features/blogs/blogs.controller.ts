import {
    Body,
    Controller,
    Delete,
    forwardRef,
    Get,
    HttpCode,
    Inject,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
} from "@nestjs/common";
import { BlogsService } from "./blogs.service";
import {
    BlogsIdValidationModel,
    InputModelForCreatingBlog,
    InputModelForUpdatingBlog,
    ModelForGettingAllBlogs,
} from "./dto/blogs.dto";
import { BlogResponseModelClass, BlogDBClassPagination } from "./entities/blogs.entity";
import { PostsService } from "../posts/posts.service";
import { NewPostClassResponseModel, PostDBClassPagination } from "../posts/entities/posts.entity";
import { InputModelForCreatingNewPostForSpecificBlog, ModelForGettingAllPosts } from "../posts/dto/posts.dto";
import { BlogsQueryRepository } from "./blogs.query.repository";
import { PostsQueryService } from "../posts/posts.query.service";
import { BasicAuthGuard } from "../auth/guards/basic-auth.guard";
import { CurrentUserId } from "../auth/auth.cutsom.decorators";
import { strategyForUnauthorizedUser } from "../auth/guards/strategy-for-unauthorized-user-guard";
import { SkipThrottle } from "@nestjs/throttler";
import { BlogDBClass } from "./blogs.schema";

@SkipThrottle()
@Controller("blogs")
export class BlogsController {
    constructor(
        protected blogsService: BlogsService,
        @Inject(forwardRef(() => PostsService)) protected postsService: PostsService,
        protected blogsQueryRepository: BlogsQueryRepository,
        protected postsQueryService: PostsQueryService,
    ) {}

    @Get()
    async getAllBlogs(
        @Query()
        dto: ModelForGettingAllBlogs,
    ): Promise<BlogDBClassPagination> {
        return await this.blogsQueryRepository.getAllBlogs(dto);
    }

    @Get(":id")
    async getBlog(@Param() params: BlogsIdValidationModel): Promise<BlogDBClass> {
        return await this.blogsQueryRepository.getBlogById(params.id);
    }

    // @UseGuards(BasicAuthGuard)
    @Post()
    async createBlog(@Body() dto: InputModelForCreatingBlog): Promise<BlogResponseModelClass> {
        return await this.blogsService.createBlog(dto);
    }

    // @UseGuards(BasicAuthGuard)
    @Put(":id")
    @HttpCode(204)
    async updateBlog(
        @Param() params: BlogsIdValidationModel,
        @Body() dto: InputModelForUpdatingBlog,
    ): Promise<boolean> {
        return await this.blogsService.updateBlog(params.id, dto);
    }

    // @UseGuards(BasicAuthGuard)
    @Delete(":id")
    @HttpCode(204)
    async deleteBlog(@Param() params: BlogsIdValidationModel): Promise<boolean> {
        return await this.blogsService.deleteBlog(params.id);
    }

    // @UseGuards(strategyForUnauthorizedUser)
    @Get("/:id/posts")
    async getAllPostsForSpecificBlog(
        @Param() params: BlogsIdValidationModel,
        @Query() model: ModelForGettingAllPosts,
        // @CurrentUserId() userId: string,
    ): Promise<PostDBClassPagination> {
        const userId = undefined;
        return await this.postsQueryService.getAllPostsForSpecificBlog(model, params.id, userId);
    }

    // @UseGuards(BasicAuthGuard)
    @Post("/:id/posts")
    async createNewPostForSpecificBlog(
        @Param() params: BlogsIdValidationModel,
        @Body() model: InputModelForCreatingNewPostForSpecificBlog,
    ): Promise<NewPostClassResponseModel> {
        const dto = { ...model, blogId: params.id };
        return await this.postsService.createPost(dto);
    }
}
