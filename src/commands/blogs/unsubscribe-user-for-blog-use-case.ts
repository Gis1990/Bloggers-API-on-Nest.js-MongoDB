import { BlogsRepository } from "../../repositories/blogs.repository";
import { CommandHandler, ICommand, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { GetBlogByIdCommand } from "../../queries/blogs/get-blog-by-id-query";

export class UnsubscribeUserForBlogCommand implements ICommand {
    constructor(public readonly userId: string, public readonly blogId: string) {}
}

@CommandHandler(UnsubscribeUserForBlogCommand)
export class UnsubscribeUserForBlogUseCase implements ICommandHandler<UnsubscribeUserForBlogCommand> {
    constructor(private blogsRepository: BlogsRepository, private queryBus: QueryBus) {}

    async execute(command: UnsubscribeUserForBlogCommand): Promise<boolean> {
        const blog = await this.queryBus.execute(new GetBlogByIdCommand(command.blogId));
        if (!blog.subscribers.includes(command.userId)) return true;
        return await this.blogsRepository.unsubscribeUser(command.blogId, command.userId);
    }
}
