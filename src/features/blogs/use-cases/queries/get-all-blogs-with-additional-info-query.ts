import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BlogsQueryRepository } from "../../blogs.query.repository";
import { ModelForGettingAllBlogs } from "../../dto/blogs.dto";
import { BlogDBPaginationClass } from "../../entities/blogs.entity";

export class GetAllBlogsWithAdditionalInfoCommand {
    constructor(public dto: ModelForGettingAllBlogs) {}
}

@QueryHandler(GetAllBlogsWithAdditionalInfoCommand)
export class GetAllBlogsWithAdditionalInfoQuery implements IQueryHandler<GetAllBlogsWithAdditionalInfoCommand> {
    constructor(private blogsQueryRepository: BlogsQueryRepository) {}

    async execute(query: GetAllBlogsWithAdditionalInfoCommand): Promise<BlogDBPaginationClass> {
        return await this.blogsQueryRepository.getAllBlogsWithAdditionalInfo(query.dto);
    }
}
