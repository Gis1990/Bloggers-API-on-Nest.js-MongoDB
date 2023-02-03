import { IQueryHandler, QueryBus, QueryHandler } from "@nestjs/cqrs";
import { PostViewModelClass } from "../../entities/posts.entity";
import { PostsQueryRepository } from "../../query-repositories/posts.query.repository";
import { PostsFactory } from "../../factories/posts.factory";
import { HelperForPosts } from "../../query-repositories/helpers/helpers.for.posts.query.repository";
import { BlogsQueryRepository } from "../../query-repositories/blogs.query.repository";
import { GetAllBannedUsersBySuperAdminCommand } from "../users/get-all-banned-users-by-super-admin-query";

export class GetPostByIdCommand {
    constructor(public readonly id: string, public readonly userId: string | undefined) {}
}

@QueryHandler(GetPostByIdCommand)
export class GetPostByIdQuery implements IQueryHandler<GetPostByIdCommand> {
    constructor(
        private postsQueryRepository: PostsQueryRepository,
        private queryBus: QueryBus,
        private blogsQueryRepository: BlogsQueryRepository,
    ) {}

    async execute(query: GetPostByIdCommand): Promise<PostViewModelClass | null> {
        const bannedUsersIdsBySuperAdmin = await this.queryBus.execute(new GetAllBannedUsersBySuperAdminCommand());
        const post = await this.postsQueryRepository.getPostById(query.id, bannedUsersIdsBySuperAdmin);
        if (!post) {
            return null;
        }
        const blog = await this.blogsQueryRepository.getBlogById(post.blogId);
        if (!blog || blog.banInfo.isBanned) return null;
        const correctPost = await HelperForPosts.getLikesDataInfoForPost(
            query.userId,
            bannedUsersIdsBySuperAdmin,
            post,
        );
        return PostsFactory.createPostViewModelClass(correctPost);
    }
}
