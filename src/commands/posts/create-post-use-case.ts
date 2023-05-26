import { InputModelForCreatingAndUpdatingPost } from "../../dtos/posts.dto";
import { PostViewModelClass } from "../../entities/posts.entity";
import { ExtendedLikesInfoClass, UsersLikesInfoClass } from "../../schemas/posts.schema";
import { PostsRepository } from "../../repositories/posts.repository";
import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { HttpException } from "@nestjs/common";
import { CurrentUserModel } from "../../dtos/auth.dto";
import { GetBlogByIdCommand } from "../../queries/blogs/get-blog-by-id-query";
import { PostsFactory } from "../../factories/posts.factory";
import { v4 as uuidv4 } from "uuid";
import { TelegramAdapter } from "../../modules/utils/telegram/telagram.adapter";
import { GetUserByIdCommand } from "../../queries/users/get-user-by-id-query";

export class CreatePostCommand {
    constructor(public dto: InputModelForCreatingAndUpdatingPost, public user: CurrentUserModel) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
    constructor(
        private queryBus: QueryBus,
        private postsRepository: PostsRepository,
        private telegramAdapter: TelegramAdapter,
    ) {}

    async execute(command: CreatePostCommand): Promise<PostViewModelClass> {
        const blog = await this.queryBus.execute(new GetBlogByIdCommand(command.dto.blogId));
        if (blog.blogOwnerInfo.userId !== command.user.id) throw new HttpException("Access denied", 403);
        let blogName;
        blog ? (blogName = blog.name) : (blogName = "");
        if (blog.subscribers.length > 0) {
            for (const subscriber of blog.subscribers) {
                const user = await this.queryBus.execute(new GetUserByIdCommand(subscriber));
                await this.telegramAdapter.sendNotificationForUsers(
                    process.env.TELEGRAM_BOT_TOKEN,
                    blogName,
                    user.telegramId,
                );
            }
        }
        const extendedLikesInfo: ExtendedLikesInfoClass = new ExtendedLikesInfoClass();
        const usersLikes: UsersLikesInfoClass = new UsersLikesInfoClass();
        const createdPostDto = {
            id: uuidv4(),
            title: command.dto.title,
            shortDescription: command.dto.shortDescription,
            content: command.dto.content,
            blogId: command.dto.blogId,
            blogName: blogName,
            createdAt: new Date(),
            postOwnerId: command.user.id,
            extendedLikesInfo: extendedLikesInfo,
            usersLikesInfo: usersLikes,
            images: { main: [] },
        };
        const createdPost = await this.postsRepository.createPost(createdPostDto);
        return await PostsFactory.createPostViewModelClass(createdPost);
    }
}
