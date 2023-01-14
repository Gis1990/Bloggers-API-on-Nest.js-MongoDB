import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import {
    BlogsIdValidationModel,
    InputModelForCreatingBlog,
    InputModelForUpdatingBlog,
    ModelForGettingAllBlogs,
} from "../blogs/dto/blogs.dto";
import { BlogViewModelClass, BlogClassPagination } from "../blogs/entities/blogs.entity";
import { PostViewModelClass } from "../posts/entities/posts.entity";
import { InputModelForCreatingAndUpdatingNewPostForSpecificBlog, PostsIdValidationModel } from "../posts/dto/posts.dto";
import { CurrentUser } from "../auth/decorators/auth.custom.decorators";
import { SkipThrottle } from "@nestjs/throttler";
import { UpdateBlogCommand } from "../blogs/use-cases/update-blog-use-case";
import { CreateBlogCommand } from "../blogs/use-cases/create-blog-use-case";
import { DeleteBlogCommand } from "../blogs/use-cases/delete-blog-use-case";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreatePostCommand } from "../posts/use-cases/create-post-use-case";
import { UpdatePostCommand } from "../posts/use-cases/update-post-use-case";
import { DeletePostCommand } from "../posts/use-cases/delete-post-use-case";
import { JwtAccessTokenAuthGuard } from "../../guards/jwtAccessToken-auth.guard";
import { CurrentUserModel } from "../auth/dto/auth.dto";
import { GetAllBlogsForAuthorizedUserCommand } from "../blogs/use-cases/queries/get-all-blogs-for-authorized-user-query";
import { ValidateBlogId, ValidatePostId } from "./decorators/blogger.custom.decorators";
import { ModelForGettingAllComments } from "../comments/dto/comments.dto";
import { GetAllCommentsForAllPostsForBloggersBlogsCommand } from "../comments/use-cases/queries/get-all-comments-for-all-posts-for-blogs-query";

@SkipThrottle()
@Controller("blogger/blogs")
export class BloggerController {
    constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

    @UseGuards(JwtAccessTokenAuthGuard)
    @Get("/comments")
    async getAllCommentsForAllPostsForBloggersBlogs(
        @Query()
        dto: ModelForGettingAllComments,
        @CurrentUser() user: CurrentUserModel,
    ): Promise<BlogClassPagination> {
        return await this.queryBus.execute(new GetAllCommentsForAllPostsForBloggersBlogsCommand(dto, user.id));
    }

    @UseGuards(JwtAccessTokenAuthGuard)
    @Delete(":id")
    @HttpCode(204)
    async deleteBlog(@Param() params: BlogsIdValidationModel, @CurrentUser() user: CurrentUserModel): Promise<boolean> {
        return await this.commandBus.execute(new DeleteBlogCommand(params.id, user));
    }

    @UseGuards(JwtAccessTokenAuthGuard)
    @Put(":id")
    @HttpCode(204)
    async updateBlog(
        @Param() params: BlogsIdValidationModel,
        @Body() dto: InputModelForUpdatingBlog,
        @CurrentUser() user: CurrentUserModel,
    ): Promise<boolean> {
        return await this.commandBus.execute(new UpdateBlogCommand(params.id, dto, user));
    }

    @UseGuards(JwtAccessTokenAuthGuard)
    @Post("/:id/posts")
    async createNewPostForSpecificBlog(
        @Param() params: BlogsIdValidationModel,
        @Body() model: InputModelForCreatingAndUpdatingNewPostForSpecificBlog,
        @CurrentUser() user: CurrentUserModel,
    ): Promise<PostViewModelClass> {
        const dto = { ...model, blogId: params.id };
        return await this.commandBus.execute(new CreatePostCommand(dto, user));
    }

    @UseGuards(JwtAccessTokenAuthGuard)
    @Put("/:blogId/posts/:postId")
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
    @Delete("/:blogId/posts/:postId")
    @HttpCode(204)
    async deletePost(
        @ValidateBlogId() blogId: BlogsIdValidationModel,
        @ValidatePostId() postId: PostsIdValidationModel,
        @CurrentUser() user: CurrentUserModel,
    ): Promise<boolean> {
        return await this.commandBus.execute(new DeletePostCommand(blogId.toString(), postId.toString(), user.id));
    }

    @UseGuards(JwtAccessTokenAuthGuard)
    @Post()
    async createBlog(
        @Body() dto: InputModelForCreatingBlog,
        @CurrentUser() user: CurrentUserModel,
    ): Promise<BlogViewModelClass> {
        return await this.commandBus.execute(new CreateBlogCommand(dto, user));
    }

    @UseGuards(JwtAccessTokenAuthGuard)
    @Get()
    async getAllBlogs(
        @Query()
        dto: ModelForGettingAllBlogs,
        @CurrentUser() user: CurrentUserModel,
    ): Promise<BlogClassPagination> {
        return await this.queryBus.execute(new GetAllBlogsForAuthorizedUserCommand(dto, user.id));
    }
}
