import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { InputModelForCreatingAndUpdatingPost, ModelForGettingAllPosts, PostsIdValidationModel } from "./dto/posts.dto";
import { CurrentUser } from "../auth/auth.cutsom.decorators";
import { NewPostClassResponseModel, PostDBClass, PostDBClassPagination } from "./entities/posts.entity";
import { CommentsService } from "../comments/comments.service";
import {
    ModelForCreatingNewComment,
    ModelForGettingAllComments,
    ModelForLikeStatus,
} from "../comments/dto/comments.dto";
import { CommentDBClassPagination, NewCommentClassResponseModel } from "../comments/entities/comments.entity";
import { CurrentUserModel } from "../auth/dto/auth.dto";
import { PostsQueryService } from "./posts.query.service";
import { BasicAuthGuard } from "../auth/guards/basic-auth.guard";
import { OnlyCheckRefreshTokenGuard } from "../auth/guards/only-check-refresh-token-guard.service";
import { JwtAccessTokenAuthGuard } from "../auth/guards/jwtAccessToken-auth.guard";

@Controller("posts")
export class PostsController {
    constructor(
        protected postsService: PostsService,
        protected postsQueryService: PostsQueryService,
        protected commentsService: CommentsService,
    ) {}

    // @UseGuards(OnlyCheckRefreshTokenGuard)
    @Get()
    async getAllPosts(
        @Query() dto: ModelForGettingAllPosts,
        // @CurrentUserId() userId: string,
    ): Promise<PostDBClassPagination> {
        const userId = undefined;
        return await this.postsQueryService.getAllPosts(dto, userId);
    }

    // @UseGuards(BasicAuthGuard)
    @Post()
    async createPost(@Body() dto: InputModelForCreatingAndUpdatingPost): Promise<NewPostClassResponseModel> {
        return await this.postsService.createPost(dto);
    }

    // @UseGuards(OnlyCheckRefreshTokenGuard)
    @Get("/:id/comments")
    async getAllCommentsForSpecificPost(
        @Param() params: PostsIdValidationModel,
        @Query() model: ModelForGettingAllComments,
        // @CurrentUserId() userId: string,
    ): Promise<CommentDBClassPagination> {
        const userId = undefined;
        return await this.commentsService.getAllCommentsForSpecificPost(model, params.id, userId);
    }

    // @UseGuards(JwtAccessTokenAuthGuard)
    @Post("/:id/comments")
    async createComment(
        @Param() params: PostsIdValidationModel,
        @Body() model: ModelForCreatingNewComment,
        @CurrentUser() user: CurrentUserModel,
    ): Promise<NewCommentClassResponseModel> {
        const userId = undefined;
        return await this.commentsService.createComment(model, params.id, user);
    }

    // @UseGuards(OnlyCheckRefreshTokenGuard)
    @Get(":id")
    async getPost(
        @Param() params: PostsIdValidationModel,
        // @CurrentUserId() userId: string,
    ): Promise<PostDBClass | null> {
        const userId = undefined;
        return await this.postsQueryService.getPostById(params.id, userId);
    }

    // @UseGuards(BasicAuthGuard)
    @Put(":id")
    @HttpCode(204)
    async updatePost(
        @Param() params: PostsIdValidationModel,
        @Body() body: InputModelForCreatingAndUpdatingPost,
    ): Promise<boolean> {
        return await this.postsService.updatePost(
            params.id,
            body.title,
            body.shortDescription,
            body.content,
            body.blogId,
        );
    }

    // @UseGuards(BasicAuthGuard)
    @Delete(":id")
    @HttpCode(204)
    async deletePost(@Param() params: PostsIdValidationModel): Promise<boolean> {
        return await this.postsService.deletePost(params.id);
    }

    // @UseGuards(JwtAccessTokenAuthGuard)
    @Put(":id/like-status")
    @HttpCode(204)
    async likeOperation(
        @Param() params: PostsIdValidationModel,
        @Body() body: ModelForLikeStatus,
        @CurrentUser() user: CurrentUserModel,
    ): Promise<boolean> {
        return await this.postsService.likeOperation(params.id, user.userId, user.login, body.likeStatus);
    }
}
