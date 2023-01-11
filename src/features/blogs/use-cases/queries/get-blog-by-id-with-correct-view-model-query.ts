import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BlogsQueryRepository } from "../../blogs.query.repository";
import { BlogViewModelClass } from "../../entities/blogs.entity";

export class GetBlogByIdWithCorrectViewModelCommand {
    constructor(public id: string) {}
}

@QueryHandler(GetBlogByIdWithCorrectViewModelCommand)
export class GetBlogByIdWithCorrectViewModelQuery implements IQueryHandler<GetBlogByIdWithCorrectViewModelCommand> {
    constructor(private blogsQueryRepository: BlogsQueryRepository) {}

    async execute(query: GetBlogByIdWithCorrectViewModelCommand): Promise<BlogViewModelClass | null> {
        return await this.blogsQueryRepository.getBlogByIdWithCorrectViewModel(query.id);
    }
}
