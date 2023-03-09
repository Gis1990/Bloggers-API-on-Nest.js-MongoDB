import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { HelperForQuiz } from "../../query-repositories/helpers/helpers.for.quiz.query.repository";
import { ModelForGettingAllGamesForUser } from "../../dtos/quiz.dto";
import { QuizQueryRepository } from "../../query-repositories/quiz.query.repository";
import { AllGamesViewModelClass } from "../../entities/quiz.entity";

export class GetAllGamesForUserCommand {
    constructor(public readonly dto: ModelForGettingAllGamesForUser, public readonly userId: string) {}
}

@QueryHandler(GetAllGamesForUserCommand)
export class GetAllGamesForUserQuery implements IQueryHandler<GetAllGamesForUserCommand> {
    constructor(private quizQueryRepository: QuizQueryRepository) {}

    async execute(query: GetAllGamesForUserCommand): Promise<AllGamesViewModelClass> {
        const dto = await HelperForQuiz.createQueryForGettingAllGamesForUser(query.dto);
        return await this.quizQueryRepository.getAllGamesForUser(dto, query.userId);
    }
}
