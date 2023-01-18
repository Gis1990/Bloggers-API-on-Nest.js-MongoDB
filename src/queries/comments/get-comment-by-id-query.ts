import { IQueryHandler, QueryBus, QueryHandler } from "@nestjs/cqrs";
import { CommentsQueryRepository } from "../../query-repositories/comments.query.repository";
import { CommentViewModelClass } from "../../entities/comments.entity";
import { GetAllBannedUsersBySuperAdminCommand } from "../users/get-all-banned-users-by-super-admin-query";
import { HelperForComments } from "../../query-repositories/helpers/helpers.for.comments.query.repository";
import { CommentsFactory } from "../../factories/comments.factory";

export class GetCommentByIdCommand {
    constructor(public id: string, public userId: string) {}
}

@QueryHandler(GetCommentByIdCommand)
export class GetCommentByIdQuery implements IQueryHandler<GetCommentByIdCommand> {
    constructor(private commentsQueryRepository: CommentsQueryRepository, private queryBus: QueryBus) {}

    async execute(query: GetCommentByIdCommand): Promise<CommentViewModelClass> {
        const bannedUsersIdsBySuperAdmin = await this.queryBus.execute(new GetAllBannedUsersBySuperAdminCommand());
        const comment = await this.commentsQueryRepository.getCommentById(query.id);
        if (!comment) return null;
        const correctComment = await HelperForComments.getLikesDataInfoForComment(
            query.userId,
            bannedUsersIdsBySuperAdmin,
            comment,
        );
        return CommentsFactory.createCommentViewModelClass(correctComment);
    }
}
