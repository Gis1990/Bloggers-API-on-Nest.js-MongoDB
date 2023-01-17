import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { CommentsQueryRepository } from "../../query-repositories/comments.query.repository";
import { CommentClass } from "../../schemas/comments.schema";

export class GetCommentByIdForLikeOperationCommand {
    constructor(public id: string) {}
}

@QueryHandler(GetCommentByIdForLikeOperationCommand)
export class GetCommentByIdForLikeOperationQuery implements IQueryHandler<GetCommentByIdForLikeOperationCommand> {
    constructor(private commentsQueryRepository: CommentsQueryRepository) {}

    async execute(query: GetCommentByIdForLikeOperationCommand): Promise<CommentClass> {
        return await this.commentsQueryRepository.getCommentByIdForLikeOperation(query.id);
    }
}
