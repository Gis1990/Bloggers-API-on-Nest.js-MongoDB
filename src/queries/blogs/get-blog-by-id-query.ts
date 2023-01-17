import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BlogsQueryRepository } from "../../query-repositories/blogs.query.repository";
import { BlogClass } from "../../schemas/blogs.schema";

export class GetBlogByIdCommand {
    constructor(public id: string) {}
}

@QueryHandler(GetBlogByIdCommand)
export class GetBlogByIdQuery implements IQueryHandler<GetBlogByIdCommand> {
    constructor(private blogsQueryRepository: BlogsQueryRepository) {}

    async execute(query: GetBlogByIdCommand): Promise<BlogClass | null> {
        return await this.blogsQueryRepository.getBlogById(query.id);
    }
}
