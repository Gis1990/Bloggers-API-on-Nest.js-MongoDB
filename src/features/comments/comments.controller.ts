import { Body, Controller, Delete, Get, HttpCode, Param, Put, Query, UseGuards } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { JwtAccessTokenAuthGuard } from "../auth/guards/jwtAccessToken-auth.guard";
import { CommentsIdValidationModel, ModelForLikeStatus, ModelForUpdatingComment } from "./dto/comments.dto";
import { CurrentUserId } from "../auth/auth.cutsom.decorators";
import { CommentDBClass } from "./entities/comments.entity";

@Controller("comments")
export class CommentsController {
    constructor(protected commentsService: CommentsService) {}
    @UseGuards(JwtAccessTokenAuthGuard)
    @Put(":id")
    @HttpCode(204)
    async updateCommentById(
        @Param() params: CommentsIdValidationModel,
        @Body() body: ModelForUpdatingComment,
        @CurrentUserId() userId: string,
    ): Promise<boolean> {
        console.log(userId);
        return await this.commentsService.updateCommentById(params.id, body.content, userId);
    }
    @UseGuards(JwtAccessTokenAuthGuard)
    @Delete(":id")
    @HttpCode(204)
    async deleteblog(@Param() params: CommentsIdValidationModel, @CurrentUserId() userId: string): Promise<boolean> {
        return await this.commentsService.deleteCommentById(params.id, userId);
    }
    @UseGuards(JwtAccessTokenAuthGuard)
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
        @CurrentUserId() userId: string,
    ): Promise<boolean> {
        return await this.commentsService.likeOperation(params.id, userId, body.likeStatus);
    }
}
