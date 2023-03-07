import { Module } from "@nestjs/common";
import { QuizGameController } from "./quiz.game.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { CqrsModule } from "@nestjs/cqrs";
import { CreateGameUseCase } from "../../commands/quiz/create-game-use-case";
import { GamesClass, GamesSchema } from "../../schemas/games.schema";
import { GetGameByIdQuery } from "../../queries/quiz/get-game-by-id-query";
import { QuizQueryRepository } from "../../query-repositories/quiz.query.repository";
import { QuizRepository } from "../../repositories/quiz.repository";
import { QuestionClass, QuestionSchema } from "../../schemas/questions.schema";
import { GetCurrentUnfinishedGameQuery } from "../../queries/quiz/get-current-unfinished-game-by-id-query";
import { SendAnswerUseCase } from "../../commands/quiz/send-answer-use-case";

const useCases = [CreateGameUseCase, SendAnswerUseCase];
const queries = [GetGameByIdQuery, GetCurrentUnfinishedGameQuery];

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
        ]),
    ],
    controllers: [QuizGameController],
    providers: [QuizRepository, QuizQueryRepository, ...useCases, ...queries],
    exports: [],
})
export class QuizGameModule {}
