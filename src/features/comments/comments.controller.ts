import { Body, Controller, Delete, Get, HttpCode, Param, Put, UseGuards } from "@nestjs/common";
import { JwtAccessTokenAuthGuard } from "../../guards/jwtAccessToken-auth.guard";
import { CommentsIdValidationModel, ModelForLikeStatus, ModelForUpdatingComment } from "./dto/comments.dto";
import { CurrentUser, CurrentUserId } from "../auth/decorators/auth.custom.decorators";
import { strategyForUnauthorizedUser } from "../../guards/strategy-for-unauthorized-user-guard";
import { CurrentUserModel } from "../auth/dto/auth.dto";
import { SkipThrottle } from "@nestjs/throttler";
import { LikeOperationForCommentCommand } from "./use-cases/like-operation-for-comment-use-case";
import { CommentViewModelClass } from "./entities/comments.entity";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { UpdateCommentCommand } from "./use-cases/update-comment-use-case";
import { DeleteCommentCommand } from "./use-cases/delete-comment-use-case";
import { GetCommentByIdCommand } from "./use-cases/queries/get-comment-by-id-query";

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
