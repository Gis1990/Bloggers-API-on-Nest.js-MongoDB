import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { QuizQueryRepository } from "../../query-repositories/quiz.query.repository";
import { GamesClass } from "../../schemas/games.schema";
import { HttpException } from "@nestjs/common";

export class GetGameByIdCommand {
    constructor(public readonly gameId: string, public readonly userId: string | undefined) {}
}

@QueryHandler(GetGameByIdCommand)
export class GetGameByIdQuery implements IQueryHandler<GetGameByIdCommand> {
    constructor(private quizQueryRepository: QuizQueryRepository) {}

    async execute(query: GetGameByIdCommand): Promise<GamesClass | null> {
        const game = await this.quizQueryRepository.getGameById(query.gameId);
        if (!game) {
            throw new HttpException("Game not found", 404);
        }
        if (
            game.firstPlayerProgress.player.id !== query.userId ||
            game.secondPlayerProgress.player.id !== query.userId
        ) {
            throw new HttpException("Access denied", 403);
        }
        return game;
    }
}
