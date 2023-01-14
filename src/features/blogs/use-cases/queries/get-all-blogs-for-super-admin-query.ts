import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BlogsQueryRepository } from "../../blogs.query.repository";
import { ModelForGettingAllBlogs } from "../../dto/blogs.dto";
import { BlogClassPagination } from "../../entities/blogs.entity";

export class GetAllBlogsForSuperAdminCommand {
    constructor(public dto: ModelForGettingAllBlogs) {}
}

@QueryHandler(GetAllBlogsForSuperAdminCommand)
export class GetAllBlogsForSuperAdminQuery implements IQueryHandler<GetAllBlogsForSuperAdminCommand> {
    constructor(private blogsQueryRepository: BlogsQueryRepository) {}

    async execute(query: GetAllBlogsForSuperAdminCommand): Promise<BlogClassPagination> {
        return await this.blogsQueryRepository.getAllBlogsForSuperAdmin(query.dto);
    }
}
