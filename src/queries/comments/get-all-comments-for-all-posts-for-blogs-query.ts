import { IQueryHandler, QueryBus, QueryHandler } from "@nestjs/cqrs";
import { CommentViewModelForBloggerPaginationClass } from "../../entities/comments.entity";
import { CommentsQueryRepository } from "../../query-repositories/comments.query.repository";
import { ModelForGettingAllComments } from "../../dtos/comments.dto";
import { GetAllBannedUsersBySuperAdminCommand } from "../users/get-all-banned-users-by-super-admin-query";
import { HelperForComments } from "../../query-repositories/helpers/helpers.for.comments.query.repository";
import { CommentsFactory } from "../../factories/comments.factory";
import { GetAllBannedBlogsCommand } from "../blogs/get-all-banned-blogs-query";

export class GetAllCommentsForAllPostsForBloggersBlogsCommand {
    constructor(public readonly dto: ModelForGettingAllComments, public readonly userId: string) {}
}

@QueryHandler(GetAllCommentsForAllPostsForBloggersBlogsCommand)
export class GetAllCommentsForAllPostsForBloggersBlogsQuery
    implements IQueryHandler<GetAllCommentsForAllPostsForBloggersBlogsCommand>
{
    constructor(private commentsQueryRepository: CommentsQueryRepository, private queryBus: QueryBus) {}

    async execute(
        query: GetAllCommentsForAllPostsForBloggersBlogsCommand,
    ): Promise<CommentViewModelForBloggerPaginationClass> {
        const dto = await HelperForComments.createQuery(query.dto);
        const bannedUsersIdsBySuperAdmin = await this.queryBus.execute(new GetAllBannedUsersBySuperAdminCommand());
        const bannedBlogsIds = await this.queryBus.execute(new GetAllBannedBlogsCommand(bannedUsersIdsBySuperAdmin));
        const comments = await this.commentsQueryRepository.getAllCommentsForAllPostsForBloggersBlogs(
            dto,
            bannedBlogsIds,
        );
        comments.items.forEach((elem) => {
            HelperForComments.getLikesDataInfoForComment(query.userId, bannedUsersIdsBySuperAdmin, elem);
        });
        return CommentsFactory.createCommentViewModelForBloggerPaginationClass(comments);
    }
}
