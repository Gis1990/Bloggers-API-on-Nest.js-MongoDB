import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BlogsQueryRepository } from "../../query-repositories/blogs.query.repository";
import { ModelForGettingAllBlogs } from "../../dtos/blogs.dto";
import { BlogViewModelClassPagination } from "../../entities/blogs.entity";
import { HelperForBlogs } from "../../query-repositories/helpers/helpers.for.blogs.query.repository";
import { BlogsFactory } from "../../factories/blogs.factory";

export class GetAllBlogsForAuthorizedUserCommand {
    constructor(public dto: ModelForGettingAllBlogs, public userId: string) {}
}

@QueryHandler(GetAllBlogsForAuthorizedUserCommand)
export class GetAllBlogsForAuthorizedUserQuery implements IQueryHandler<GetAllBlogsForAuthorizedUserCommand> {
    constructor(private blogsQueryRepository: BlogsQueryRepository) {}

    async execute(query: GetAllBlogsForAuthorizedUserCommand): Promise<BlogViewModelClassPagination> {
        const dto = HelperForBlogs.createQuery(query.dto);
        const result = await this.blogsQueryRepository.getAllBlogsForAuthorizedUser(dto, query.userId);
        return BlogsFactory.createBlogViewModelPaginationClass(result);
    }
}
