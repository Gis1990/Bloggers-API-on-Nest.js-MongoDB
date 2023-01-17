import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BlogsQueryRepository } from "../../query-repositories/blogs.query.repository";
import { ModelForGettingAllBlogs } from "../../dtos/blogs.dto";
import { HelperForBlogs } from "../../query-repositories/helpers/helpers.for.blogs.query.repository";
import { BlogsFactory } from "../../factories/blogs.factory";
import { BlogViewModelClassPagination } from "../../entities/blogs.entity";

export class GetAllBlogsCommand {
    constructor(public dto: ModelForGettingAllBlogs) {}
}

@QueryHandler(GetAllBlogsCommand)
export class GetAllBlogsQuery implements IQueryHandler<GetAllBlogsCommand> {
    constructor(private blogsQueryRepository: BlogsQueryRepository) {}

    async execute(query: GetAllBlogsCommand): Promise<BlogViewModelClassPagination> {
        const dto = HelperForBlogs.createQuery(query.dto);
        const result = await this.blogsQueryRepository.getAllBlogs(dto);
        return BlogsFactory.createBlogViewModelPaginationClass(result);
    }
}
