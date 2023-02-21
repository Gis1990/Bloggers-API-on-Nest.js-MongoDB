import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { HelperForQuestions } from "../../query-repositories/helpers/helpers.for.questions.query.repository";
import { ModelForGettingAllQuestions } from "../../dtos/questions.dto";
import { QuizQueryRepository } from "../../query-repositories/quiz.query.repository";
import { QuestionsFactory } from "../../factories/questions.factory";
import { QuestionViewModelPaginationClass } from "../../entities/quez.entity";

export class GetAllQuestionsCommand {
    constructor(public dto: ModelForGettingAllQuestions) {}
}

@QueryHandler(GetAllQuestionsCommand)
export class GetAllQuestionsQuery implements IQueryHandler<GetAllQuestionsCommand> {
    constructor(private questionsQueryRepository: QuizQueryRepository) {}

    async execute(query: GetAllQuestionsCommand): Promise<QuestionViewModelPaginationClass> {
        const dto = await HelperForQuestions.createQueryForGettingAllQuestions(query.dto);
        const questions = await this.questionsQueryRepository.getAllQuestions(dto);
        return await QuestionsFactory.createQuestionViewModelPaginationClass(questions);
    }
}
