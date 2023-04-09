import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreatedNewQuestionDto, InputModelForCreatingAndUpdatingQuestion } from "../../dtos/quiz.dto";
import { QuizRepository } from "../../repositories/quiz.repository";
import { QuizFactory } from "../../factories/quiz.factory";
import { QuestionViewModelClass } from "../../entities/quiz.entity";
import { v4 as uuidv4 } from "uuid";

export class CreateQuestionCommand {
    constructor(public readonly dto: InputModelForCreatingAndUpdatingQuestion) {}
}

@CommandHandler(CreateQuestionCommand)
export class CreateQuestionUseCase implements ICommandHandler<CreateQuestionCommand> {
    constructor(private quizRepository: QuizRepository) {}

    async execute(command: CreateQuestionCommand): Promise<QuestionViewModelClass> {
        const correctDate = new Date();
        const createdNewQuestionDto: CreatedNewQuestionDto = {
            id: uuidv4(),
            body: command.dto.body,
            correctAnswers: command.dto.correctAnswers,
            published: false,
            createdAt: correctDate,
            updatedAt: null,
        };
        const createdQuestion = await this.quizRepository.createQuestion(createdNewQuestionDto);
        return QuizFactory.createQuestionViewModelClass(createdQuestion);
    }
}
