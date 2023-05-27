import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BlogsQueryRepository } from "../../query-repositories/blogs.query.repository";
import { ModelForGettingAllBlogs } from "../../dtos/blogs.dto";
import { HelperForBlogs } from "../../query-repositories/helpers/helpers.for.blogs.query.repository";
import { BlogsFactory } from "../../factories/blogs.factory";
import { BlogViewModelClassPagination } from "../../entities/blogs.entity";
import { UsersQueryRepository } from "../../query-repositories/users.query.repository";

export class GetAllBlogsCommand {
    constructor(public dto: ModelForGettingAllBlogs, public userId: string) {}
}

@QueryHandler(GetAllBlogsCommand)
export class GetAllBlogsQuery implements IQueryHandler<GetAllBlogsCommand> {
    constructor(
        private blogsQueryRepository: BlogsQueryRepository,
        private usersQueryRepository: UsersQueryRepository,
    ) {}

    async execute(query: GetAllBlogsCommand): Promise<BlogViewModelClassPagination> {
        const dto = HelperForBlogs.createQuery(query.dto);
        const blogs = await this.blogsQueryRepository.getAllBlogs(dto);
        const user = await this.usersQueryRepository.getUserById(query.userId);
        blogs.items.forEach((elem) => {
            HelperForBlogs.getSubscriptionDataForBlogs(query.userId, elem, user?.telegramId);
        });
        return BlogsFactory.createBlogViewModelPaginationClass(blogs);
    }
}
