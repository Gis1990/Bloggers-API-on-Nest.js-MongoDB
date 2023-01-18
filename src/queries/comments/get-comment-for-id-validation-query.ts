import { IQueryHandler, QueryBus, QueryHandler } from "@nestjs/cqrs";
import { CommentsQueryRepository } from "../../query-repositories/comments.query.repository";
import { CommentClass } from "../../schemas/comments.schema";
import { GetAllBannedUsersBySuperAdminCommand } from "../users/get-all-banned-users-by-super-admin-query";

export class GetCommentForIdValidationCommand {
    constructor(public readonly id: string) {}
}

@QueryHandler(GetCommentForIdValidationCommand)
export class GetCommentForIdValidationQuery implements IQueryHandler<GetCommentForIdValidationCommand> {
    constructor(private commentsQueryRepository: CommentsQueryRepository, private queryBus: QueryBus) {}

    async execute(query: GetCommentForIdValidationCommand): Promise<CommentClass | null> {
        const bannedUsersIdsBySuperAdmin = await this.queryBus.execute(new GetAllBannedUsersBySuperAdminCommand());
        const comment = await this.commentsQueryRepository.getCommentById(query.id);
        if (!comment || bannedUsersIdsBySuperAdmin.includes(comment.commentatorInfo.userId)) {
            return null;
        } else {
            return comment;
        }
    }
}
