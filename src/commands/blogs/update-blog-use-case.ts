import { InputModelForUpdatingBlog } from "../../dtos/blogs.dto";
import { BlogsRepository } from "../../repositories/blogs.repository";
import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { HttpException } from "@nestjs/common";
import { CurrentUserModel } from "../../dtos/auth.dto";
import { GetBlogByIdCommand } from "../../queries/blogs/get-blog-by-id-query";

export class UpdateBlogCommand {
    constructor(
        public readonly id: string,
        public readonly dto: InputModelForUpdatingBlog,
        public readonly user: CurrentUserModel,
    ) {}
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
