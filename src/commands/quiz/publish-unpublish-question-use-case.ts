import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InputModelForPublishUnpublishQuestion } from "../../dtos/quiz.dto";
import { QuizRepository } from "../../repositories/quiz.repository";

export class PublishUnpublishQuestionCommand {
    constructor(public readonly dto: InputModelForPublishUnpublishQuestion, public readonly id: string) {}
}

@CommandHandler(PublishUnpublishQuestionCommand)
export class PublishUnpublishQuestionUseCase implements ICommandHandler<PublishUnpublishQuestionCommand> {
    constructor(private quizRepository: QuizRepository) {}

    async execute(command: PublishUnpublishQuestionCommand): Promise<boolean> {
        return this.quizRepository.publishUnpublishQuestion(command.id, command.dto);
    }
}
