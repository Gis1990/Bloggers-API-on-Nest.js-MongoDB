import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { QuizQueryRepository } from "../../query-repositories/quiz.query.repository";
import { QuestionViewModelClass } from "../../entities/quez.entity";

export class GetQuestionByIdCommand {
    constructor(public readonly questionId: string) {}
}

@QueryHandler(GetQuestionByIdCommand)
export class GetQuestionByIdQuery implements IQueryHandler<GetQuestionByIdCommand> {
    constructor(private questionsQueryRepository: QuizQueryRepository) {}

    async execute(query: GetQuestionByIdCommand): Promise<QuestionViewModelClass | null> {
        return await this.questionsQueryRepository.getQuestionById(query.questionId);
    }
}
