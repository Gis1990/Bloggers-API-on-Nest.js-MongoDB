import { IQueryHandler, QueryBus, QueryHandler } from "@nestjs/cqrs";
import { PostViewModelClassPagination } from "../../entities/posts.entity";
import { ModelForGettingAllPosts } from "../../dtos/posts.dto";
import { PostsQueryRepository } from "../../query-repositories/posts.query.repository";
import { HelperForPosts } from "../../query-repositories/helpers/helpers.for.posts.query.repository";
import { PostsFactory } from "../../factories/posts.factory";
import { GetAllBannedUsersBySuperAdminCommand } from "../users/get-all-banned-users-by-super-admin-query";
import { GetAllBannedBlogsCommand } from "../blogs/get-all-banned-blogs-query";
import { HelperForComments } from "../../query-repositories/helpers/helpers.for.comments.query.repository";

export class GetAllPostsForSpecificBlogCommand {
    constructor(public dto: ModelForGettingAllPosts, public blogId: string, public userId: string | undefined) {}
}

@QueryHandler(GetAllPostsForSpecificBlogCommand)
export class GetAllPostsForSpecificBlogQuery implements IQueryHandler<GetAllPostsForSpecificBlogCommand> {
    constructor(private postsQueryRepository: PostsQueryRepository, private queryBus: QueryBus) {}

    async execute(query: GetAllPostsForSpecificBlogCommand): Promise<PostViewModelClassPagination> {
        const bannedUsersIdsBySuperAdmin = await this.queryBus.execute(new GetAllBannedUsersBySuperAdminCommand());
        const bannedBlogsIds = await this.queryBus.execute(new GetAllBannedBlogsCommand(bannedUsersIdsBySuperAdmin));
        const dto = await HelperForComments.createQuery(query.dto);
        const result = await this.postsQueryRepository.getAllPostsForSpecificBlog(dto, bannedBlogsIds, query.blogId);
        result.items.forEach((elem) => {
            HelperForPosts.getLikesDataInfoForPost(query.userId, bannedUsersIdsBySuperAdmin, elem);
        });
        return await PostsFactory.createPostViewModelClassPagination(result);
    }
}
