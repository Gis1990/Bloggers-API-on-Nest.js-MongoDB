import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { QuizRepository } from "../../repositories/quiz.repository";
import { CurrentUserModel } from "../../dtos/auth.dto";
import { GamesClass } from "../../schemas/games.schema";
import { QuizQueryRepository } from "../../query-repositories/quiz.query.repository";
import { UpdatedGameDto } from "../../dtos/quiz.dto";
import { HttpException } from "@nestjs/common";

export class CreateGameCommand {
    constructor(public readonly user: CurrentUserModel) {}
}

@CommandHandler(CreateGameCommand)
export class CreateGameUseCase implements ICommandHandler<CreateGameCommand> {
    constructor(private quizRepository: QuizRepository, private quizQueryRepository: QuizQueryRepository) {}

    async execute(command: CreateGameCommand): Promise<GamesClass> {
        const pendingGame: GamesClass = await this.quizQueryRepository.getPendingGame();
        const questionsForTheGame = await this.quizQueryRepository.getQuestionsForTheGame();
        const game = await this.quizQueryRepository.getGameByUserId(command.user.id);
        if (game) {
            throw new HttpException("Access denied", 403);
        }
        if (pendingGame) {
            const secondPlayerData = { id: command.user.id, login: command.user.login };
            const secondPlayer = { answers: [], player: secondPlayerData, score: 0 };
            const updatedGameDto: UpdatedGameDto = {
                id: pendingGame.id,
                secondPlayerProgress: secondPlayer,
                questions: questionsForTheGame,
                status: "Active",
                startGameDate: new Date(),
            };
            return await this.quizRepository.updateNewCreatedGame(updatedGameDto);
        } else {
            const playerOneData = { id: command.user.id, login: command.user.login };
            const firstPlayer = { answers: [], player: playerOneData, score: 0 };
            const createdNewGameDto = {
                id: Number(new Date()).toString(),
                firstPlayerProgress: firstPlayer,
                secondPlayerProgress: null,
                questions: null,
                status: "PendingSecondPlayer",
                pairCreatedDate: new Date(),
                startGameDate: null,
                finishGameDate: null,
            };
            return await this.quizRepository.createGame(createdNewGameDto);
        }
    }
}
