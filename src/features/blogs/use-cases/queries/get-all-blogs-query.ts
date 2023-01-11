import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BlogsQueryRepository } from "../../blogs.query.repository";
import { ModelForGettingAllBlogs } from "../../dto/blogs.dto";
import { BlogDBPaginationClass } from "../../entities/blogs.entity";

export class GetAllBlogsCommand {
    constructor(public dto: ModelForGettingAllBlogs) {}
}

@QueryHandler(GetAllBlogsCommand)
export class GetAllBlogsQuery implements IQueryHandler<GetAllBlogsCommand> {
    constructor(private blogsQueryRepository: BlogsQueryRepository) {}

    async execute(query: GetAllBlogsCommand): Promise<BlogDBPaginationClass> {
        return await this.blogsQueryRepository.getAllBlogs(query.dto);
    }
}
