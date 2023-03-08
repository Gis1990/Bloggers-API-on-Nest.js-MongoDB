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
        const gameByGameId = await this.quizQueryRepository.getGameById(query.gameId);
        if (!gameByGameId) {
            throw new HttpException("Game not found", 404);
        }
        return gameByGameId;
    }
}
