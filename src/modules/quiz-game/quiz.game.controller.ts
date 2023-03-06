import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { CurrentUser, CurrentUserId } from "../../decorators/auth/auth.custom.decorators";
import { SkipThrottle } from "@nestjs/throttler";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { JwtAccessTokenAuthGuard } from "../../guards/jwtAccessToken-auth.guard";
import { CreateGameCommand } from "../../commands/quiz/create-game-use-case";
import { CurrentUserModel } from "../../dtos/auth.dto";
import { AnswersClass, GamesClass } from "../../schemas/games.schema";
import { GetGameByIdCommand } from "../../queries/quiz/get-game-by-id-query";
import { GameIdValidationModel } from "../../dtos/quiz.dto";
import { GetCurrentUnfinishedGameCommand } from "../../queries/quiz/get-current-unfinished-game-by-id-query";
import { SendAnswerCommand } from "../../commands/quiz/send-answer-use-case";

@SkipThrottle()
@Controller("pair-game-quiz/pairs")
export class QuizGameController {
    constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

    @UseGuards(JwtAccessTokenAuthGuard)
    @Get("/my-current")
    async getCurrentUnfinishedGame(@CurrentUserId() userId: string): Promise<GamesClass | null> {
        return await this.queryBus.execute(new GetCurrentUnfinishedGameCommand(userId));
    }

    @UseGuards(JwtAccessTokenAuthGuard)
    @Get("/:id")
    async getGameById(
        @Param() params: GameIdValidationModel,
        @CurrentUser() @CurrentUserId() userId: string,
    ): Promise<GamesClass | null> {
        return await this.queryBus.execute(new GetGameByIdCommand(params.id, userId));
    }

    @UseGuards(JwtAccessTokenAuthGuard)
    @Post("/connection")
    async createGame(@CurrentUser() user: CurrentUserModel): Promise<GamesClass> {
        return await this.commandBus.execute(new CreateGameCommand(user));
    }

    @UseGuards(JwtAccessTokenAuthGuard)
    @Post("/my-current/answers")
    async sendAnswer(@Body() answer: string, @CurrentUserId() userId: string): Promise<AnswersClass> {
        return await this.commandBus.execute(new SendAnswerCommand(answer, userId));
    }
}
