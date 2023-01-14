import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { CommentsQueryRepository } from "../../comments.query.repository";
import { CommentClass } from "../../comments.schema";

export class GetCommentForIdValidationCommand {
    constructor(public id: string) {}
}

@QueryHandler(GetCommentForIdValidationCommand)
export class GetCommentForIdValidationQuery implements IQueryHandler<GetCommentForIdValidationCommand> {
    constructor(private commentsQueryRepository: CommentsQueryRepository) {}

    async execute(query: GetCommentForIdValidationCommand): Promise<CommentClass | null> {
        return await this.commentsQueryRepository.getCommentForIdValidation(query.id);
    }
}
