import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { HttpException } from "@nestjs/common";
import { BlogsRepository } from "../../repositories/blogs.repository";
import { GetBlogByIdCommand } from "../../queries/blogs/get-blog-by-id-query";
import { GetUserByIdCommand } from "../../queries/users/get-user-by-id-query";

export class BindUserWithBlogCommand {
    constructor(public readonly blogId: string, public readonly userId: string) {}
}

@CommandHandler(BindUserWithBlogCommand)
export class BindUserWithBlogUseCase implements ICommandHandler<BindUserWithBlogCommand> {
    constructor(private blogsRepository: BlogsRepository, private queryBus: QueryBus) {}

    async execute(command: BindUserWithBlogCommand): Promise<boolean> {
        const blog = await this.queryBus.execute(new GetBlogByIdCommand(command.blogId));
        const user = await this.queryBus.execute(new GetUserByIdCommand(command.userId));
        if (blog.blogOwnerInfo.userId) throw new HttpException("Blog already bound to any user", 400);
        return this.blogsRepository.bindUserWithBlog(command.blogId, command.userId, user.login);
    }
}
