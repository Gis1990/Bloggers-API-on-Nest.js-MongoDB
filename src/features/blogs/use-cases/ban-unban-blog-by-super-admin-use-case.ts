import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BlogsRepository } from "../blogs.repository";

export class BanUnbanBlogBySuperAdminCommand {
    constructor(public isBanned: boolean, public blogId: string) {}
}

@CommandHandler(BanUnbanBlogBySuperAdminCommand)
export class BanUnbanBlogBySuperAdminUseCase implements ICommandHandler<BanUnbanBlogBySuperAdminCommand> {
    constructor(private blogsRepository: BlogsRepository) {}

    async execute(command: BanUnbanBlogBySuperAdminCommand): Promise<boolean> {
        return this.blogsRepository.banUnbanBlogBySuperAdmin(command.isBanned, command.blogId);
    }
}
