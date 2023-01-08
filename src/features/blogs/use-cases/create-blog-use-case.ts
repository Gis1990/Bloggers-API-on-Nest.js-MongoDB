import { InputModelForCreatingBlog } from "../dto/blogs.dto";
import { BlogViewModelClass } from "../entities/blogs.entity";
import { BlogsRepository } from "../blogs.repository";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

export class CreateBlogCommand {
    constructor(public dto: InputModelForCreatingBlog) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand> {
    constructor(private blogsRepository: BlogsRepository) {}

    async execute(command: CreateBlogCommand): Promise<BlogViewModelClass> {
        const createdBlogDto = { ...command.dto, id: Number(new Date()).toString(), createdAt: new Date() };
        return await this.blogsRepository.createBlog(createdBlogDto);
    }
}
