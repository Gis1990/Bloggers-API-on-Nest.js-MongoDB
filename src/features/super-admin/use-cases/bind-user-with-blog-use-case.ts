import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { HttpException } from "@nestjs/common";
import { BlogsRepository } from "../../blogs/blogs.repository";
import { UsersQueryRepository } from "../../users/users.query.repository";
import { GetBlogByIdCommand } from "../../blogs/use-cases/queries/get-blog-by-id-query";

export class BindUserWithBlogCommand {
    constructor(public blogId: string, public userId: string) {}
}

@CommandHandler(BindUserWithBlogCommand)
export class BindUserWithBlogUseCase implements ICommandHandler<BindUserWithBlogCommand> {
    constructor(
        private blogsRepository: BlogsRepository,
        private queryBus: QueryBus,
        private usersQueryRepository: UsersQueryRepository,
    ) {}

    async execute(command: BindUserWithBlogCommand): Promise<boolean> {
        const blog = await this.queryBus.execute(new GetBlogByIdCommand(command.blogId));
        const user = await this.usersQueryRepository.getUserById(command.userId);
        if (blog.blogOwnerInfo.userId) throw new HttpException("Blog already bound to any user", 400);
        return this.blogsRepository.bindUserWithBlog(command.blogId, command.userId, user.login);
    }
}
