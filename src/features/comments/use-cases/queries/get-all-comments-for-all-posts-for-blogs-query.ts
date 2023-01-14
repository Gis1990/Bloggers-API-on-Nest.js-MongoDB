import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { CommentForBloggerPaginationClass } from "../../entities/comments.entity";
import { CommentsQueryRepository } from "../../comments.query.repository";
import { ModelForGettingAllComments } from "../../dto/comments.dto";

export class GetAllCommentsForAllPostsForBloggersBlogsCommand {
    constructor(public dto: ModelForGettingAllComments, public userId: string) {}
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
