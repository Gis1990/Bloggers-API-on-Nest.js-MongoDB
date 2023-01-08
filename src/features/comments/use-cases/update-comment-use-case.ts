import { HttpException } from "@nestjs/common";
import { CommentsRepository } from "../comments.repository";
import { CommentsQueryRepository } from "../comments.query.repository";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

export class UpdateCommentCommand {
    constructor(
        public readonly id: string,
        public readonly content: string,
        public readonly userId: string | undefined,
    ) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUseCase implements ICommandHandler<UpdateCommentCommand> {
    constructor(
        private commentsRepository: CommentsRepository,
        private commentsQueryRepository: CommentsQueryRepository,
    ) {}

    async execute(command: UpdateCommentCommand): Promise<boolean> {
        const comment = await this.commentsQueryRepository.getCommentById(command.id, command.userId);
        if (!comment) {
            return false;
        }
        if (command.userId !== comment.userId) throw new HttpException("Incorrect id", 403);
        return this.commentsRepository.updateCommentById(command.id, command.content);
    }
}
