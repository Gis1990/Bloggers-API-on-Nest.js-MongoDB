import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BlogsQueryRepository } from "../../query-repositories/blogs.query.repository";
import { BlogClass } from "../../schemas/blogs.schema";

export class GetBlogByIdForBanUnbanOperationCommand {
    constructor(public readonly id: string) {}
}

@QueryHandler(GetBlogByIdForBanUnbanOperationCommand)
export class GetBlogByIdForBanUnbanOperationQuery implements IQueryHandler<GetBlogByIdForBanUnbanOperationCommand> {
    constructor(private blogsQueryRepository: BlogsQueryRepository) {}

    async execute(query: GetBlogByIdForBanUnbanOperationCommand): Promise<BlogClass | null> {
        return await this.blogsQueryRepository.getBlogByIdForBanUnbanOperation(query.id);
    }
}
