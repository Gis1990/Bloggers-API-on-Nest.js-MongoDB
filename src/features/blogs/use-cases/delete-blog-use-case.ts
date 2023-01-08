import { BlogsRepository } from "../blogs.repository";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

export class DeleteBlogCommand {
    constructor(public id: string) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase implements ICommandHandler<DeleteBlogCommand> {
    constructor(private blogsRepository: BlogsRepository) {}

    async execute(command: DeleteBlogCommand): Promise<boolean> {
        return this.blogsRepository.deleteBlogById(command.id);
    }
}
