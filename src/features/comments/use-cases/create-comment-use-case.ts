import { ModelForCreatingNewComment } from "../dto/comments.dto";
import { CurrentUserModel } from "../../auth/dto/auth.dto";
import { CommentViewModelClass } from "../entities/comments.entity";
import { LikesInfoClass } from "../comments.schema";
import { CommentsRepository } from "../comments.repository";
import { UsersLikesInfoClass } from "../../posts/posts.schema";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

export class CreateCommentCommand {
    constructor(
        public readonly dto: ModelForCreatingNewComment,
        public readonly postId: string,
        public readonly user: CurrentUserModel,
    ) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase implements ICommandHandler<CreateCommentCommand> {
    constructor(protected commentsRepository: CommentsRepository) {}

    async execute(command: CreateCommentCommand): Promise<CommentViewModelClass> {
        const likes: LikesInfoClass = new LikesInfoClass();
        const usersLikesInfo: UsersLikesInfoClass = new UsersLikesInfoClass();
        const createdCommentDto = {
            id: Number(new Date()).toString(),
            content: command.dto.content,
            userId: command.user.id,
            userLogin: command.user.login,
            postId: command.postId,
            createdAt: new Date(),
            likesInfo: likes,
            usersLikesInfo: usersLikesInfo,
        };
        return await this.commentsRepository.createComment(createdCommentDto);
    }
}
