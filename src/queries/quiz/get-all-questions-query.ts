import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { HelperForQuestions } from "../../query-repositories/helpers/helpers.for.questions.query.repository";
import { ModelForGettingAllQuestions } from "../../dtos/quiz.dto";
import { QuizQueryRepository } from "../../query-repositories/quiz.query.repository";
import { QuizFactory } from "../../factories/quiz.factory";
import { QuestionViewModelPaginationClass } from "../../entities/quez.entity";

export class GetAllQuestionsCommand {
    constructor(public dto: ModelForGettingAllQuestions) {}
}

@QueryHandler(GetAllQuestionsCommand)
export class GetAllQuestionsQuery implements IQueryHandler<GetAllQuestionsCommand> {
    constructor(private quizQueryRepository: QuizQueryRepository) {}

    async execute(query: GetAllQuestionsCommand): Promise<QuestionViewModelPaginationClass> {
        const dto = await HelperForQuestions.createQueryForGettingAllQuestions(query.dto);
        const questions = await this.quizQueryRepository.getAllQuestions(dto);
        return await QuizFactory.createQuestionViewModelPaginationClass(questions);
    }
}
