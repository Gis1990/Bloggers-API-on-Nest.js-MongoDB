import { PostsRepository } from "../posts.repository";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

export class DeletePostCommand {
    constructor(public id: string) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
    constructor(private postsRepository: PostsRepository) {}

    async execute(command: DeletePostCommand): Promise<boolean> {
        return this.postsRepository.deletePostById(command.id);
    }
}
