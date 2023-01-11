import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PostDBPaginationClass } from "../../entities/posts.entity";
import { ModelForGettingAllPosts } from "../../dto/posts.dto";
import { PostsQueryRepository } from "../../posts.query.repository";

export class GetAllPostsCommand {
    constructor(public dto: ModelForGettingAllPosts, public userId: string | undefined) {}
}

@QueryHandler(GetAllPostsCommand)
export class GetAllPostsQuery implements IQueryHandler<GetAllPostsCommand> {
    constructor(private postsQueryRepository: PostsQueryRepository) {}

    async execute(query: GetAllPostsCommand): Promise<PostDBPaginationClass> {
        return await this.postsQueryRepository.getAllPosts(query.dto, query.userId);
    }
}
