import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PostViewModelClassPagination } from "../../entities/posts.entity";
import { ModelForGettingAllPosts } from "../../dtos/posts.dto";
import { PostsQueryRepository } from "../../query-repositories/posts.query.repository";
import { HelperForPosts } from "../../query-repositories/helpers/helpers.for.posts.query.repository";
import { PostsFactory } from "../../factories/posts.factory";

export class GetAllPostsCommand {
    constructor(public dto: ModelForGettingAllPosts, public userId: string | undefined) {}
}

@QueryHandler(GetAllPostsCommand)
export class GetAllPostsQuery implements IQueryHandler<GetAllPostsCommand> {
    constructor(private postsQueryRepository: PostsQueryRepository) {}

    async execute(query: GetAllPostsCommand): Promise<PostViewModelClassPagination> {
        const dto = await HelperForPosts.createQuery(query.dto);
        const result = await this.postsQueryRepository.getAllPosts(dto);
        result.items.forEach((elem) => {
            HelperForPosts.getLikesDataInfoForPost(query.userId, result.bannedUsersIdsBySuperAdmin, elem);
        });
        return await PostsFactory.createPostViewModelClassPagination(result);
    }
}
