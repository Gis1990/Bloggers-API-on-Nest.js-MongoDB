import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BlogsRepository } from "../../repositories/blogs.repository";

export class BanUnbanBlogBySuperAdminCommand {
    constructor(public readonly isBanned: boolean, public readonly blogId: string) {}
}

@CommandHandler(BanUnbanBlogBySuperAdminCommand)
export class BanUnbanBlogBySuperAdminUseCase implements ICommandHandler<BanUnbanBlogBySuperAdminCommand> {
    constructor(private blogsRepository: BlogsRepository) {}

    async execute(command: BanUnbanBlogBySuperAdminCommand): Promise<boolean> {
        let dtoForBanUnbanBlogBySuperAdmin;
        if (command.isBanned) {
            dtoForBanUnbanBlogBySuperAdmin = { isBanned: command.isBanned, banDate: new Date() };
        } else {
            dtoForBanUnbanBlogBySuperAdmin = { isBanned: command.isBanned, banDate: null };
        }
        return this.blogsRepository.banUnbanBlogBySuperAdmin(dtoForBanUnbanBlogBySuperAdmin, command.blogId);
    }
}
