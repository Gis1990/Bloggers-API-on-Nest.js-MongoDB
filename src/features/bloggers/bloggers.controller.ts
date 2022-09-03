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
    bloggersIdValidationModel,
    inputModelForCreatingBlogger,
    modelForGettingAllBloggers,
    modelForUpdatingBlogger,
} from "./dto/bloggers.dto";
import { BloggerClassResponseModel, BloggerDBClass, BloggerDBClassPagination } from "./bloggers.model";
import { PostsService } from "../posts/posts.service";
import { BasicAuthGuard } from "../auth/guards/basic-auth.guard";

@Controller("bloggers")
export class BloggersController {
    constructor(
        protected bloggersService: BloggersService,
        @Inject(forwardRef(() => PostsService)) protected postsService: PostsService,
    ) {}
    @Get()
    async getAllBloggers(
        @Query()
        dto: modelForGettingAllBloggers,
    ): Promise<BloggerDBClassPagination> {
        return await this.bloggersService.getAllBloggers(dto);
    }
    @Get(":id")
    async getBlogger(@Param() params: bloggersIdValidationModel): Promise<BloggerDBClass | null> {
        return await this.bloggersService.getBloggerById(params.id);
    }
    @UseGuards(BasicAuthGuard)
    @Post()
    async createBlogger(@Body() dto: inputModelForCreatingBlogger): Promise<BloggerClassResponseModel> {
        return await this.bloggersService.createBlogger(dto);
    }
    @UseGuards(BasicAuthGuard)
    @Put(":id")
    @HttpCode(204)
    async updateBlogger(
        @Param() params: bloggersIdValidationModel,
        @Body() body: modelForUpdatingBlogger,
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
    async deleteBlogger(@Param() params: bloggersIdValidationModel): Promise<boolean> {
        return await this.bloggersService.deleteBlogger(params.id);
    }
    // @Get("/:id/posts")
    // async getAllPostsForSpecificBlogger(@Param() params: bloggersIdValidationModel): Promise<PostDBClassPagination> {
    //     return await this.postsService.getAllPostsForSpecificBlogger(params.id);
    // }
}
