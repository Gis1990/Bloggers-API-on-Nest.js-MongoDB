import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BlogsQueryRepository } from "../../blogs.query.repository";
import { ModelForGettingAllBlogs } from "../../dto/blogs.dto";
import { BlogClassPagination } from "../../entities/blogs.entity";

export class GetAllBlogsForAuthorizedUserCommand {
    constructor(public dto: ModelForGettingAllBlogs, public userId: string) {}
}

@QueryHandler(GetAllBlogsForAuthorizedUserCommand)
export class GetAllBlogsForAuthorizedUserQuery implements IQueryHandler<GetAllBlogsForAuthorizedUserCommand> {
    constructor(private blogsQueryRepository: BlogsQueryRepository) {}

    async execute(query: GetAllBlogsForAuthorizedUserCommand): Promise<BlogClassPagination> {
        return await this.blogsQueryRepository.getAllBlogsForAuthorizedUser(query.dto, query.userId);
    }
}
