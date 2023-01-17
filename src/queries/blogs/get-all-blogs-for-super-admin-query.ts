import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BlogsQueryRepository } from "../../query-repositories/blogs.query.repository";
import { ModelForGettingAllBlogs } from "../../dtos/blogs.dto";
import { BlogViewModelClassPagination } from "../../entities/blogs.entity";
import { HelperForBlogs } from "../../query-repositories/helpers/helpers.for.blogs.query.repository";
import { BlogsFactory } from "../../factories/blogs.factory";

export class GetAllBlogsForSuperAdminCommand {
    constructor(public dto: ModelForGettingAllBlogs) {}
}

@QueryHandler(GetAllBlogsForSuperAdminCommand)
export class GetAllBlogsForSuperAdminQuery implements IQueryHandler<GetAllBlogsForSuperAdminCommand> {
    constructor(private blogsQueryRepository: BlogsQueryRepository) {}

    async execute(query: GetAllBlogsForSuperAdminCommand): Promise<BlogViewModelClassPagination> {
        const dto = HelperForBlogs.createQuery(query.dto);
        const result = await this.blogsQueryRepository.getAllBlogsForSuperAdmin(dto);
        return BlogsFactory.createBlogViewModelPaginationClass(result);
    }
}
