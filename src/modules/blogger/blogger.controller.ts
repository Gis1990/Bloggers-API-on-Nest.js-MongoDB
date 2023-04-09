import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import {
    APIErrorResult,
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
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiResponse({ status: 401, description: "Unauthorized" })
@SkipThrottle()
@Controller("blogger")
export class BloggerController {
    constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

    @ApiOperation({ summary: "Returns all comments for all posts inside all current user blogs" })
    @ApiResponse({ status: 200, description: "success", type: CommentViewModelForBloggerPaginationClass })
    @ApiTags("Blogs")
    @UseGuards(JwtAccessTokenAuthGuard)
    @Get("/blogs/comments")
    async getAllCommentsForAllPostsForBloggersBlogs(
        @Query()
        dto: ModelForGettingAllComments,
        @CurrentUser() user: CurrentUserModel,
    ): Promise<CommentViewModelForBloggerPaginationClass> {
        return await this.queryBus.execute(new GetAllCommentsForAllPostsForBloggersBlogsCommand(dto, user.id));
    }

    @ApiOperation({ summary: "Update existing Blog by id with InputModel" })
    @ApiResponse({ status: 204, description: "No content" })
    @ApiResponse({
        status: 400,
        description: "If the inputModel has incorrect values",
        type: APIErrorResult,
    })
    @ApiTags("Blogs")
    @UseGuards(JwtAccessTokenAuthGuard)
    @Put("/blogs/:blogId")
    @HttpCode(204)
    async updateBlog(
        @Param() params: BlogsIdValidationModel,
        @Body() dto: InputModelForUpdatingBlog,
        @CurrentUser() user: CurrentUserModel,
    ): Promise<boolean> {
        return await this.commandBus.execute(new UpdateBlogCommand(params.id, dto, user));
    }

    @ApiOperation({ summary: "Delete blog specified by id" })
    @ApiResponse({ status: 204, description: "No content" })
    @ApiResponse({ status: 403, description: "Forbidden" })
    @ApiResponse({ status: 404, description: "Not found" })
    @ApiTags("Blogs")
    @UseGuards(JwtAccessTokenAuthGuard)
    @Delete("/blogs/:blogId")
    @HttpCode(204)
    async deleteBlog(@Param() params: BlogsIdValidationModel, @CurrentUser() user: CurrentUserModel): Promise<boolean> {
        return await this.commandBus.execute(new DeleteBlogCommand(params.id, user));
    }

    @ApiOperation({ summary: "Create new blog" })
    @ApiResponse({
        status: 400,
        description: "If the inputModel has incorrect values",
        type: APIErrorResult,
    })
    @ApiResponse({ status: 201, description: "Returns the newly created blog", type: BlogViewModelClass })
    @ApiTags("Blogs")
    @UseGuards(JwtAccessTokenAuthGuard)
    @Post("/blogs")
    async createBlog(
        @Body() dto: InputModelForCreatingBlog,
        @CurrentUser() user: CurrentUserModel,
    ): Promise<BlogViewModelClass> {
        return await this.commandBus.execute(new CreateBlogCommand(dto, user));
    }

    @ApiOperation({ summary: "Create new post for specific blog" })
    @ApiResponse({ status: 201, description: "Returns the newly created post", type: PostViewModelClass })
    @ApiResponse({
        status: 400,
        description: "If the inputModel has incorrect values",
        type: APIErrorResult,
    })
    @ApiResponse({ status: 403, description: "If user try to add post to blog that doesn't belong to current user" })
    @ApiResponse({ status: 404, description: "If specific blog doesn't exists" })
    @ApiTags("Blogs")
    @UseGuards(JwtAccessTokenAuthGuard)
    @Post("/blogs/:blogId/posts")
    async createNewPostForSpecificBlog(
        @Param() params: BlogsIdValidationModel,
        @Body() model: InputModelForCreatingAndUpdatingNewPostForSpecificBlog,
        @CurrentUser() user: CurrentUserModel,
    ): Promise<PostViewModelClass> {
        const dto = { ...model, blogId: params.id };
        return await this.commandBus.execute(new CreatePostCommand(dto, user));
    }

    @ApiOperation({ summary: "Returns blogs (for which current user is owner) with paging" })
    @ApiResponse({ status: 200, description: "Success", type: BlogViewModelClassPagination })
    @ApiTags("Blogs")
    @UseGuards(JwtAccessTokenAuthGuard)
    @Get("/blogs")
    async getAllBlogs(
        @Query()
        dto: ModelForGettingAllBlogs,
        @CurrentUser() user: CurrentUserModel,
    ): Promise<BlogViewModelClassPagination> {
        return await this.queryBus.execute(new GetAllBlogsForAuthorizedUserCommand(dto, user.id));
    }

    @ApiOperation({ summary: "Update existing post by id with InputModel" })
    @ApiTags("Blogs")
    @ApiResponse({
        status: 400,
        description: "If the inputModel has incorrect values",
        type: APIErrorResult,
    })
    @ApiResponse({ status: 204, description: "No content" })
    @ApiResponse({
        status: 403,
        description: "If user try to update post that belongs to blog that doesn't belong to current user",
    })
    @ApiResponse({ status: 404, description: "Not found" })
    @ApiParam({ name: "blogId", type: String })
    @ApiParam({ name: "postId", type: String })
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

    @ApiOperation({ summary: "Delete post specified by id" })
    @ApiResponse({ status: 204, description: "No content" })
    @ApiResponse({
        status: 403,
        description: "If user try to update post that belongs to blog that doesn't belong to current user",
    })
    @ApiResponse({ status: 404, description: "Not found" })
    @ApiParam({ name: "blogId", type: String })
    @ApiParam({ name: "postId", type: String })
    @ApiTags("Blogs")
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

    @ApiOperation({ summary: "Ban/unban user" })
    @ApiResponse({ status: 204, description: "No content" })
    @ApiResponse({
        status: 400,
        description: "If the inputModel has incorrect values",
        type: APIErrorResult,
    })
    @ApiTags("Users")
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

    @ApiOperation({ summary: "Returns all banned users for blog" })
    @ApiResponse({ status: 200, description: "Success", type: UserViewModelForBannedUsersByBloggerPaginationClass })
    @ApiTags("Users")
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
