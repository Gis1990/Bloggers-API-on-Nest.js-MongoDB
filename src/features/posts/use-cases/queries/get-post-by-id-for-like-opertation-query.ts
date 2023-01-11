import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PostsQueryRepository } from "../../posts.query.repository";
import { PostClass } from "../../posts.schema";

export class GetPostByIdForLikeOperationCommand {
    constructor(public id: string) {}
}

@QueryHandler(GetPostByIdForLikeOperationCommand)
export class GetPostByIdForLikeOperationQuery implements IQueryHandler<GetPostByIdForLikeOperationCommand> {
    constructor(private postsQueryRepository: PostsQueryRepository) {}

    async execute(query: GetPostByIdForLikeOperationCommand): Promise<PostClass | null> {
        return await this.postsQueryRepository.getPostByIdForOperationWithLikes(query.id);
    }
}
