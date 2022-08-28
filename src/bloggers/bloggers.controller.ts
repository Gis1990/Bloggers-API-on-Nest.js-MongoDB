import { Body, Controller, Delete, forwardRef, Get, HttpCode, Inject, Param, Post, Put, Query } from "@nestjs/common";
import { BloggersService } from "./bloggers.service";
import {
    bloggersIdValidationModel,
    inputModelForUpdatingBlogger,
    inputModelForCreatingBlogger,
    modelForGettingAllBloggers,
} from "./dto/bloggers.dto";
import { BloggerClassResponseModel, BloggerDBClass, BloggerDBClassPagination } from "./bloggers.model";
import { BodyAndParam } from "./bloggers.custom.decorators";
import { PostsService } from "../posts/posts.service";

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
    @Post()
    async createBlogger(@Body() dto: inputModelForCreatingBlogger): Promise<BloggerClassResponseModel> {
        return await this.bloggersService.createBlogger(dto);
    }
    @Put(":id")
    @HttpCode(204)
    async updateBlogger(@BodyAndParam() dto: inputModelForUpdatingBlogger): Promise<boolean> {
        return await this.bloggersService.updateBlogger(dto);
    }
    @Delete(":id")
    @HttpCode(204)
    async deleteBlogger(@Param() params: bloggersIdValidationModel): Promise<boolean> {
        return await this.bloggersService.deleteBlogger(params.id);
    }
}
