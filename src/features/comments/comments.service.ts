import { Injectable, NotFoundException } from "@nestjs/common";
import { CommentsRepository } from "./comments.repository";
import { CommentDBClass, CommentDBClassPagination, NewCommentClassResponseModel } from "./entities/comments.entity";
import { LikesInfoClass, UsersLikesInfoClass } from "../posts/entities/posts.entity";
import { ObjectId } from "mongodb";
import { ModelForCreatingNewComment, ModelForGettingAllComments } from "./dto/comments.dto";
import { CurrentUserModel } from "../auth/dto/auth.dto";

@Injectable()
export class CommentsService {
    constructor(protected commentsRepository: CommentsRepository) {}
    async getCommentById(id: string, userId: string | undefined): Promise<CommentDBClass | null> {
        const comment = await this.commentsRepository.getCommentById(id);
        if (!comment) {
            throw new NotFoundException();
        }
        if (userId) {
            comment.likesInfo.myStatus = await this.commentsRepository.returnUsersLikeStatus(id, userId);
        } else {
            comment.likesInfo.myStatus = "None";
        }
        return comment;
    }
    async getAllCommentsForSpecificPost(
        model: ModelForGettingAllComments,
        postId: string,
        userId: string | undefined,
    ): Promise<CommentDBClassPagination> {
        const comments = await this.commentsRepository.getAllCommentsForSpecificPost(model, postId);
        if (userId) {
            for (let i = 0; i < comments.items.length; i++) {
                comments.items[i].likesInfo.myStatus = await this.commentsRepository.returnUsersLikeStatus(
                    comments.items[i].id,
                    userId,
                );
            }
        } else {
            comments.items.forEach((elem) => (elem.likesInfo.myStatus = "None"));
        }
        return comments;
    }
    async createComment(
        model: ModelForCreatingNewComment,
        postId: string,
        user: CurrentUserModel,
    ): Promise<NewCommentClassResponseModel> {
        const likes: LikesInfoClass = new LikesInfoClass(0, 0, "None");
        const usersLikesInfo: UsersLikesInfoClass = new UsersLikesInfoClass([], []);
        const comment: CommentDBClass = new CommentDBClass(
            new ObjectId(),
            Number(new Date()).toString(),
            model.content,
            user.userId,
            user.login,
            postId,
            new Date().toISOString(),
            likes,
            usersLikesInfo,
        );
        const newComment = await this.commentsRepository.createComment(comment);
        return (({ id, content, userId, userLogin, addedAt, likesInfo }) => ({
            id,
            content,
            userId,
            userLogin,
            addedAt,
            likesInfo,
        }))(newComment);
    }
    async deleteCommentById(id: string, userId: string | undefined): Promise<boolean> {
        const comment = await this.commentsRepository.getCommentById(id);
        if (!comment) {
            return false;
        }
        if (userId !== comment.userId) {
            return false;
        }
        return this.commentsRepository.deleteCommentById(id);
    }
    async updateCommentById(id: string, content: string, userId: string | undefined): Promise<boolean> {
        const comment = await this.commentsRepository.getCommentById(id);
        if (!comment) {
            return false;
        }
        if (userId !== comment.userId) {
            return false;
        }
        return this.commentsRepository.updateCommentById(id, content);
    }
    async likeOperation(id: string, userId: string, likeStatus: string): Promise<boolean> {
        return this.commentsRepository.likeOperation(id, userId, likeStatus);
    }
}
