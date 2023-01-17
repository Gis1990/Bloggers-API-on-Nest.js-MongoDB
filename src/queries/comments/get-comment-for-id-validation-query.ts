import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { CommentsQueryRepository } from "../../query-repositories/comments.query.repository";
import { CommentClass } from "../../schemas/comments.schema";

export class GetCommentForIdValidationCommand {
    constructor(public readonly id: string) {}
}

@QueryHandler(GetCommentForIdValidationCommand)
export class GetCommentForIdValidationQuery implements IQueryHandler<GetCommentForIdValidationCommand> {
    constructor(private commentsQueryRepository: CommentsQueryRepository) {}

    async execute(query: GetCommentForIdValidationCommand): Promise<CommentClass | null> {
        return await this.commentsQueryRepository.getCommentForIdValidation(query.id);
    }
}
