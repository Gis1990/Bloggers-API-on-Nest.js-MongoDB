import { BlogsRepository } from "../../repositories/blogs.repository";
import { CommandHandler, ICommand, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { GetBlogByIdCommand } from "../../queries/blogs/get-blog-by-id-query";

export class SubscribeUserForBlogCommand implements ICommand {
    constructor(public readonly userId: string, public readonly blogId: string) {}
}

@CommandHandler(SubscribeUserForBlogCommand)
export class SubscribeUserForBlogUseCase implements ICommandHandler<SubscribeUserForBlogCommand> {
    constructor(private blogsRepository: BlogsRepository, private queryBus: QueryBus) {}

    async execute(command: SubscribeUserForBlogCommand): Promise<boolean> {
        const blog = await this.queryBus.execute(new GetBlogByIdCommand(command.blogId));
        if (blog.subscribers.includes(command.userId)) return true;
        const newNumberOfSubscribers = blog.subscribersCount + 1;
        return await this.blogsRepository.subscribeUser(command.blogId, command.userId, newNumberOfSubscribers);
    }
}
