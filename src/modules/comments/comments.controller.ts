import { Body, Controller, Delete, Get, HttpCode, Param, Put, UseGuards } from "@nestjs/common";
import { JwtAccessTokenAuthGuard } from "../../guards/jwtAccessToken-auth.guard";
import {
    CommentsIdValidationModel,
    InputModelForLikeStatus,
    InputModelForUpdatingComment,
} from "../../dtos/comments.dto";
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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { APIErrorResult } from "../../dtos/blogs.dto";

@ApiTags("Comments")
@SkipThrottle()
@Controller("comments")
export class CommentsController {
    constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

    @ApiBearerAuth()
    @ApiOperation({ summary: "Update existing comment by id with InputModel" })
    @ApiResponse({ status: 204, description: "No content" })
    @ApiResponse({
        status: 400,
        description: "If the inputModel has incorrect values",
        type: APIErrorResult,
    })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @ApiResponse({ status: 403, description: "If try edit the comment that is not your own" })
    @ApiResponse({ status: 404, description: "Not Found" })
    @UseGuards(JwtAccessTokenAuthGuard)
    @Put(":id")
    @HttpCode(204)
    async updateCommentById(
        @Param() params: CommentsIdValidationModel,
        @Body() body: InputModelForUpdatingComment,
        @CurrentUser() user: CurrentUserModel,
    ): Promise<boolean> {
        return await this.commandBus.execute(new UpdateCommentCommand(params.id, body.content, user.id));
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: "Delete comment specified by id" })
    @ApiResponse({ status: 204, description: "No content" })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @ApiResponse({ status: 403, description: "If try delete the comment that is not your own" })
    @ApiResponse({ status: 404, description: "Not Found" })
    @UseGuards(JwtAccessTokenAuthGuard)
    @Delete(":id")
    @HttpCode(204)
    async deleteBlog(@Param() params: CommentsIdValidationModel, @CurrentUserId() userId: string): Promise<boolean> {
        return await this.commandBus.execute(new DeleteCommentCommand(params.id, userId));
    }

    @ApiOperation({ summary: "Return comment by id" })
    @ApiResponse({ status: 200, description: "Success", type: CommentViewModelClass })
    @ApiResponse({ status: 404, description: "Not Found" })
    @UseGuards(strategyForUnauthorizedUser)
    @Get(":id")
    async getCommentById(
        @Param() params: CommentsIdValidationModel,
        @CurrentUserId() userId: string,
    ): Promise<CommentViewModelClass | null> {
        return await this.queryBus.execute(new GetCommentByIdCommand(params.id, userId));
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: "Make like/unlike/dislike/undislike operation" })
    @ApiResponse({ status: 204, description: "No content" })
    @ApiResponse({
        status: 400,
        description: "If the inputModel has incorrect values",
        type: APIErrorResult,
    })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @ApiResponse({ status: 404, description: "If comment with specified id doesn't exists" })
    @UseGuards(JwtAccessTokenAuthGuard)
    @Put(":id/like-status")
    @HttpCode(204)
    async likeOperation(
        @Param() params: CommentsIdValidationModel,
        @Body() body: InputModelForLikeStatus,
        @CurrentUser() user: CurrentUserModel,
    ): Promise<boolean> {
        return await this.commandBus.execute(new LikeOperationForCommentCommand(params.id, user.id, body.likeStatus));
    }
}
