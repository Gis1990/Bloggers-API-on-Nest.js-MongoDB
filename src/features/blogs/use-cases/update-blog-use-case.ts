import { InputModelForUpdatingBlog } from "../dto/blogs.dto";
import { BlogsRepository } from "../blogs.repository";
import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { HttpException } from "@nestjs/common";
import { CurrentUserModel } from "../../auth/dto/auth.dto";
import { GetBlogByIdCommand } from "./queries/get-blog-by-id-query";

export class UpdateBlogCommand {
    constructor(public id: string, public dto: InputModelForUpdatingBlog, public user: CurrentUserModel) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand> {
    constructor(private blogsRepository: BlogsRepository, private queryBus: QueryBus) {}

    async execute(command: UpdateBlogCommand): Promise<boolean> {
        const blog = await this.queryBus.execute(new GetBlogByIdCommand(command.id));
        if (blog.blogOwnerInfo.userId !== command.user.id) throw new HttpException("Access denied", 403);
        return this.blogsRepository.updateBlog(command.id, command.dto);
    }
}
