import { PostsRepository } from "../posts.repository";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

export class UpdatePostCommand {
    constructor(
        public readonly id: string,
        public readonly title: string,
        public readonly shortDescription: string,
        public readonly content: string,
        public readonly blogId: string,
    ) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<UpdatePostCommand> {
    constructor(private postsRepository: PostsRepository) {}

    async execute(command: UpdatePostCommand): Promise<boolean> {
        return this.postsRepository.updatePost(
            command.id,
            command.title,
            command.shortDescription,
            command.content,
            command.blogId,
        );
    }
}
