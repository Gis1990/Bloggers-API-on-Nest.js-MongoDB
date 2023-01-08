import { InputModelForUpdatingBlog } from "../dto/blogs.dto";
import { BlogsRepository } from "../blogs.repository";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

export class UpdateBlogCommand {
    constructor(public readonly id: string, public readonly dto: InputModelForUpdatingBlog) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand> {
    constructor(private blogsRepository: BlogsRepository) {}

    async execute(command: UpdateBlogCommand): Promise<boolean> {
        return this.blogsRepository.updateBlog(command.id, command.dto);
    }
}
