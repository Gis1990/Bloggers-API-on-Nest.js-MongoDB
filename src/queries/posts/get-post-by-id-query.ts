import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PostViewModelClass } from "../../entities/posts.entity";
import { PostsQueryRepository } from "../../query-repositories/posts.query.repository";
import { PostsFactory } from "../../factories/posts.factory";
import { HelperForPosts } from "../../query-repositories/helpers/helpers.for.posts.query.repository";

export class GetPostByIdCommand {
    constructor(public readonly id: string, public readonly userId: string | undefined) {}
}

@QueryHandler(GetPostByIdCommand)
export class GetPostByIdQuery implements IQueryHandler<GetPostByIdCommand> {
    constructor(private postsQueryRepository: PostsQueryRepository) {}

    async execute(query: GetPostByIdCommand): Promise<PostViewModelClass | null> {
        const result = await this.postsQueryRepository.getPostById(query.id);
        const post = await HelperForPosts.getLikesDataInfoForPost(
            query.userId,
            result.bannedUsersIdsBySuperAdmin,
            result.post,
        );
        return PostsFactory.createPostViewModelClass(post);
    }
}
