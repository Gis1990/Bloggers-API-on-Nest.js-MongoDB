import { InputModelForCreatingBlog } from "../../dtos/blogs.dto";
import { BlogViewModelClass } from "../../entities/blogs.entity";
import { BlogsRepository } from "../../repositories/blogs.repository";
import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { CurrentUserModel } from "../../dtos/auth.dto";
import { BlogsFactory } from "../../factories/blogs.factory";

export class CreateBlogCommand implements ICommand {
    constructor(public readonly dto: InputModelForCreatingBlog, public readonly user: CurrentUserModel) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand> {
    constructor(private blogsRepository: BlogsRepository) {}

    async execute(command: CreateBlogCommand): Promise<BlogViewModelClass> {
        const createdBlogDto = {
            ...command.dto,
            id: Number(new Date()).toString(),
            createdAt: new Date(),
            blogOwnerInfo: { userId: command.user.id, userLogin: command.user.login },
            banInfo: { isBanned: false, banDate: null },
        };
        const createdBlog = await this.blogsRepository.createBlog(createdBlogDto);
        return BlogsFactory.createBlogViewModelClass(createdBlog);
    }
}
