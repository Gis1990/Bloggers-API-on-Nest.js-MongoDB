import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { CommentsQueryRepository } from "../../comments.query.repository";
import { CommentClass } from "../../comments.schema";

export class GetCommentByIdForLikeOperationCommand {
    constructor(public id: string) {}
}

@QueryHandler(GetCommentByIdForLikeOperationCommand)
export class GetCommentByIdForLikeOperationQuery implements IQueryHandler<GetCommentByIdForLikeOperationCommand> {
    constructor(private commentsQueryRepository: CommentsQueryRepository) {}

    async execute(query: GetCommentByIdForLikeOperationCommand): Promise<CommentClass | null> {
        return await this.commentsQueryRepository.getCommentByIdForLikeOperation(query.id);
    }
}
