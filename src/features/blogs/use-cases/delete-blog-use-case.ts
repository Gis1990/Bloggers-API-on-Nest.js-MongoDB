import { BlogsRepository } from "../blogs.repository";
import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { HttpException } from "@nestjs/common";
import { CurrentUserModel } from "../../auth/dto/auth.dto";
import { GetBlogByIdCommand } from "./queries/get-blog-by-id-query";

export class DeleteBlogCommand {
    constructor(public id: string, public user: CurrentUserModel) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase implements ICommandHandler<DeleteBlogCommand> {
    constructor(private blogsRepository: BlogsRepository, private queryBus: QueryBus) {}

    async execute(command: DeleteBlogCommand): Promise<boolean> {
        const blog = await this.queryBus.execute(new GetBlogByIdCommand(command.id));
        if (blog.blogOwnerInfo.userId !== command.user.id) throw new HttpException("Access denied", 403);
        return this.blogsRepository.deleteBlogById(command.id);
    }
}
