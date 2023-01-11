import { InputModelForCreatingAndUpdatingPost } from "../dto/posts.dto";
import { PostViewModelClass } from "../entities/posts.entity";
import { ExtendedLikesInfoClass, UsersLikesInfoClass } from "../posts.schema";
import { PostsRepository } from "../posts.repository";
import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { HttpException } from "@nestjs/common";
import { CurrentUserModel } from "../../auth/dto/auth.dto";
import { GetBlogByIdCommand } from "../../blogs/use-cases/queries/get-blog-by-id-query";

export class CreatePostCommand {
    constructor(public dto: InputModelForCreatingAndUpdatingPost, public user: CurrentUserModel) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
    constructor(private queryBus: QueryBus, private postsRepository: PostsRepository) {}

    async execute(command: CreatePostCommand): Promise<PostViewModelClass> {
        const blog = await this.queryBus.execute(new GetBlogByIdCommand(command.dto.blogId));
        if (blog.blogOwnerInfo.userId !== command.user.id) throw new HttpException("Access denied", 403);
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
