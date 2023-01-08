import { HttpException } from "@nestjs/common";
import { CommentsRepository } from "../comments.repository";
import { CommentsQueryRepository } from "../comments.query.repository";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

export class DeleteCommentCommand {
    constructor(public readonly id: string, public readonly userId: string | undefined) {}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase implements ICommandHandler<DeleteCommentCommand> {
    constructor(
        private commentsRepository: CommentsRepository,
        private commentsQueryRepository: CommentsQueryRepository,
    ) {}

    async execute(command: DeleteCommentCommand): Promise<boolean> {
        const comment = await this.commentsQueryRepository.getCommentById(command.id, command.userId);
        if (!comment) {
            return false;
        }
        if (command.userId !== comment.userId) throw new HttpException("Incorrect id", 403);
        return this.commentsRepository.deleteCommentById(command.id);
    }
}
