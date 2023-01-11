import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PostDBPaginationClass } from "../../entities/posts.entity";
import { ModelForGettingAllPosts } from "../../dto/posts.dto";
import { PostsQueryRepository } from "../../posts.query.repository";

export class GetAllPostsForSpecificBlogCommand {
    constructor(public dto: ModelForGettingAllPosts, public blogId: string, public userId: string | undefined) {}
}

@QueryHandler(GetAllPostsForSpecificBlogCommand)
export class GetAllPostsForSpecificBlogQuery implements IQueryHandler<GetAllPostsForSpecificBlogCommand> {
    constructor(private postsQueryRepository: PostsQueryRepository) {}

    async execute(query: GetAllPostsForSpecificBlogCommand): Promise<PostDBPaginationClass> {
        return await this.postsQueryRepository.getAllPostsForSpecificBlog(query.dto, query.blogId, query.userId);
    }
}
