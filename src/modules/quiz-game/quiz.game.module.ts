import { Module } from "@nestjs/common";
import { QuizGameController } from "./quiz.game.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { CqrsModule } from "@nestjs/cqrs";
import { CreateGameUseCase } from "../../commands/quiz/create-game-use-case";
import { GamesClass, GamesSchema, TopUsersStatsClass, TopUsersStatsSchema } from "../../schemas/games.schema";
import { GetGameByIdQuery } from "../../queries/quiz/get-game-by-id-query";
import { QuizQueryRepository } from "../../query-repositories/quiz.query.repository";
import { QuizRepository } from "../../repositories/quiz.repository";
import { QuestionClass, QuestionSchema } from "../../schemas/questions.schema";
import { GetCurrentUnfinishedGameQuery } from "../../queries/quiz/get-current-unfinished-game-by-id-query";
import { SendAnswerUseCase } from "../../commands/quiz/send-answer-use-case";
import { GetAllGamesForUserQuery } from "../../queries/quiz/get-all-games-for-user-query";
import { GetGamesStatsQuery } from "../../queries/quiz/get-games-stats-for-user-query";
import { GetTopUsersQuery } from "../../queries/quiz/get-top-users-query";

const useCases = [CreateGameUseCase, SendAnswerUseCase];
const queries = [
    GetGameByIdQuery,
    GetCurrentUnfinishedGameQuery,
    GetAllGamesForUserQuery,
    GetGamesStatsQuery,
    GetTopUsersQuery,
];

@Module({
    imports: [
        CqrsModule,
        MongooseModule.forFeature([
            {
                name: GamesClass.name,
                schema: GamesSchema,
            },
            {
                name: QuestionClass.name,
                schema: QuestionSchema,
            },
            {
                name: TopUsersStatsClass.name,
                schema: TopUsersStatsSchema,
            },
        ]),
    ],
    controllers: [QuizGameController],
    providers: [QuizRepository, QuizQueryRepository, ...useCases, ...queries],
    exports: [],
})
export class QuizGameModule {}
