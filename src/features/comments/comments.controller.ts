import { Body, Controller, Delete, Get, HttpCode, Param, Put, UseGuards } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { JwtAccessTokenAuthGuard } from "../auth/guards/jwtAccessToken-auth.guard";
import { CommentsIdValidationModel, ModelForLikeStatus, ModelForUpdatingComment } from "./dto/comments.dto";
import { CurrentUser, CurrentUserId } from "../auth/auth.cutsom.decorators";
import { strategyForUnauthorizedUser } from "../auth/guards/strategy-for-unauthorized-user-guard";
import { CurrentUserModel } from "../auth/dto/auth.dto";
import { SkipThrottle } from "@nestjs/throttler";
import { CommentDBClass } from "./comments.schema";

@SkipThrottle()
@Controller("comments")
export class CommentsController {
    constructor(protected commentsService: CommentsService) {}

    @UseGuards(JwtAccessTokenAuthGuard)
    @Put(":id")
    @HttpCode(204)
    async updateCommentById(
        @Param() params: CommentsIdValidationModel,
        @Body() body: ModelForUpdatingComment,
        @CurrentUser() user: CurrentUserModel,
    ): Promise<boolean> {
        return await this.commentsService.updateCommentById(params.id, body.content, user.id);
    }

    @UseGuards(JwtAccessTokenAuthGuard)
    @Delete(":id")
    @HttpCode(204)
    async deleteBlog(@Param() params: CommentsIdValidationModel, @CurrentUserId() userId: string): Promise<boolean> {
        return await this.commentsService.deleteCommentById(params.id, userId);
    }

    @UseGuards(strategyForUnauthorizedUser)
    @Get(":id")
    async getCommentById(
        @Param() params: CommentsIdValidationModel,
        @CurrentUserId() userId: string,
    ): Promise<CommentDBClass | null> {
        return await this.commentsService.getCommentById(params.id, userId);
    }

    @UseGuards(JwtAccessTokenAuthGuard)
    @Put(":id/like-status")
    @HttpCode(204)
    async likeOperation(
        @Param() params: CommentsIdValidationModel,
        @Body() body: ModelForLikeStatus,
        @CurrentUser() user: CurrentUserModel,
    ): Promise<boolean> {
        return await this.commentsService.likeOperation(params.id, user.id, body.likeStatus);
    }
}
