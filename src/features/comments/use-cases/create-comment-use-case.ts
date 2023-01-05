import { Injectable } from "@nestjs/common";
import { ModelForCreatingNewComment } from "../dto/comments.dto";
import { CurrentUserModel } from "../../auth/dto/auth.dto";
import { CommentViewModelClass } from "../entities/comments.entity";
import { LikesInfoClass } from "../comments.schema";
import { CommentsRepository } from "../comments.repository";
import { UsersLikesInfoClass } from "../../posts/posts.schema";

@Injectable()
export class CreateCommentUseCase {
    constructor(protected commentsRepository: CommentsRepository) {}

    async execute(
        dto: ModelForCreatingNewComment,
        postId: string,
        user: CurrentUserModel,
    ): Promise<CommentViewModelClass> {
        const likes: LikesInfoClass = new LikesInfoClass();
        const usersLikesInfo: UsersLikesInfoClass = new UsersLikesInfoClass();
        const createdCommentDto = {
            id: Number(new Date()).toString(),
            content: dto.content,
            userId: user.id,
            userLogin: user.login,
            postId: postId,
            createdAt: new Date(),
            likesInfo: likes,
            usersLikesInfo: usersLikesInfo,
        };
        return await this.commentsRepository.createComment(createdCommentDto);
    }
}
