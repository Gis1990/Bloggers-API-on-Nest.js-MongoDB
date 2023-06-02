import { Body, Controller, Get, HttpCode, Param, Post, Query, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../decorators/auth/auth.custom.decorators";
import { SkipThrottle } from "@nestjs/throttler";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { JwtAccessTokenAuthGuard } from "../../guards/jwtAccessToken-auth.guard";
import { CreateGameCommand } from "../../commands/quiz/create-game-use-case";
import { CurrentUserModel } from "../../dtos/auth.dto";
import { GamesClass } from "../../schemas/games.schema";
import { GetGameByIdCommand } from "../../queries/quiz/get-game-by-id-query";
import {
    AnswerViewModelDto,
    GameIdValidationModel,
    GameStatsViewModelDto,
    InputModelForAnswers,
    ModelForGettingAllGamesForUser,
    ModelForGettingTopUsers,
} from "../../dtos/quiz.dto";
import { GetCurrentUnfinishedGameCommand } from "../../queries/quiz/get-current-unfinished-game-by-id-query";
import { SendAnswerCommand } from "../../commands/quiz/send-answer-use-case";
import { AllGamesViewModelClass, TopUsersModelPaginationClass } from "../../entities/quiz.entity";
import { GetAllGamesForUserCommand } from "../../queries/quiz/get-all-games-for-user-query";
import { GetGamesStatsCommand } from "../../queries/quiz/get-games-stats-for-user-query";
import { GetTopUsersCommand } from "../../queries/quiz/get-top-users-query";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { APIErrorResult } from "../../dtos/blogs.dto";

@ApiTags("PairQuizGame")
@SkipThrottle()
@Controller("pair-game-quiz")
export class QuizGameController {
    constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

    @ApiOperation({
        summary: "Get users top",
    })
    @ApiResponse({ status: 200, description: "success", type: TopUsersModelPaginationClass })
    @Get("/users/top")
    async getTopUsers(
        @Query()
        dto: ModelForGettingTopUsers,
    ): Promise<TopUsersModelPaginationClass> {
        return await this.queryBus.execute(new GetTopUsersCommand(dto));
    }

    @ApiBearerAuth()
    @ApiOperation({
        summary: "Get current user statistic",
    })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @ApiResponse({ status: 200, description: "success", type: GameStatsViewModelDto })
    @UseGuards(JwtAccessTokenAuthGuard)
    @Get("/users/my-statistic")
    async getStats(@CurrentUser() user: CurrentUserModel): Promise<GameStatsViewModelDto> {
        return await this.queryBus.execute(new GetGamesStatsCommand(user.id));
    }

    @ApiBearerAuth()
    @ApiOperation({
        summary: "Returns all my games (closed games and current)",
    })
    @ApiResponse({
        status: 200,
        description: "Returns pair by id if current user is taking part in this pair",
        type: AllGamesViewModelClass,
    })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @UseGuards(JwtAccessTokenAuthGuard)
    @Get("/pairs/my")
    async getAllGamesForUser(
        @Query()
        dto: ModelForGettingAllGamesForUser,
        @CurrentUser() user: CurrentUserModel,
    ): Promise<AllGamesViewModelClass> {
        return await this.queryBus.execute(new GetAllGamesForUserCommand(dto, user.id));
    }

    @ApiBearerAuth()
    @ApiOperation({
        summary: "Returns current unfinished user game",
    })
    @ApiResponse({
        status: 200,
        description: "Returns current pair in which current user is taking part",
        type: GamesClass,
    })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @ApiResponse({ status: 404, description: "If no active pair for current user" })
    @UseGuards(JwtAccessTokenAuthGuard)
    @Get("/pairs/my-current")
    async getCurrentUnfinishedGame(@CurrentUser() user: CurrentUserModel): Promise<GamesClass | null> {
        return await this.queryBus.execute(new GetCurrentUnfinishedGameCommand(user.id));
    }

    @ApiBearerAuth()
    @ApiOperation({
        summary: "Returns game by id",
    })
    @ApiResponse({
        status: 200,
        description: "Returns pair by id",
        type: GamesClass,
    })
    @ApiResponse({
        status: 400,
        description: "If id has invalid format",
        type: APIErrorResult,
    })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @ApiResponse({ status: 403, description: "If current user tries to get pair in which user is not participant" })
    @ApiResponse({ status: 404, description: "If game not found" })
    @UseGuards(JwtAccessTokenAuthGuard)
    @Get("/pairs/:id")
    async getGameById(
        @Param() params: GameIdValidationModel,
        @CurrentUser() user: CurrentUserModel,
    ): Promise<GamesClass | null> {
        return await this.queryBus.execute(new GetGameByIdCommand(params.id, user.id));
    }

    @ApiBearerAuth()
    @ApiOperation({
        summary:
            "Connect current user to existing random pending pair or create new pair which will be waiting second player",
    })
    @ApiResponse({ status: 200, description: "success", type: GamesClass })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @ApiResponse({ status: 403, description: "Current user is already participating in active pair" })
    @ApiBearerAuth()
    @UseGuards(JwtAccessTokenAuthGuard)
    @Post("/pairs/connection")
    @HttpCode(200)
    async createGame(@CurrentUser() user: CurrentUserModel): Promise<GamesClass> {
        return await this.commandBus.execute(new CreateGameCommand(user));
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: "Send answer for next not answered question in active pair" })
    @ApiResponse({ status: 200, description: "success", type: AnswerViewModelDto })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @ApiResponse({ status: 403, description: "Current user is already participating in active pair" })
    @ApiBearerAuth()
    @UseGuards(JwtAccessTokenAuthGuard)
    @Post("/pairs/my-current/answers")
    @HttpCode(200)
    async sendAnswer(
        @Body() dto: InputModelForAnswers,
        @CurrentUser() user: CurrentUserModel,
    ): Promise<AnswerViewModelDto> {
        return await this.commandBus.execute(new SendAnswerCommand(dto.answer, user));
    }
}
