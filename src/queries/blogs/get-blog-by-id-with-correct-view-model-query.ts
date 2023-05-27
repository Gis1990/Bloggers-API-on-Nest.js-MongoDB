import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BlogsQueryRepository } from "../../query-repositories/blogs.query.repository";
import { BlogViewModelClass } from "../../entities/blogs.entity";
import { HelperForBlogs } from "../../query-repositories/helpers/helpers.for.blogs.query.repository";
import { BlogsFactory } from "../../factories/blogs.factory";
import { UsersQueryRepository } from "../../query-repositories/users.query.repository";

export class GetBlogByIdWithCorrectViewModelCommand {
    constructor(public id: string, public userId: string) {}
}

@QueryHandler(GetBlogByIdWithCorrectViewModelCommand)
export class GetBlogByIdWithCorrectViewModelQuery implements IQueryHandler<GetBlogByIdWithCorrectViewModelCommand> {
    constructor(
        private blogsQueryRepository: BlogsQueryRepository,
        private usersQueryRepository: UsersQueryRepository,
    ) {}

    async execute(query: GetBlogByIdWithCorrectViewModelCommand): Promise<BlogViewModelClass | null> {
        const blog = await this.blogsQueryRepository.getBlogById(query.id);
        if (!blog) return null;
        const user = await this.usersQueryRepository.getUserById(query.userId);
        console.log(user);
        const correctBlog = await HelperForBlogs.getSubscriptionDataForBlogs(query.userId, blog, user?.telegramId);
        return BlogsFactory.createBlogViewModelClass(correctBlog);
    }
}
