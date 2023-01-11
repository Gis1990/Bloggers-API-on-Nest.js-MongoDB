import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PostViewModelClass } from "../../entities/posts.entity";
import { PostsQueryRepository } from "../../posts.query.repository";

export class GetPostByIdCommand {
    constructor(public id: string, public userId: string | undefined) {}
}

@QueryHandler(GetPostByIdCommand)
export class GetPostByIdQuery implements IQueryHandler<GetPostByIdCommand> {
    constructor(private postsQueryRepository: PostsQueryRepository) {}

    async execute(query: GetPostByIdCommand): Promise<PostViewModelClass | null> {
        return await this.postsQueryRepository.getPostById(query.id, query.userId);
    }
}
