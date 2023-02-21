import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InputModelForCreatingAndUpdatingQuestion } from "../../dtos/questions.dto";
import { QuizRepository } from "../../repositories/quiz.repository";

export class UpdateQuestionCommand {
    constructor(public readonly dto: InputModelForCreatingAndUpdatingQuestion, public readonly id: string) {}
}

@CommandHandler(UpdateQuestionCommand)
export class UpdateQuestionUseCase implements ICommandHandler<UpdateQuestionCommand> {
    constructor(private questionsRepository: QuizRepository) {}

    async execute(command: UpdateQuestionCommand): Promise<boolean> {
        return this.questionsRepository.updateQuestionById(command.id, command.dto);
    }
}
