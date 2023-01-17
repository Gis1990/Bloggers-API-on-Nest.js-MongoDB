import { CreatedCommentDto, ModelForCreatingNewComment } from "../../dtos/comments.dto";
import { CurrentUserModel } from "../../dtos/auth.dto";
import { CommentViewModelClass } from "../../entities/comments.entity";
import { LikesInfoClass } from "../../schemas/comments.schema";
import { CommentsRepository } from "../../repositories/comments.repository";
import { UsersLikesInfoClass } from "../../schemas/posts.schema";
import { CommandHandler, ICommandHandler, QueryBus } from "@nestjs/cqrs";
import { GetPostByIdCommand } from "../../queries/posts/get-post-by-id-query";
import { GetUserByIdCommand } from "../../queries/users/get-user-by-id-query";
import { HttpException } from "@nestjs/common";
import { CommentsFactory } from "../../factories/comments.factory";

export class CreateCommentCommand {
    constructor(
        public readonly dto: ModelForCreatingNewComment,
        public readonly postId: string,
        public readonly user: CurrentUserModel,
    ) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase implements ICommandHandler<CreateCommentCommand> {
    constructor(private commentsRepository: CommentsRepository, private queryBus: QueryBus) {}

    async execute(command: CreateCommentCommand): Promise<CommentViewModelClass> {
        const post = await this.queryBus.execute(new GetPostByIdCommand(command.postId, command.user.id));
        const user = await this.queryBus.execute(new GetUserByIdCommand(command.user.id));
        const blogIdsWhereUserIsBanned = user.banInfoForBlogs?.map((elem) => elem.blogId);
        if (blogIdsWhereUserIsBanned?.includes(post.blogId)) throw new HttpException("Access denied", 403);
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
        const createdComment = await this.commentsRepository.createComment(createdCommentDto);
        return CommentsFactory.createCommentViewModelClass(createdComment);
    }
}
