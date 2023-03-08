import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { QuizRepository } from "../../repositories/quiz.repository";
import { AnswersClass } from "../../schemas/games.schema";
import { HttpException } from "@nestjs/common";
import { QuizQueryRepository } from "../../query-repositories/quiz.query.repository";

export class SendAnswerCommand {
    constructor(public readonly answer: string, public readonly userId: string) {}
}

@CommandHandler(SendAnswerCommand)
export class SendAnswerUseCase implements ICommandHandler<SendAnswerCommand> {
    constructor(private quizRepository: QuizRepository, private quizQueryRepository: QuizQueryRepository) {}

    async execute(command: SendAnswerCommand): Promise<AnswersClass> {
        const game = await this.quizQueryRepository.getGameByUserId(command.userId);
        if (!game) {
            throw new HttpException("Not Found", 404);
        }
        if (game.status !== "Active") {
            throw new HttpException("Access denied", 403);
        }
        if (game.firstPlayerProgress.answers.length === 5 || game.secondPlayerProgress.answers.length === 5) {
            throw new HttpException("Access denied", 403);
        }
        let update = {};
        const dataForUpdateInSet = {};
        const dateOfAnswer = new Date();
        let score;
        let answerStatusForUpdate;
        let id;
        let isAnswerCorrect;
        let finishedGameDate;
        const stringPlayerForUpdate =
            game.firstPlayerProgress.player.id === command.userId ? "firstPlayerProgress" : "secondPlayerProgress";
        const playerProgress =
            game.firstPlayerProgress.player.id === command.userId
                ? game.firstPlayerProgress
                : game.secondPlayerProgress;
        const numOfAnswers = playerProgress.answers.length;

        if (numOfAnswers < 5) {
            score = playerProgress.score;
            id = game.questions[numOfAnswers].id;
            isAnswerCorrect = await this.quizRepository.checkAnswerCorrectness(id, command.answer);
            answerStatusForUpdate = isAnswerCorrect ? "Correct" : "Incorrect";
            score = isAnswerCorrect ? +1 : +0;
            dataForUpdateInSet[`${stringPlayerForUpdate}.score`] = score;
            update = {
                $push: {
                    [`${stringPlayerForUpdate}.answers`]: {
                        questionId: id,
                        answerStatus: answerStatusForUpdate,
                        addedAt: dateOfAnswer,
                    },
                },
                $set: dataForUpdateInSet,
            };
        } else {
            score = playerProgress.score;
            const oppProgress =
                playerProgress === game.firstPlayerProgress ? game.secondPlayerProgress : game.firstPlayerProgress;
            id = game.questions[4].id;
            isAnswerCorrect = await this.quizRepository.checkAnswerCorrectness(id, command.answer);
            answerStatusForUpdate = isAnswerCorrect ? "Correct" : "Incorrect";
            if (isAnswerCorrect) {
                answerStatusForUpdate = "Correct";
                score = oppProgress.answers.length !== 5 ? +2 : +1;
            } else {
                answerStatusForUpdate = "Incorrect";
                score =
                    playerProgress.answers.map((a) => a.answerStatus).includes("Correct") &&
                    oppProgress.answers.length !== 5
                        ? +1
                        : +0;
            }
            dataForUpdateInSet[`${stringPlayerForUpdate}.score`] = score;
            if (oppProgress.answers.length === 5) {
                finishedGameDate = dateOfAnswer;
            } else {
                finishedGameDate = game.finishGameDate;
            }
            dataForUpdateInSet["finishGameDate"] = finishedGameDate;
            update = {
                $push: {
                    [`${stringPlayerForUpdate}.answers`]: {
                        questionId: id,
                        answerStatus: answerStatusForUpdate,
                        addedAt: dateOfAnswer,
                    },
                },
                $set: dataForUpdateInSet,
            };
        }
        await this.quizRepository.updateGameById(game.id, update);
        return {
            questionId: id,
            answerStatus: answerStatusForUpdate,
            addedAt: dateOfAnswer,
        };
    }
}
