import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { UsersRepository } from "../users.repository";
import { HttpException } from "@nestjs/common";
import { GetBlogByIdForBanUnbanOperationCommand } from "../../../blogs/use-cases/queries/get-blog-by-id-for-ban-unban-operation-query";

export class BanUnbanUserByBloggerForBlogCommand {
    constructor(
        public readonly isBanned: boolean,
        public readonly banReason: string,
        public readonly blogId: string,
        public readonly userId: string,
        public readonly blogOwnerUserId: string,
    ) {}
}

@CommandHandler(BanUnbanUserByBloggerForBlogCommand)
export class BanUnbanUserByBloggerForBlogUseCase implements ICommandHandler<BanUnbanUserByBloggerForBlogCommand> {
    constructor(private usersRepository: UsersRepository, private queryBus: QueryBus) {}

    async execute(command: BanUnbanUserByBloggerForBlogCommand): Promise<boolean> {
        const blog = await this.queryBus.execute(new GetBlogByIdForBanUnbanOperationCommand(command.blogId));
        if (blog.blogOwnerInfo.userId !== command.blogOwnerUserId) throw new HttpException("Access denied", 403);
        return this.usersRepository.banUnbanUserByBloggerForBlog(
            command.isBanned,
            command.banReason,
            command.blogId,
            command.userId,
        );
    }
}
