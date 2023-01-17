import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { CommentForBloggerPaginationClass } from "../../entities/comments.entity";
import { CommentsQueryRepository } from "../../query-repositories/comments.query.repository";
import { ModelForGettingAllComments } from "../../dtos/comments.dto";

export class GetAllCommentsForAllPostsForBloggersBlogsCommand {
    constructor(public readonly dto: ModelForGettingAllComments, public readonly userId: string) {}
}

@QueryHandler(GetAllCommentsForAllPostsForBloggersBlogsCommand)
export class GetAllCommentsForAllPostsForBloggersBlogsQuery
    implements IQueryHandler<GetAllCommentsForAllPostsForBloggersBlogsCommand>
{
    constructor(private commentsQueryRepository: CommentsQueryRepository) {}

    async execute(query: GetAllCommentsForAllPostsForBloggersBlogsCommand): Promise<CommentForBloggerPaginationClass> {
        return await this.commentsQueryRepository.getAllCommentsForAllPostsForBloggersBlogs(query.dto, query.userId);
    }
}
