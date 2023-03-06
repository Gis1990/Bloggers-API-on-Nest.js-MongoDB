import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { QuizRepository } from "../../repositories/quiz.repository";

export class DeleteQuestionCommand {
    constructor(public readonly id: string) {}
}

@CommandHandler(DeleteQuestionCommand)
export class DeleteQuestionUseCase implements ICommandHandler<DeleteQuestionCommand> {
    constructor(private quizRepository: QuizRepository) {}

    async execute(command: DeleteQuestionCommand): Promise<boolean> {
        return this.quizRepository.deleteQuestionById(command.id);
    }
}
