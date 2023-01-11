import { Body, Controller, Get, HttpCode, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ModelForGettingAllPosts, PostsIdValidationModel } from "./dto/posts.dto";
import { CurrentUser, CurrentUserId } from "../auth/decorators/auth.custom.decorators";
import { PostDBPaginationClass, PostViewModelClass } from "./entities/posts.entity";
import {
    ModelForCreatingNewComment,
    ModelForGettingAllComments,
    ModelForLikeStatus,
} from "../comments/dto/comments.dto";
import { CommentDBClassPagination, CommentViewModelClass } from "../comments/entities/comments.entity";
import { CurrentUserModel } from "../auth/dto/auth.dto";
import { JwtAccessTokenAuthGuard } from "../../guards/jwtAccessToken-auth.guard";
import { strategyForUnauthorizedUser } from "../../guards/strategy-for-unauthorized-user-guard";
import { SkipThrottle } from "@nestjs/throttler";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateCommentCommand } from "../comments/use-cases/create-comment-use-case";
import { LikeOperationForPostCommand } from "./use-cases/like-operation-for-post-use-case";
import { GetAllCommentsForSpecificPostCommand } from "../comments/use-cases/queries/get-all-comments-for-specific-post-query";
import { GetAllPostsCommand } from "./use-cases/queries/get-all-posts-query";
import { GetPostByIdCommand } from "./use-cases/queries/get-post-by-id-query";

@SkipThrottle()
@Controller("posts")
export class PostsController {
    constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

    @UseGuards(strategyForUnauthorizedUser)
    @Get()
    async getAllPosts(
        @Query() dto: ModelForGettingAllPosts,
        @CurrentUserId() userId: string,
    ): Promise<PostDBPaginationClass> {
        return await this.queryBus.execute(new GetAllPostsCommand(dto, userId));
    }

    @UseGuards(strategyForUnauthorizedUser)
    @Get("/:postId/comments")
    async getAllCommentsForSpecificPost(
        @Param() params: PostsIdValidationModel,
        @Query() model: ModelForGettingAllComments,
        @CurrentUserId() userId: string,
    ): Promise<CommentDBClassPagination> {
        return await this.queryBus.execute(new GetAllCommentsForSpecificPostCommand(model, params.postId, userId));
    }

    @UseGuards(JwtAccessTokenAuthGuard)
    @Post("/:postId/comments")
    async createComment(
        @Param() params: PostsIdValidationModel,
        @Body() model: ModelForCreatingNewComment,
        @CurrentUser() user: CurrentUserModel,
    ): Promise<CommentViewModelClass> {
        return await this.commandBus.execute(new CreateCommentCommand(model, params.postId, user));
    }

    @UseGuards(strategyForUnauthorizedUser)
    @Get(":postId")
    async getPost(
        @Param() params: PostsIdValidationModel,
        @CurrentUserId() userId: string,
    ): Promise<PostViewModelClass | null> {
        return await this.queryBus.execute(new GetPostByIdCommand(params.postId, userId));
    }

    @UseGuards(JwtAccessTokenAuthGuard)
    @Put(":postId/like-status")
    @HttpCode(204)
    async likeOperation(
        @Param() params: PostsIdValidationModel,
        @Body() body: ModelForLikeStatus,
        @CurrentUser() user: CurrentUserModel,
    ): Promise<boolean> {
        return await this.commandBus.execute(
            new LikeOperationForPostCommand(params.postId, user.id, user.login, body.likeStatus),
        );
    }
}
