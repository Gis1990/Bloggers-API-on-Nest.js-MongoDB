import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { CommentsQueryRepository } from "../../comments.query.repository";
import { CommentViewModelClass } from "../../entities/comments.entity";

export class GetCommentForIdValidationCommand {
    constructor(public id: string) {}
}

@QueryHandler(GetCommentForIdValidationCommand)
export class GetCommentForIdValidationQuery implements IQueryHandler<GetCommentForIdValidationCommand> {
    constructor(private commentsQueryRepository: CommentsQueryRepository) {}

    async execute(query: GetCommentForIdValidationCommand): Promise<CommentViewModelClass | null> {
        return await this.commentsQueryRepository.getCommentForIdValidation(query.id);
    }
}
