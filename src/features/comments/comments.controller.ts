import { Body, Controller, Delete, Get, HttpCode, Param, Put, UseGuards } from "@nestjs/common";
import { JwtAccessTokenAuthGuard } from "../auth/guards/jwtAccessToken-auth.guard";
import { CommentsIdValidationModel, ModelForLikeStatus, ModelForUpdatingComment } from "./dto/comments.dto";
import { CurrentUser, CurrentUserId } from "../auth/auth.cutsom.decorators";
import { strategyForUnauthorizedUser } from "../auth/guards/strategy-for-unauthorized-user-guard";
import { CurrentUserModel } from "../auth/dto/auth.dto";
import { SkipThrottle } from "@nestjs/throttler";
import { CommentsQueryRepository } from "./comments.query.repository";
import { LikeOperationForCommentUseCase } from "./use-cases/like-operation-for-comment-use-case";
import { UpdateCommentUseCase } from "./use-cases/update-comment-use-case";
import { DeleteCommentUseCase } from "./use-cases/delete-comment-use-case";
import { CommentViewModelClass } from "./entities/comments.entity";

@SkipThrottle()
@Controller("comments")
export class CommentsController {
    constructor(
        private commentsQueryRepository: CommentsQueryRepository,
        private likeOperationForCommentUseCase: LikeOperationForCommentUseCase,
        private updateCommentUseCase: UpdateCommentUseCase,
        private deleteCommentUseCase: DeleteCommentUseCase,
    ) {}

    @UseGuards(JwtAccessTokenAuthGuard)
    @Put(":id")
    @HttpCode(204)
    async updateCommentById(
        @Param() params: CommentsIdValidationModel,
        @Body() body: ModelForUpdatingComment,
        @CurrentUser() user: CurrentUserModel,
    ): Promise<boolean> {
        return await this.updateCommentUseCase.execute(params.id, body.content, user.id);
    }

    @UseGuards(JwtAccessTokenAuthGuard)
    @Delete(":id")
    @HttpCode(204)
    async deleteBlog(@Param() params: CommentsIdValidationModel, @CurrentUserId() userId: string): Promise<boolean> {
        return await this.deleteCommentUseCase.execute(params.id, userId);
    }

    @UseGuards(strategyForUnauthorizedUser)
    @Get(":id")
    async getCommentById(
        @Param() params: CommentsIdValidationModel,
        @CurrentUserId() userId: string,
    ): Promise<CommentViewModelClass | null> {
        return await this.commentsQueryRepository.getCommentById(params.id, userId);
    }

    @UseGuards(JwtAccessTokenAuthGuard)
    @Put(":id/like-status")
    @HttpCode(204)
    async likeOperation(
        @Param() params: CommentsIdValidationModel,
        @Body() body: ModelForLikeStatus,
        @CurrentUser() user: CurrentUserModel,
    ): Promise<boolean> {
        return await this.likeOperationForCommentUseCase.execute(params.id, user.id, body.likeStatus);
    }
}
