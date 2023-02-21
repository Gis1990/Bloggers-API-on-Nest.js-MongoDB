import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { QuizRepository } from "../../repositories/quiz.repository";

export class DeleteQuestionCommand {
    constructor(public readonly id: string) {}
}

@CommandHandler(DeleteQuestionCommand)
export class DeleteQuestionUseCase implements ICommandHandler<DeleteQuestionCommand> {
    constructor(private questionsRepository: QuizRepository) {}

    async execute(command: DeleteQuestionCommand): Promise<boolean> {
        return this.questionsRepository.deleteQuestionById(command.id);
    }
}
