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
import { BloggersService } from "./bloggers.service";
import {
    BloggersIdValidationModel,
    InputModelForCreatingBlogger,
    InputModelForUpdatingBlogger,
    ModelForGettingAllBloggers,
} from "./dto/bloggers.dto";
import { BloggerClassResponseModel, BloggerDBClass, BloggerDBClassPagination } from "./entities/bloggers.entity";
import { PostsService } from "../posts/posts.service";
import { BasicAuthGuard } from "../auth/guards/basic-auth.guard";
import { NewPostClassResponseModel, PostDBClassPagination } from "../posts/entities/posts.entity";
import { OnlyCheckRefreshTokenGuard } from "../auth/guards/only-check-refresh-token-guard.service";
import { InputModelForCreatingNewPostForSpecificBlogger, ModelForGettingAllPosts } from "../posts/dto/posts.dto";
import { CurrentUserId } from "../auth/auth.cutsom.decorators";

@Controller("bloggers")
export class BloggersController {
    constructor(
        protected bloggersService: BloggersService,
        @Inject(forwardRef(() => PostsService)) protected postsService: PostsService,
    ) {}
    @Get()
    async getAllBloggers(
        @Query()
        dto: ModelForGettingAllBloggers,
    ): Promise<BloggerDBClassPagination> {
        return await this.bloggersService.getAllBloggers(dto);
    }
    @Get(":id")
    async getBlogger(@Param() params: BloggersIdValidationModel): Promise<BloggerDBClass | null> {
        return await this.bloggersService.getBloggerById(params.id);
    }
    @UseGuards(BasicAuthGuard)
    @Post()
    async createBlogger(@Body() dto: InputModelForCreatingBlogger): Promise<BloggerClassResponseModel> {
        return await this.bloggersService.createBlogger(dto);
    }
    @UseGuards(BasicAuthGuard)
    @Put(":id")
    @HttpCode(204)
    async updateBlogger(
        @Param() params: BloggersIdValidationModel,
        @Body() body: InputModelForUpdatingBlogger,
    ): Promise<boolean> {
        const id = params.id;
        const name = body.name;
        const youtubeUrl = body.youtubeUrl;
        const dto = { id, name, youtubeUrl };
        return await this.bloggersService.updateBlogger(dto);
    }
    @UseGuards(BasicAuthGuard)
    @Delete(":id")
    @HttpCode(204)
    async deleteBlogger(@Param() params: BloggersIdValidationModel): Promise<boolean> {
        return await this.bloggersService.deleteBlogger(params.id);
    }
    @UseGuards(OnlyCheckRefreshTokenGuard)
    @Get("/:id/posts")
    async getAllPostsForSpecificBlogger(
        @Param() params: BloggersIdValidationModel,
        @Body() model: ModelForGettingAllPosts,
        @CurrentUserId() userId: string,
    ): Promise<PostDBClassPagination> {
        return await this.postsService.getAllPostsForSpecificBlogger(model, params.id, userId);
    }
    @UseGuards(BasicAuthGuard)
    @Post("/:id/posts")
    async createNewPostForSpecificBlogger(
        @Param() params: BloggersIdValidationModel,
        @Body() model: InputModelForCreatingNewPostForSpecificBlogger,
    ): Promise<NewPostClassResponseModel> {
        const dto = { ...model, bloggerId: params.id };
        return await this.postsService.createPost(dto);
    }
}
