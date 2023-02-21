import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InputModelForPublishUnpublishQuestion } from "../../dtos/questions.dto";
import { QuizRepository } from "../../repositories/quiz.repository";

export class PublishUnpublishQuestionCommand {
    constructor(public readonly dto: InputModelForPublishUnpublishQuestion, public readonly id: string) {}
}

@CommandHandler(PublishUnpublishQuestionCommand)
export class PublishUnpublishQuestionUseCase implements ICommandHandler<PublishUnpublishQuestionCommand> {
    constructor(private questionsRepository: QuizRepository) {}

    async execute(command: PublishUnpublishQuestionCommand): Promise<boolean> {
        return this.questionsRepository.publishUnpublishQuestion(command.id, command.dto);
    }
}
