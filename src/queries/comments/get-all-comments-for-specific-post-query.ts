import { IQueryHandler, QueryBus, QueryHandler } from "@nestjs/cqrs";
import { CommentViewModelPaginationClass } from "../../entities/comments.entity";
import { CommentsQueryRepository } from "../../query-repositories/comments.query.repository";
import { ModelForGettingAllComments } from "../../dtos/comments.dto";
import { GetAllBannedUsersBySuperAdminCommand } from "../users/get-all-banned-users-by-super-admin-query";
import { HelperForComments } from "../../query-repositories/helpers/helpers.for.comments.query.repository";
import { CommentsFactory } from "../../factories/comments.factory";

export class GetAllCommentsForSpecificPostCommand {
    constructor(public dto: ModelForGettingAllComments, public postId: string, public userId: string | undefined) {}
}

@QueryHandler(GetAllCommentsForSpecificPostCommand)
export class GetAllCommentsForSpecificPostQuery implements IQueryHandler<GetAllCommentsForSpecificPostCommand> {
    constructor(private commentsQueryRepository: CommentsQueryRepository, private queryBus: QueryBus) {}

    async execute(query: GetAllCommentsForSpecificPostCommand): Promise<CommentViewModelPaginationClass> {
        const bannedUsersIdsBySuperAdmin = await this.queryBus.execute(new GetAllBannedUsersBySuperAdminCommand());
        const dto = await HelperForComments.createQuery(query.dto);
        const comments = await this.commentsQueryRepository.getAllCommentsForSpecificPost(dto, query.postId);
        comments.items.forEach((elem) => {
            HelperForComments.getLikesDataInfoForComment(query.userId, bannedUsersIdsBySuperAdmin, elem);
        });
        return await CommentsFactory.createCommentViewModelClassPagination(comments);
    }
}
