import { HttpException } from "@nestjs/common";
import { CommentsRepository } from "../../repositories/comments.repository";
import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { GetCommentByIdCommand } from "../../queries/comments/get-comment-by-id-query";

export class DeleteCommentCommand {
    constructor(public readonly id: string, public readonly userId: string | undefined) {}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase implements ICommandHandler<DeleteCommentCommand> {
    constructor(private commentsRepository: CommentsRepository, private queryBus: QueryBus) {}

    async execute(command: DeleteCommentCommand): Promise<boolean> {
        const comment = await this.queryBus.execute(new GetCommentByIdCommand(command.id, command.userId));
        if (!comment) {
            return false;
        }
        if (command.userId !== comment.commentatorInfo.userId) throw new HttpException("Incorrect id", 403);
        return this.commentsRepository.deleteCommentById(command.id);
    }
}
