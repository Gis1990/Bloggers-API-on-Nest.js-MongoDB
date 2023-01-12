import { PostsRepository } from "../posts.repository";
import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { HttpException } from "@nestjs/common";
import { GetBlogByIdCommand } from "../../blogs/use-cases/queries/get-blog-by-id-query";
import { BlogClass } from "../../blogs/blogs.schema";

export class DeletePostCommand {
    constructor(public blogId: string, public postId: string, public userId: string) {}
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
