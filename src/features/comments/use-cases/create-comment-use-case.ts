import { CreatedCommentDto, ModelForCreatingNewComment } from "../dto/comments.dto";
import { CurrentUserModel } from "../../auth/dto/auth.dto";
import { CommentViewModelClass } from "../entities/comments.entity";
import { LikesInfoClass } from "../comments.schema";
import { CommentsRepository } from "../comments.repository";
import { UsersLikesInfoClass } from "../../posts/posts.schema";
import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { GetPostByIdCommand } from "../../posts/use-cases/queries/get-post-by-id-query";
import { GetUserByIdCommand } from "../../super-admin/users/use-cases/queries/get-user-by-id-query";
import { HttpException } from "@nestjs/common";

export class CreateCommentCommand {
    constructor(
        public readonly dto: ModelForCreatingNewComment,
        public readonly postId: string,
        public readonly user: CurrentUserModel,
    ) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase implements ICommandHandler<CreateCommentCommand> {
    constructor(protected commentsRepository: CommentsRepository, private queryBus: QueryBus) {}

    async execute(command: CreateCommentCommand): Promise<CommentViewModelClass> {
        const post = await this.queryBus.execute(new GetPostByIdCommand(command.postId, command.user.id));
        const user = await this.queryBus.execute(new GetUserByIdCommand(command.user.id));
        if (user.banInfoForBlogs.length > 0) {
            const blogIdsWhereUserIsBanned = user.banInfoForBlogs.map((elem) => elem.blogId);
            if (blogIdsWhereUserIsBanned.includes(user.id)) throw new HttpException("Access denied", 403);
        }
        const likes: LikesInfoClass = new LikesInfoClass();
        const usersLikesInfo: UsersLikesInfoClass = new UsersLikesInfoClass();
        const createdCommentDto: CreatedCommentDto = {
            id: Number(new Date()).toString(),
            content: command.dto.content,
            createdAt: new Date(),
            likesInfo: likes,
            usersLikesInfo: usersLikesInfo,
            commentatorInfo: { userId: command.user.id, userLogin: command.user.login },
            postInfo: { id: command.postId, title: post.title, blogId: post.blogId, blogName: post.blogName },
        };
        return await this.commentsRepository.createComment(createdCommentDto);
    }
}
