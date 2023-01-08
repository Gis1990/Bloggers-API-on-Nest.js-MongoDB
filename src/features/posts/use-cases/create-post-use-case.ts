import { InputModelForCreatingAndUpdatingPost } from "../dto/posts.dto";
import { PostViewModelClass } from "../entities/posts.entity";
import { ExtendedLikesInfoClass, UsersLikesInfoClass } from "../posts.schema";
import { BlogsQueryRepository } from "../../blogs/blogs.query.repository";
import { PostsRepository } from "../posts.repository";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

export class CreatePostCommand {
    constructor(public readonly dto: InputModelForCreatingAndUpdatingPost) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
    constructor(private blogsQueryRepository: BlogsQueryRepository, private postsRepository: PostsRepository) {}

    async execute(command: CreatePostCommand): Promise<PostViewModelClass> {
        const blog = await this.blogsQueryRepository.getBlogById(command.dto.blogId);
        let blogName;
        blog ? (blogName = blog.name) : (blogName = "");
        const extendedLikesInfo: ExtendedLikesInfoClass = new ExtendedLikesInfoClass();
        const usersLikes: UsersLikesInfoClass = new UsersLikesInfoClass();
        const createdPostDto = {
            id: Number(new Date()).toString(),
            title: command.dto.title,
            shortDescription: command.dto.shortDescription,
            content: command.dto.content,
            blogId: command.dto.blogId,
            blogName: blogName,
            createdAt: new Date(),
            extendedLikesInfo: extendedLikesInfo,
            usersLikesInfo: usersLikes,
        };

        return await this.postsRepository.createPost(createdPostDto);
    }
}
