import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { QuizRepository } from "../../repositories/quiz.repository";
import { AnswersClass } from "../../schemas/games.schema";
import { HttpException } from "@nestjs/common";
import { QuizQueryRepository } from "../../query-repositories/quiz.query.repository";
import { CurrentUserModel } from "../../dtos/auth.dto";
import { GetGamesStatsCommand } from "../../queries/quiz/get-games-stats-for-user-query";

export class SendAnswerCommand {
    constructor(public readonly answer: string, public readonly user: CurrentUserModel) {}
}

@CommandHandler(SendAnswerCommand)
export class SendAnswerUseCase implements ICommandHandler<SendAnswerCommand> {
    constructor(
        private quizRepository: QuizRepository,
        private queryBus: QueryBus,
        private quizQueryRepository: QuizQueryRepository,
    ) {}

    async execute(command: SendAnswerCommand): Promise<AnswersClass> {
        const game = await this.quizQueryRepository.getGameByUserId(command.user.id);
        if (!game) {
            throw new HttpException("Game not found", 403);
        }
        if (game.status !== "Active") {
            throw new HttpException("Access denied", 403);
        }
        let update = {};
        const dataForUpdateInSet = {};
        const dateOfAnswer = new Date();
        let score;
        let oppositePlayerScore;
        let answerStatusForUpdate;
        let id;
        let isAnswerCorrect;
        const playerProgress =
            game.firstPlayerProgress.player.id === command.user.id
                ? game.firstPlayerProgress
                : game.secondPlayerProgress;
        const oppositePlayerProgress =
            playerProgress === game.firstPlayerProgress ? game.secondPlayerProgress : game.firstPlayerProgress;
        const stringForPlayerUpdate =
            playerProgress === game.firstPlayerProgress ? "firstPlayerProgress" : "secondPlayerProgress";
        const stringForOppositePlayerUpdate =
            stringForPlayerUpdate === "firstPlayerProgress" ? "secondPlayerProgress" : "firstPlayerProgress";
        if (playerProgress.answers.length === 5) {
            throw new HttpException("Access denied", 403);
        }
        const numOfAnswers = playerProgress.answers.length;

        if (oppositePlayerProgress.answers.length === 5 && playerProgress.answers.length === 4) {
            score = playerProgress.score;
            id = game.questions[4].id;
            isAnswerCorrect = await this.quizRepository.checkAnswerCorrectness(id, command.answer);
            if (isAnswerCorrect) {
                answerStatusForUpdate = "Correct";
                score += 1;
            } else {
                answerStatusForUpdate = "Incorrect";
            }
            oppositePlayerScore = oppositePlayerProgress.answers.map((a) => a.answerStatus).includes("Correct")
                ? oppositePlayerProgress.score + 1
                : oppositePlayerProgress.score;
            dataForUpdateInSet[`${stringForOppositePlayerUpdate}.score`] = oppositePlayerScore;
            dataForUpdateInSet["finishGameDate"] = dateOfAnswer;
            dataForUpdateInSet["status"] = "Finished";
            dataForUpdateInSet[`${stringForPlayerUpdate}.score`] = score;
            update = {
                $push: {
                    [`${stringForPlayerUpdate}.answers`]: {
                        questionId: id,
                        answerStatus: answerStatusForUpdate,
                        addedAt: dateOfAnswer,
                    },
                },
                $set: dataForUpdateInSet,
            };
            await this.quizRepository.updateGameById(game.id, update);
            const resultsForPlayerOne = await this.queryBus.execute(
                new GetGamesStatsCommand(game.firstPlayerProgress.player.id),
            );
            const resultsForPlayerTwo = await this.queryBus.execute(
                new GetGamesStatsCommand(game.secondPlayerProgress.player.id),
            );
            await this.quizRepository.updateGameStatsForPlayer(
                resultsForPlayerOne,
                game.firstPlayerProgress.player.id,
                game.firstPlayerProgress.player.login,
            );
            await this.quizRepository.updateGameStatsForPlayer(
                resultsForPlayerTwo,
                game.secondPlayerProgress.player.id,
                game.firstPlayerProgress.player.login,
            );
        } else {
            score = playerProgress.score;
            id = game.questions[numOfAnswers].id;
            isAnswerCorrect = await this.quizRepository.checkAnswerCorrectness(id, command.answer);
            answerStatusForUpdate = isAnswerCorrect ? "Correct" : "Incorrect";
            score = isAnswerCorrect ? (score += 1) : (score += 0);
            dataForUpdateInSet[`${stringForPlayerUpdate}.score`] = score;
            update = {
                $push: {
                    [`${stringForPlayerUpdate}.answers`]: {
                        questionId: id,
                        answerStatus: answerStatusForUpdate,
                        addedAt: dateOfAnswer,
                    },
                },
                $set: dataForUpdateInSet,
            };
            await this.quizRepository.updateGameById(game.id, update);
        }
        return {
            questionId: id,
            answerStatus: answerStatusForUpdate,
            addedAt: dateOfAnswer,
        };
    }
}
