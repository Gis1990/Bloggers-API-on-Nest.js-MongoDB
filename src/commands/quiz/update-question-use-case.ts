import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InputModelForCreatingAndUpdatingQuestion } from "../../dtos/quiz.dto";
import { QuizRepository } from "../../repositories/quiz.repository";

export class UpdateQuestionCommand {
    constructor(public readonly dto: InputModelForCreatingAndUpdatingQuestion, public readonly id: string) {}
}

@CommandHandler(UpdateQuestionCommand)
export class UpdateQuestionUseCase implements ICommandHandler<UpdateQuestionCommand> {
    constructor(private quizRepository: QuizRepository) {}

    async execute(command: UpdateQuestionCommand): Promise<boolean> {
        return this.quizRepository.updateQuestionById(command.id, command.dto);
    }
}
