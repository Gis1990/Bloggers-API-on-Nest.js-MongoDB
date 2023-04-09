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
import { ApiBearerAuth, ApiForbiddenResponse, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("PairQuizGame")
@SkipThrottle()
@Controller("pair-game-quiz")
export class QuizGameController {
    constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

    @Get("/users/top")
    async getTopUsers(
        @Query()
        dto: ModelForGettingTopUsers,
    ): Promise<TopUsersModelPaginationClass> {
        return await this.queryBus.execute(new GetTopUsersCommand(dto));
    }

    @UseGuards(JwtAccessTokenAuthGuard)
    @Get("/users/my-statistic")
    async getStats(@CurrentUser() user: CurrentUserModel): Promise<GameStatsViewModelDto> {
        return await this.queryBus.execute(new GetGamesStatsCommand(user.id));
    }

    @UseGuards(JwtAccessTokenAuthGuard)
    @Get("/pairs/my")
    async getAllGamesForUser(
        @Query()
        dto: ModelForGettingAllGamesForUser,
        @CurrentUser() user: CurrentUserModel,
    ): Promise<AllGamesViewModelClass> {
        return await this.queryBus.execute(new GetAllGamesForUserCommand(dto, user.id));
    }

    @UseGuards(JwtAccessTokenAuthGuard)
    @Get("/pairs/my-current")
    async getCurrentUnfinishedGame(@CurrentUser() user: CurrentUserModel): Promise<GamesClass | null> {
        return await this.queryBus.execute(new GetCurrentUnfinishedGameCommand(user.id));
    }

    @UseGuards(JwtAccessTokenAuthGuard)
    @Get("/pairs/:id")
    async getGameById(
        @Param() params: GameIdValidationModel,
        @CurrentUser() user: CurrentUserModel,
    ): Promise<GamesClass | null> {
        return await this.queryBus.execute(new GetGameByIdCommand(params.id, user.id));
    }

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
