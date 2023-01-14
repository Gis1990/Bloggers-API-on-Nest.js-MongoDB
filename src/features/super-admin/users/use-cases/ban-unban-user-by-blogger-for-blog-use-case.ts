import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UsersRepository } from "../users.repository";

export class BanUnbanUserByBloggerForBlog {
    constructor(public isBanned: boolean, public banReason: string, public blogId: string, public userId: string) {}
}

@CommandHandler(BanUnbanUserByBloggerForBlog)
export class BanUnbanUserByBloggerForBlogUseCase implements ICommandHandler<BanUnbanUserByBloggerForBlog> {
    constructor(private usersRepository: UsersRepository) {}

    async execute(command: BanUnbanUserByBloggerForBlog): Promise<boolean> {
        return this.usersRepository.banUnbanUserByBloggerForBlog(
            command.isBanned,
            command.banReason,
            command.blogId,
            command.userId,
        );
    }
}
