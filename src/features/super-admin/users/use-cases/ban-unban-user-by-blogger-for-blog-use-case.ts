import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { UsersRepository } from "../users.repository";
import { GetBlogByIdCommand } from "../../../blogs/use-cases/queries/get-blog-by-id-query";
import { HttpException } from "@nestjs/common";

export class BanUnbanUserByBloggerForBlog {
    constructor(
        public isBanned: boolean,
        public banReason: string,
        public blogId: string,
        public userId: string,
        public blogOwnerUserId: string,
    ) {}
}

@CommandHandler(BanUnbanUserByBloggerForBlog)
export class BanUnbanUserByBloggerForBlogUseCase implements ICommandHandler<BanUnbanUserByBloggerForBlog> {
    constructor(private usersRepository: UsersRepository, private queryBus: QueryBus) {}

    async execute(command: BanUnbanUserByBloggerForBlog): Promise<boolean> {
        const blog = await this.queryBus.execute(new GetBlogByIdCommand(command.blogOwnerUserId));
        if (blog.blogOwnerInfo.userId !== command.blogOwnerUserId) throw new HttpException("Access denied", 403);
        return this.usersRepository.banUnbanUserByBloggerForBlog(
            command.isBanned,
            command.banReason,
            command.blogId,
            command.userId,
        );
    }
}
