import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { InputModelForCreatingAndUpdatingPost, ModelForGettingAllPosts, PostsIdValidationModel } from "./dto/posts.dto";
import { CurrentUser, CurrentUserId } from "../auth/auth.cutsom.decorators";
import { PostDBPaginationClass, PostViewModelClass } from "./entities/posts.entity";
import {
    ModelForCreatingNewComment,
    ModelForGettingAllComments,
    ModelForLikeStatus,
} from "../comments/dto/comments.dto";
import { CommentDBClassPagination, CommentViewModelClass } from "../comments/entities/comments.entity";
import { CurrentUserModel } from "../auth/dto/auth.dto";
import { BasicAuthGuard } from "../auth/guards/basic-auth.guard";
import { JwtAccessTokenAuthGuard } from "../auth/guards/jwtAccessToken-auth.guard";
import { strategyForUnauthorizedUser } from "../auth/guards/strategy-for-unauthorized-user-guard";
import { SkipThrottle } from "@nestjs/throttler";
import { PostsQueryRepository } from "./posts.query.repository";
import { CreatePostCommand } from "./use-cases/create-post-use-case";
import { CommentsQueryRepository } from "../comments/comments.query.repository";
import { CommandBus } from "@nestjs/cqrs";
import { CreateCommentCommand } from "../comments/use-cases/create-comment-use-case";
import { DeletePostCommand } from "./use-cases/delete-post-use-case";
import { LikeOperationForPostCommand } from "./use-cases/like-operation-for-post-use-case";
import { UpdatePostCommand } from "./use-cases/update-post-use-case";

@SkipThrottle()
@Controller("posts")
export class PostsController {
    constructor(
        private commandBus: CommandBus,
        private postsQueryRepository: PostsQueryRepository,
        private commentsQueryRepository: CommentsQueryRepository,
    ) {}

    @UseGuards(strategyForUnauthorizedUser)
    @Get()
    async getAllPosts(
        @Query() dto: ModelForGettingAllPosts,
        @CurrentUserId() userId: string,
    ): Promise<PostDBPaginationClass> {
        return await this.postsQueryRepository.getAllPosts(dto, userId);
    }

    @UseGuards(BasicAuthGuard)
    @Post()
    async createPost(@Body() dto: InputModelForCreatingAndUpdatingPost): Promise<PostViewModelClass> {
        return await this.commandBus.execute(new CreatePostCommand(dto));
    }

    @UseGuards(strategyForUnauthorizedUser)
    @Get("/:id/comments")
    async getAllCommentsForSpecificPost(
        @Param() params: PostsIdValidationModel,
        @Query() model: ModelForGettingAllComments,
        @CurrentUserId() userId: string,
    ): Promise<CommentDBClassPagination> {
        return await this.commentsQueryRepository.getAllCommentsForSpecificPost(model, params.id, userId);
    }

    @UseGuards(JwtAccessTokenAuthGuard)
    @Post("/:id/comments")
    async createComment(
        @Param() params: PostsIdValidationModel,
        @Body() model: ModelForCreatingNewComment,
        @CurrentUser() user: CurrentUserModel,
    ): Promise<CommentViewModelClass> {
        return await this.commandBus.execute(new CreateCommentCommand(model, params.id, user));
    }

    @UseGuards(strategyForUnauthorizedUser)
    @Get(":id")
    async getPost(
        @Param() params: PostsIdValidationModel,
        @CurrentUserId() userId: string,
    ): Promise<PostViewModelClass | null> {
        return await this.postsQueryRepository.getPostById(params.id, userId);
    }

    @UseGuards(BasicAuthGuard)
    @Put(":id")
    @HttpCode(204)
    async updatePost(
        @Param() params: PostsIdValidationModel,
        @Body() body: InputModelForCreatingAndUpdatingPost,
    ): Promise<boolean> {
        return await this.commandBus.execute(
            new UpdatePostCommand(params.id, body.title, body.shortDescription, body.content, body.blogId),
        );
    }

    @UseGuards(BasicAuthGuard)
    @Delete(":id")
    @HttpCode(204)
    async deletePost(@Param() params: PostsIdValidationModel): Promise<boolean> {
        return await this.commandBus.execute(new DeletePostCommand(params.id));
    }

    @UseGuards(JwtAccessTokenAuthGuard)
    @Put(":id/like-status")
    @HttpCode(204)
    async likeOperation(
        @Param() params: PostsIdValidationModel,
        @Body() body: ModelForLikeStatus,
        @CurrentUser() user: CurrentUserModel,
    ): Promise<boolean> {
        return await this.commandBus.execute(
            new LikeOperationForPostCommand(params.id, user.id, user.login, body.likeStatus),
        );
    }
}
