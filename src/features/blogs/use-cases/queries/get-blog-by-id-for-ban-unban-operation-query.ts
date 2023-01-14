import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BlogsQueryRepository } from "../../blogs.query.repository";
import { BlogClass } from "../../blogs.schema";

export class GetBlogByIdForBanUnbanOperationCommand {
    constructor(public id: string) {}
}

@QueryHandler(GetBlogByIdForBanUnbanOperationCommand)
export class GetBlogByIdForBanUnbanOperationQuery implements IQueryHandler<GetBlogByIdForBanUnbanOperationCommand> {
    constructor(private blogsQueryRepository: BlogsQueryRepository) {}

    async execute(query: GetBlogByIdForBanUnbanOperationCommand): Promise<BlogClass | null> {
        return await this.blogsQueryRepository.getBlogByIdForBanUnbanOperation(query.id);
    }
}
