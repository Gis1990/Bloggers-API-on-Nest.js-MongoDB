import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { CommentsQueryRepository } from "../../query-repositories/comments.query.repository";
import { CommentViewModelClass } from "../../entities/comments.entity";

export class GetCommentByIdCommand {
    constructor(public id: string, public userId: string) {}
}

@QueryHandler(GetCommentByIdCommand)
export class GetCommentByIdQuery implements IQueryHandler<GetCommentByIdCommand> {
    constructor(private commentsQueryRepository: CommentsQueryRepository) {}

    async execute(query: GetCommentByIdCommand): Promise<CommentViewModelClass> {
        return await this.commentsQueryRepository.getCommentById(query.id, query.userId);
    }
}
