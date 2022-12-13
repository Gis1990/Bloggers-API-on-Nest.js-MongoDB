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
import { BlogClassResponseModel, BlogDBClass, BlogDBClassPagination } from "./entities/blogs.entity";
import { PostsService } from "../posts/posts.service";
import { BasicAuthGuard } from "../auth/guards/basic-auth.guard";
import { NewPostClassResponseModel, PostDBClassPagination } from "../posts/entities/posts.entity";
import { OnlyCheckRefreshTokenGuard } from "../auth/guards/only-check-refresh-token-guard.service";
import { InputModelForCreatingNewPostForSpecificBlog, ModelForGettingAllPosts } from "../posts/dto/posts.dto";
import { CurrentUserId } from "../auth/auth.cutsom.decorators";

@Controller("blogs")
export class BlogsController {
    constructor(
        protected blogsService: BlogsService,
        @Inject(forwardRef(() => PostsService)) protected postsService: PostsService,
    ) {}

    @Get()
    async getAllBlogs(
        @Query()
        dto: ModelForGettingAllBlogs,
    ): Promise<BlogDBClassPagination> {
        return await this.blogsService.getAllBlogs(dto);
    }

    @Get(":id")
    async getBlog(@Param() params: BlogsIdValidationModel): Promise<BlogDBClass> {
        return await this.blogsService.getBlogById(params.id);
    }

    // @UseGuards(BasicAuthGuard)
    @Post()
    async createBlog(@Body() dto: InputModelForCreatingBlog): Promise<BlogClassResponseModel> {
        return await this.blogsService.createBlog(dto);
    }

    // @UseGuards(BasicAuthGuard)
    @Put(":id")
    @HttpCode(204)
    async updateBlog(
        @Param() params: BlogsIdValidationModel,
        @Body() body: InputModelForUpdatingBlog,
    ): Promise<boolean> {
        const id = params.id;
        const name = body.name;
        const description = body.description;
        const websiteUrl = body.websiteUrl;
        const dto = { id, name, description, websiteUrl };
        return await this.blogsService.updateBlog(dto);
    }

    // @UseGuards(BasicAuthGuard)
    @Delete(":id")
    @HttpCode(204)
    async deleteBlog(@Param() params: BlogsIdValidationModel): Promise<boolean> {
        return await this.blogsService.deleteBlog(params.id);
    }

    // @UseGuards(OnlyCheckRefreshTokenGuard)
    @Get("/:id/posts")
    async getAllPostsForSpecificBlog(
        @Param() params: BlogsIdValidationModel,
        @Body() model: ModelForGettingAllPosts,
        @CurrentUserId() userId: string,
    ): Promise<PostDBClassPagination> {
        return await this.postsService.getAllPostsForSpecificBlog(model, params.id, userId);
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
