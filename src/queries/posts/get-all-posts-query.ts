import { IQueryHandler, QueryBus, QueryHandler } from "@nestjs/cqrs";
import { PostViewModelClassPagination } from "../../entities/posts.entity";
import { ModelForGettingAllPosts } from "../../dtos/posts.dto";
import { PostsQueryRepository } from "../../query-repositories/posts.query.repository";
import { HelperForPosts } from "../../query-repositories/helpers/helpers.for.posts.query.repository";
import { PostsFactory } from "../../factories/posts.factory";
import { GetAllBannedUsersBySuperAdminCommand } from "../users/get-all-banned-users-by-super-admin-query";
import { GetAllBannedBlogsCommand } from "../blogs/get-all-banned-blogs-query";

export class GetAllPostsCommand {
    constructor(public dto: ModelForGettingAllPosts, public userId: string | undefined) {}
}

@QueryHandler(GetAllPostsCommand)
export class GetAllPostsQuery implements IQueryHandler<GetAllPostsCommand> {
    constructor(private postsQueryRepository: PostsQueryRepository, private queryBus: QueryBus) {}

    async execute(query: GetAllPostsCommand): Promise<PostViewModelClassPagination> {
        const bannedUsersIdsBySuperAdmin = await this.queryBus.execute(new GetAllBannedUsersBySuperAdminCommand());
        const bannedBlogsIds = await this.queryBus.execute(new GetAllBannedBlogsCommand(bannedUsersIdsBySuperAdmin));
        const dto = await HelperForPosts.createQuery(query.dto);
        const posts = await this.postsQueryRepository.getAllPosts(dto, bannedBlogsIds);
        posts.items.forEach((elem) => {
            HelperForPosts.getLikesDataInfoForPost(query.userId, bannedUsersIdsBySuperAdmin, elem);
        });
        return await PostsFactory.createPostViewModelClassPagination(posts);
    }
}
