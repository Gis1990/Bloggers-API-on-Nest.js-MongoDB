import { PostsRepository } from "../../repositories/posts.repository";
import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { HttpException } from "@nestjs/common";
import { GetBlogByIdCommand } from "../../queries/blogs/get-blog-by-id-query";
import { BlogClass } from "../../schemas/blogs.schema";

export class DeletePostCommand {
    constructor(public readonly blogId: string, public readonly postId: string, public readonly userId: string) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
    constructor(private postsRepository: PostsRepository, private queryBus: QueryBus) {}

    async execute(command: DeletePostCommand): Promise<boolean> {
        const blog: BlogClass = await this.queryBus.execute(new GetBlogByIdCommand(command.blogId));
        if (blog.blogOwnerInfo.userId !== command.userId) throw new HttpException("Access denied", 403);
        return this.postsRepository.deletePostById(command.postId);
    }
}
