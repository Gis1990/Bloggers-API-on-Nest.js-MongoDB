import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { HelperForQuiz } from "../../query-repositories/helpers/helpers.for.quiz.query.repository";
import { ModelForGettingTopUsers } from "../../dtos/quiz.dto";
import { QuizQueryRepository } from "../../query-repositories/quiz.query.repository";
import { TopUsersModelPaginationClass } from "../../entities/quiz.entity";

export class GetTopUsersCommand {
    constructor(public dto: ModelForGettingTopUsers) {}
}

@QueryHandler(GetTopUsersCommand)
export class GetTopUsersQuery implements IQueryHandler<GetTopUsersCommand> {
    constructor(private quizQueryRepository: QuizQueryRepository) {}

    async execute(query: GetTopUsersCommand): Promise<TopUsersModelPaginationClass> {
        const dto = await HelperForQuiz.createQueryForGettingTopUsers(query.dto);
        return await this.quizQueryRepository.getTopUsers(dto);
    }
}
