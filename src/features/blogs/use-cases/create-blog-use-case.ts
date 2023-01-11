import { InputModelForCreatingBlog } from "../dto/blogs.dto";
import { BlogViewModelClass } from "../entities/blogs.entity";
import { BlogsRepository } from "../blogs.repository";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CurrentUserModel } from "../../auth/dto/auth.dto";

export class CreateBlogCommand {
    constructor(public dto: InputModelForCreatingBlog, public user: CurrentUserModel) {}
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
        };
        return await this.blogsRepository.createBlog(createdBlogDto);
    }
}
