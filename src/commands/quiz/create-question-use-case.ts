import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreatedNewQuestionDto, InputModelForCreatingAndUpdatingQuestion } from "../../dtos/questions.dto";
import { QuizRepository } from "../../repositories/quiz.repository";
import { QuestionsFactory } from "../../factories/questions.factory";
import { QuestionViewModelClass } from "../../entities/quez.entity";

export class CreateQuestionCommand {
    constructor(public readonly dto: InputModelForCreatingAndUpdatingQuestion) {}
}

@CommandHandler(CreateQuestionCommand)
export class CreateQuestionUseCase implements ICommandHandler<CreateQuestionCommand> {
    constructor(private questionsRepository: QuizRepository) {}

    async execute(command: CreateQuestionCommand): Promise<QuestionViewModelClass> {
        const correctDate = new Date();
        const createdNewQuestionDto: CreatedNewQuestionDto = {
            id: Number(new Date()).toString(),
            body: command.dto.body,
            correctAnswers: command.dto.correctAnswers,
            published: false,
            createdAt: correctDate,
            updatedAt: null,
        };
        const createdQuestion = await this.questionsRepository.createQuestion(createdNewQuestionDto);
        return QuestionsFactory.createQuestionViewModelClass(createdQuestion);
    }
}
