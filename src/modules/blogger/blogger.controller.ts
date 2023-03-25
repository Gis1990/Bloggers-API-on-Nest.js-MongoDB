import {
    Body,
    Controller,
    Delete,
    FileTypeValidator,
    Get,
    HttpCode,
    MaxFileSizeValidator,
    Param,
    ParseFilePipe,
    Post,
    Put,
    Query,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import {
    BlogsIdValidationModel,
    BlogsIdValidationModelWhenBlogIsBanned,
    InputModelForCreatingBlog,
    InputModelForUpdatingBlog,
    ModelForGettingAllBlogs,
} from "../../dtos/blogs.dto";
import { BlogViewModelClass, BlogViewModelClassPagination } from "../../entities/blogs.entity";
import { PostViewModelClass } from "../../entities/posts.entity";
import { InputModelForCreatingAndUpdatingNewPostForSpecificBlog, PostsIdValidationModel } from "../../dtos/posts.dto";
import { CurrentUser } from "../../decorators/auth/auth.custom.decorators";
import { SkipThrottle } from "@nestjs/throttler";
import { UpdateBlogCommand } from "../../commands/blogs/update-blog-use-case";
import { CreateBlogCommand } from "../../commands/blogs/create-blog-use-case";
import { DeleteBlogCommand } from "../../commands/blogs/delete-blog-use-case";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreatePostCommand } from "../../commands/posts/create-post-use-case";
import { UpdatePostCommand } from "../../commands/posts/update-post-use-case";
import { DeletePostCommand } from "../../commands/posts/delete-post-use-case";
import { JwtAccessTokenAuthGuard } from "../../guards/jwtAccessToken-auth.guard";
import { CurrentUserModel } from "../../dtos/auth.dto";
import { GetAllBlogsForAuthorizedUserCommand } from "../../queries/blogs/get-all-blogs-for-authorized-user-query";
import { ValidateBlogId, ValidatePostId } from "../../decorators/blogger/blogger.custom.decorators";
import { ModelForGettingAllComments } from "../../dtos/comments.dto";
import { GetAllCommentsForAllPostsForBloggersBlogsCommand } from "../../queries/comments/get-all-comments-for-all-posts-for-blogs-query";
import {
    InputModelForBanUnbanUserByBloggerForBlog,
    ModelForGettingAllBannedUsersForBlog,
    UsersIdValidationModel,
} from "../../dtos/users.dto";
import { UserViewModelForBannedUsersByBloggerPaginationClass } from "../../entities/users.entity";
import { GetAllBannedUsersForBlogCommand } from "../../queries/users/get-all-banned-users-for-blog-query";
import { BanUnbanUserByBloggerForBlogCommand } from "../../commands/users/ban-unban-user-by-blogger-for-blog-use-case";
import { CommentViewModelForBloggerPaginationClass } from "../../entities/comments.entity";
import { FileInterceptor } from "@nestjs/platform-express";

@SkipThrottle()
@Controller("blogger")
export class BloggerController {
    constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

    @UseGuards(JwtAccessTokenAuthGuard)
    @Post("/blogs/:id/images/wallpaper")
    @UseInterceptors(FileInterceptor("file"))
    async uploadWallpaperForBlog(
        @Param() params: BlogsIdValidationModel,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 1000 }),
                    new FileTypeValidator({ fileType: "png/jpeg/jpg" }),
                ],
            }),
        )
        file: Express.Multer.File,
        @CurrentUser()
        user: CurrentUserModel,
    ): Promise<any> {
        return file;
    }

    @UseGuards(JwtAccessTokenAuthGuard)
    @Get("/blogs/comments")
    async getAllCommentsForAllPostsForBloggersBlogs(
        @Query()
        dto: ModelForGettingAllComments,
        @CurrentUser() user: CurrentUserModel,
    ): Promise<CommentViewModelForBloggerPaginationClass> {
        return await this.queryBus.execute(new GetAllCommentsForAllPostsForBloggersBlogsCommand(dto, user.id));
    }

    @UseGuards(JwtAccessTokenAuthGuard)
    @Put("/blogs/:id")
    @HttpCode(204)
    async updateBlog(
        @Param() params: BlogsIdValidationModel,
        @Body() dto: InputModelForUpdatingBlog,
        @CurrentUser() user: CurrentUserModel,
    ): Promise<boolean> {
        return await this.commandBus.execute(new UpdateBlogCommand(params.id, dto, user));
    }

    @UseGuards(JwtAccessTokenAuthGuard)
    @Delete("/blogs/:id")
    @HttpCode(204)
    async deleteBlog(@Param() params: BlogsIdValidationModel, @CurrentUser() user: CurrentUserModel): Promise<boolean> {
        return await this.commandBus.execute(new DeleteBlogCommand(params.id, user));
    }

    @UseGuards(JwtAccessTokenAuthGuard)
    @Post("/blogs")
    async createBlog(
        @Body() dto: InputModelForCreatingBlog,
        @CurrentUser() user: CurrentUserModel,
    ): Promise<BlogViewModelClass> {
        return await this.commandBus.execute(new CreateBlogCommand(dto, user));
    }

    @UseGuards(JwtAccessTokenAuthGuard)
    @Post("/blogs/:id/posts")
    async createNewPostForSpecificBlog(
        @Param() params: BlogsIdValidationModel,
        @Body() model: InputModelForCreatingAndUpdatingNewPostForSpecificBlog,
        @CurrentUser() user: CurrentUserModel,
    ): Promise<PostViewModelClass> {
        const dto = { ...model, blogId: params.id };
        return await this.commandBus.execute(new CreatePostCommand(dto, user));
    }

    @UseGuards(JwtAccessTokenAuthGuard)
    @Get("/blogs")
    async getAllBlogs(
        @Query()
        dto: ModelForGettingAllBlogs,
        @CurrentUser() user: CurrentUserModel,
    ): Promise<BlogViewModelClassPagination> {
        return await this.queryBus.execute(new GetAllBlogsForAuthorizedUserCommand(dto, user.id));
    }

    @UseGuards(JwtAccessTokenAuthGuard)
    @Put("/blogs/:blogId/posts/:postId")
    @HttpCode(204)
    async updatePostForSpecificBlog(
        @ValidateBlogId() blogId: BlogsIdValidationModel,
        @ValidatePostId() postId: PostsIdValidationModel,
        @Body() model: InputModelForCreatingAndUpdatingNewPostForSpecificBlog,
        @CurrentUser() user: CurrentUserModel,
    ): Promise<PostViewModelClass> {
        return await this.commandBus.execute(
            new UpdatePostCommand(
                postId.toString(),
                model.title,
                model.shortDescription,
                model.content,
                blogId.toString(),
                user,
            ),
        );
    }

    @UseGuards(JwtAccessTokenAuthGuard)
    @Delete("/blogs/:blogId/posts/:postId")
    @HttpCode(204)
    async deletePost(
        @ValidateBlogId() blogId: BlogsIdValidationModel,
        @ValidatePostId() postId: PostsIdValidationModel,
        @CurrentUser() user: CurrentUserModel,
    ): Promise<boolean> {
        return await this.commandBus.execute(new DeletePostCommand(blogId.toString(), postId.toString(), user.id));
    }

    @UseGuards(JwtAccessTokenAuthGuard)
    @Put("/users/:id/ban")
    @HttpCode(204)
    async banUnbanUserByBloggerForBlog(
        @Param()
        params: UsersIdValidationModel,
        @Body()
        dto: InputModelForBanUnbanUserByBloggerForBlog,
        @CurrentUser() user: CurrentUserModel,
    ): Promise<boolean> {
        return await this.commandBus.execute(
            new BanUnbanUserByBloggerForBlogCommand(dto.isBanned, dto.banReason, dto.blogId, params.id, user.id),
        );
    }

    @UseGuards(JwtAccessTokenAuthGuard)
    @Get("/users/blog/:id")
    async GetAllBannedUsersForBlog(
        @Param()
        params: BlogsIdValidationModelWhenBlogIsBanned,
        @Query()
        dto: ModelForGettingAllBannedUsersForBlog,
        @CurrentUser() user: CurrentUserModel,
    ): Promise<UserViewModelForBannedUsersByBloggerPaginationClass> {
        return await this.queryBus.execute(new GetAllBannedUsersForBlogCommand(dto, params.id, user.id));
    }
}
