import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { QuizQueryRepository } from "../../query-repositories/quiz.query.repository";
import { GamesClass } from "../../schemas/games.schema";
import { HttpException } from "@nestjs/common";

export class GetCurrentUnfinishedGameCommand {
    constructor(public readonly userId: string) {}
}

@QueryHandler(GetCurrentUnfinishedGameCommand)
export class GetCurrentUnfinishedGameQuery implements IQueryHandler<GetCurrentUnfinishedGameCommand> {
    constructor(private quizQueryRepository: QuizQueryRepository) {}

    async execute(query: GetCurrentUnfinishedGameCommand): Promise<GamesClass | null> {
        const game = await this.quizQueryRepository.getGameByUserId(query.userId);
        if (!game) {
            throw new HttpException("Not found", 404);
        }
        return await this.quizQueryRepository.getGameByUserId(query.userId);
    }
}
