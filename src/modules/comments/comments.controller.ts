import { Body, Controller, Delete, Get, HttpCode, Param, Put, UseGuards } from "@nestjs/common";
import { JwtAccessTokenAuthGuard } from "../../guards/jwtAccessToken-auth.guard";
import { CommentsIdValidationModel, ModelForLikeStatus, ModelForUpdatingComment } from "../../dtos/comments.dto";
import { CurrentUser, CurrentUserId } from "../../decorators/auth/auth.custom.decorators";
import { strategyForUnauthorizedUser } from "../../guards/strategy-for-unauthorized-user-guard";
import { CurrentUserModel } from "../../dtos/auth.dto";
import { SkipThrottle } from "@nestjs/throttler";
import { LikeOperationForCommentCommand } from "../../commands/comments/like-operation-for-comment-use-case";
import { CommentViewModelClass } from "../../entities/comments.entity";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { UpdateCommentCommand } from "../../commands/comments/update-comment-use-case";
import { DeleteCommentCommand } from "../../commands/comments/delete-comment-use-case";
import { GetCommentByIdCommand } from "../../queries/comments/get-comment-by-id-query";

@SkipThrottle()
@Controller("comments")
export class CommentsController {
    constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

    @UseGuards(JwtAccessTokenAuthGuard)
    @Put(":id")
    @HttpCode(204)
    async updateCommentById(
        @Param() params: CommentsIdValidationModel,
        @Body() body: ModelForUpdatingComment,
        @CurrentUser() user: CurrentUserModel,
    ): Promise<boolean> {
        return await this.commandBus.execute(new UpdateCommentCommand(params.id, body.content, user.id));
    }

    @UseGuards(JwtAccessTokenAuthGuard)
    @Delete(":id")
    @HttpCode(204)
    async deleteBlog(@Param() params: CommentsIdValidationModel, @CurrentUserId() userId: string): Promise<boolean> {
        return await this.commandBus.execute(new DeleteCommentCommand(params.id, userId));
    }

    @UseGuards(strategyForUnauthorizedUser)
    @Get(":id")
    async getCommentById(
        @Param() params: CommentsIdValidationModel,
        @CurrentUserId() userId: string,
    ): Promise<CommentViewModelClass | null> {
        return await this.queryBus.execute(new GetCommentByIdCommand(params.id, userId));
    }

    @UseGuards(JwtAccessTokenAuthGuard)
    @Put(":id/like-status")
    @HttpCode(204)
    async likeOperation(
        @Param() params: CommentsIdValidationModel,
        @Body() body: ModelForLikeStatus,
        @CurrentUser() user: CurrentUserModel,
    ): Promise<boolean> {
        return await this.commandBus.execute(new LikeOperationForCommentCommand(params.id, user.id, body.likeStatus));
    }
}
