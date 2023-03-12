import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import { GameStatsViewModelDto } from "../../dtos/quiz.dto";
import { QuizQueryRepository } from "../../query-repositories/quiz.query.repository";

export class GetGamesStatsCommand {
    constructor(public readonly userId: string) {}
}

@QueryHandler(GetGamesStatsCommand)
export class GetGamesStatsQuery implements IQueryHandler<GetGamesStatsCommand> {
    constructor(private quizQueryRepository: QuizQueryRepository) {}

    async execute(query: GetGamesStatsCommand): Promise<GameStatsViewModelDto> {
        const games = await this.quizQueryRepository.getAllGamesByUserIdForStats(query.userId);

        let sumScore = 0;
        let playerScore = 0;
        let gamesCount = 0;
        let winsCount = 0;
        let lossesCount = 0;
        let drawsCount = 0;

        for (let i = 0; i < games.length; i++) {
            const game = games[i];

            if (
                game.firstPlayerProgress.player.id === query.userId ||
                game.secondPlayerProgress.player.id === query.userId
            ) {
                gamesCount++;

                if (game.firstPlayerProgress.player.id === query.userId) {
                    sumScore += game.firstPlayerProgress.score;
                    playerScore += game.firstPlayerProgress.score;
                } else {
                    sumScore += game.secondPlayerProgress.score;
                    playerScore += game.secondPlayerProgress.score;
                }

                const firstPlayerScore = game.firstPlayerProgress.score;
                const secondPlayerScore = game.secondPlayerProgress.score;

                if (firstPlayerScore > secondPlayerScore) {
                    if (game.firstPlayerProgress.player.id === query.userId) {
                        winsCount++;
                    } else {
                        lossesCount++;
                    }
                } else if (secondPlayerScore > firstPlayerScore) {
                    if (game.secondPlayerProgress.player.id === query.userId) {
                        winsCount++;
                    } else {
                        lossesCount++;
                    }
                } else {
                    drawsCount++;
                }
            }
        }

        const avgPlayerScore = gamesCount > 0 ? playerScore / gamesCount : 0;
        return {
            sumScore: sumScore,
            avgScores: Number(avgPlayerScore.toFixed(2)),
            gamesCount: gamesCount,
            winsCount: winsCount,
            lossesCount: lossesCount,
            drawsCount: drawsCount,
        };
    }
}
